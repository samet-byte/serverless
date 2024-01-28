const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    try {
        // Connection URI for MongoDB
        const uri = process.env.MONGODB_URI;

        // Create a new MongoClient
        const client = new MongoClient(uri);

        // Connect to the MongoDB cluster
        await client.connect();

        // Access the database and collection
        const dbName = event.queryStringParameters.db || process.env.MONGODB_DATABASE;
        const collectionName = event.queryStringParameters.col || process.env.MONGODB_COLLECTION;
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Build the dynamic query
        let query;
        if (event.queryStringParameters.s) {
            const key = event.queryStringParameters.key || "title";
            const value = { $regex: new RegExp(event.queryStringParameters.s, 'i') };
            query = { [key]: value };
        } else {
            // If search query is empty, return 10 items
            query = {}; // You can modify this based on your requirements
        }

        // Perform your MongoDB operations here
        const result = await collection
                                .find(query)
                                // .skip(10)
                                .limit(parseInt(event.queryStringParameters.limit) || 100)
                                .toArray();
        
        // Close the client to release resources
        await client.close();

        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
