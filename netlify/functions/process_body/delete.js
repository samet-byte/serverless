const paramConfig = require('../../../paramConfig');
const { MongoClient, ObjectId } = require('mongodb');

async function deleteFromMongoDB(event) {
    const {
        uri,
        database,
        collection,
        id,
    } = paramConfig(event);

    const client = new MongoClient(uri);
    let isSuccessful = false;

    try {
        await client.connect();
        const db = client.db(database);
        const myCollection = db.collection(collection);

        const result = await myCollection.deleteOne({ _id: new ObjectId(id) });
        console.log(`Deleted ${result.deletedCount} document(s).`);
        isSuccessful = result.deletedCount > 0;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        return { isSuccessful };
    }
}

module.exports = async function (event) {
    try {

        const result = await deleteFromMongoDB(event);
        console.log(result.isSuccessful);

        if (result.isSuccessful) {
            return JSON.stringify({
                message: 'Data deleted successfully',
                isSuccessful: true,
                id: event.queryStringParameters.id,
            });
        } else {
            return JSON.stringify({ 
                message: 'Error deleting data',
                isSuccessful: false,
                id: event.queryStringParameters.id,
            });
        }
    } catch (error) {
        console.error('Error handling DELETE request:', error);
        return JSON.stringify({ 
            message: 'Internal server error',
            isSuccessful: false,
            id: event.queryStringParameters.id,
        });
    }
};