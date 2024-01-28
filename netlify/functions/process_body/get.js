// processBody/get.js

// const dbConfig = require('../../../dbConfig');
// const { parse } = require('dotenv');

const paramConfig = require('../../../paramConfig');
const { MongoClient, ObjectId } = require('mongodb');

async function getDataFromMongoDB(event) {
   const { 
        uri, 
        database, 
        collection,
        id,
    } = paramConfig(event);
    
    const client = new MongoClient(uri);
    let isSuccessful = false;
    let result = null;

    try {
        await client.connect();
        const db = client.db(database);
        const myCollection = db.collection(collection);

        if (id) {
            result =  await getOne(myCollection, event);
        } else result =  await getAll(myCollection, event);
        isSuccessful = true;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        return { isSuccessful, result };
    }
}

async function getAll(myCollection, event) {
    const { skip, limit, key, sort } = paramConfig(event);
    

    // console.log(sort);


   

     
    let query = {};
    if (key) {
        console.warn('key', key);
        query = await findAllOccurancesQuery(event, myCollection);
    }

    const result = await myCollection
                            .find(
                                    query, 
                                    // {_id: 0} // projection, eliminate fields
                                )
                            .skip(parseInt(skip))
                            .limit(parseInt(limit))
                            .sort(sort)
                            .toArray();
    return result;
}

async function getOne(myCollection, event) {
    const result = await myCollection.findOne({ _id: new ObjectId(event.queryStringParameters.id) });
    return result;
}


async function findAllOccurancesQuery(key, collection) {
    const regexPattern = new RegExp(key, "i");

    const orClauses = [];

    // Assuming 'collection' is your MongoDB collection object
    const sampleDocument = await collection.findOne();
    // console.log(sampleDocument);
    
    if (sampleDocument) {
        const fieldNames = Object.keys(sampleDocument);
        // console.log(fieldNames);

        for (const fieldName of fieldNames) {
            const fieldQuery = { [fieldName]: { $regex: new RegExp("lynn", "i") } };
            // console.log(fieldQuery);
            orClauses.push(fieldQuery);
        }
    }

    const query = { $or: orClauses };
    console.log(query);
    return query;
}


module.exports = async function (event) {
    try {
        const result = await getDataFromMongoDB(event);
        console.log(result.isSuccessful);

        if (result.isSuccessful) {
            return JSON.stringify(result.result);
        } else {
            return JSON.stringify({ message: 'Error retrieving data' });
        }
    } catch (error) {
        console.error('Error handling GET request:', error);
        return JSON.stringify({ message: 'Internal server error' });
    }
};