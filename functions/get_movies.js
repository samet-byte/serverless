
const { MongoClient } = require("mongodb");
require("dotenv").config();


const uri = process.env.MONGO_URI;
const mongoClient = new MongoClient(uri); // { useNewUrlParser: true, useUnifiedTopology: true }

const clientPromise = mongoClient.connect();

const myDb = process.env.MONGODB_DATABASE;
const myCollection = process.env.MONGODB_COLLECTION;

const handler = async (event) => {
  try {
    const client = await clientPromise;
    const db = client.db(myDb);
    const collection = db.collection(myCollection);
    // const movies = await collection.find().toArray();
    const result = await collection.find({}).limit(10).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ movies }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

exports.handler = handler;

// // Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//   try {
//     const subject = event.queryStringParameters.name || 'World'
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     }
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() }
//   }
// }

// module.exports = { handler }
