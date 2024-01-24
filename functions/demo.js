// cuurent timestamp
const timestamp = new Date().getTime()

exports.handler = async event => {
    const subject = event.queryStringParameters.sam || 'World'
    return {
        statusCode: 200,
        body: `Sam: ${subject}! ${timestamp}`,
    }
}