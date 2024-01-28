// patch.js

const { MongoClient, ObjectId } = require('mongodb');
const paramConfig = require('../../../custom_config/paramConfig');

async function patchDataInMongoDB(event) {
    const {
        uri,
        database,
        collection,
        // id
    } = paramConfig(event);

    const updatedData = JSON.parse(event.body);
    const id = event.queryStringParameters.id || null;

    const client = new MongoClient(uri);
    let isSuccessful = false;

    try {
        await client.connect();

        const db = client.db(database);
        const myCollection = db.collection(collection);

        // Update data
        const result = await myCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                ...JSON.parse(event.body),
                dateEdited: new Date().toISOString(),
            } }
        );

        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`);
        isSuccessful = result.modifiedCount > 0;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        return { isSuccessful };
    }
}

module.exports = async function (event) {
    try {

        const result = await patchDataInMongoDB(event);
        console.log(result.isSuccessful);

        if (result.isSuccessful) {
            return JSON.stringify({ 
                message: 'Data updated successfully',
                isSuccessful: true,
                id: event.queryStringParameters.id,
                updatedData: JSON.parse(event.body)
            });
        } else {
            return JSON.stringify({ 
                message: 'Error updating data',
                isSuccessful: false,
                id: event.queryStringParameters.id,
                dataTriedToUpdate: JSON.parse(event.body)
            });
        }
    } catch (error) {
        console.error('Error handling PATCH request:', error);
        return JSON.stringify({ 
            message: 'Internal server error',
            isSuccessful: false,
            id: event.queryStringParameters.id,
            dataTriedToUpdate: JSON.parse(event.body)
        });
    }
};
