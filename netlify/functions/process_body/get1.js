// get 1 from MongoDb

const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('test');
        const result = await collection.findOne({ _id: 1 });
        return result;
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
    }
}