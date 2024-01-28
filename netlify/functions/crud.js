const get = require('./process_body/get');
const post = require('./process_body/post');
const put_patch = require('./process_body/put_patch');
const deleteSingle = require('./process_body/delete');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    
    let response = {};

    switch (httpMethod) {
        case 'OPTIONS':
            // Handle preflight OPTIONS request
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify('Preflight request successful'),
            };
            break;

        case 'GET':
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: await get(event),

            };
            break;

        case 'POST':
            response = {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: await post(event)
            };
            break;

        case 'PUT':
            response = {
                statusCode: 202,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: await put_patch(event)
            };
            break;
            
            case 'PATCH':
                response = {
                    statusCode: 202,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                },
                body: await put_patch(event)
            };
            break;

        case 'DELETE':
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: await deleteSingle(event)
            };
            break;

        case 'HEAD':
            // No response body, just headers
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
            };
            break;

        default:
            // Handle unsupported methods
            response = {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: { message: 'Unsupported HTTP method' },
            };
    }

    return response;
};
