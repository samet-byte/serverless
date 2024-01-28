module.exports = function (event) {
    const uri = event.queryStringParameters.uri || process.env.MONGODB_URI;
    const database = event.queryStringParameters.db || process.env.MONGODB_DATABASE;
    const collection = event.queryStringParameters.col || process.env.MONGODB_COLLECTION;

    const skip = event.queryStringParameters.skip || 0;
    const limit = event.queryStringParameters.limit || 100;

    const id = event.queryStringParameters.id || null;

    const q = event.queryStringParameters.q || null;

    // const sortParams = event.queryStringParameters.sort || null;

    // let sort = {};

    // if (sortParams) {
    //     const sortArray = sortParams.split(',');
    //     sort = { [sortArray[0]]: parseInt(sortArray[1]) };
    // }

    const sortArray = event.queryStringParameters.sort || null;

    console.log(sortArray);

    // Initialize an empty sort object
    const sort = {};

    if(sortArray) {
        const sortSeperated = sortArray.split('*');
        // console.log(sortSeperated);

        // Iterate through the sort parameters
        for (const param of sortSeperated) {
            // Extract the field and order after trimming any spaces
            const [field, order] = param.trim().split(',');

            // Add the field and order to the sort object
            sort[field] = parseInt(order);
            // console.log(sort);
    }
}
    


    return { 
        uri, 
        database, 
        collection,
        skip,
        limit,
        q,
        sort,
        id
     };
}