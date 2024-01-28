// post stuff to mongodb

const paramConfig = require('../../../custom_config/paramConfig');
const { MongoClient } = require('mongodb');

let newItem = null;

// Sample data to insert
let dataToInsert = {
    title: 'Sample Movie',
    genre: 'Action',
    releaseYear: 2022,
    // Add more fields as needed
};

// Connect to MongoDB and insert data
async function postDataToMongoDB(event) {

    const {
        uri,
        database,
        collection,
    } = paramConfig(event);
    
    const body = JSON.parse(event.body);

        dataToInsert = {
            // ...dataToInsert,
            ...body,
            dateAdded: new Date().toISOString(),
            dateEdited: new Date().toISOString(),    
        };
    

    const client = new MongoClient(uri);
    let isSuccessful = false;
    try {
        await client.connect();

        const db = client.db(database);
        const col = db.collection(collection);

        // Insert data
        const result = await col.insertOne(dataToInsert);
        console.log (`Inserted ${result.insertedCount} document into the collection.`);
        isSuccessful = true;

        // Get the newly added item's ID
        newItem = await col.findOne({
            ...body
        });

    } catch (error) {
        console.error('Error:', error);
        console.log('Error', error);
    }
     finally {
        await client.close();
        return { isSuccessful };
    }
}


module.exports = async function (event) {
    try {
        const result = await postDataToMongoDB(event);
        console.log(result.isSuccessful);

        if (result.isSuccessful) {
            return JSON.stringify({ 
                message: 'Data inserted successfully',
                isSuccessful: true,
                id: newItem._id,
                data : newItem
            });
        } else {
            return JSON.stringify({ 
                message: 'Error inserting data',
                isSuccessful: false,
                data : dataToInsert
            });
        }
    } catch (error) {
        console.error('Error handling POST request:', error);
        return JSON.stringify({ 
            message: 'Internal server error',
            isSuccessful: false,
            data : dataToInsert
        });
    }
};
