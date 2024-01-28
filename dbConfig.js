
module.exports = function (event) {
    const uri = event.queryStringParameters.uri || process.env.MONGODB_URI;
    const database = event.queryStringParameters.db || process.env.MONGODB_DATABASE;
    const collection = event.queryStringParameters.col || process.env.MONGODB_COLLECTION;

    return { uri, database, collection };
}