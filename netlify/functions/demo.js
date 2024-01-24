// current timestamp
const timestamp = new Date().getTime();

exports.handler = async (event) => {
    const all = event.queryStringParameters;
    const subject = event.queryStringParameters.abc || 'World';

    // Corrected loop to iterate through keys in all
    const modifiedAll = {};
    for (const key in all) {
        modifiedAll[key] = all[key];
    }

    return {
        statusCode: 200,

        body: JSON.stringify({
            data: {
                subject,
                timestamp,
                all: modifiedAll, // Corrected the structure here
            },
        }),
    };
};
