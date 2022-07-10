import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

let options = {};

if (process.env.IS_OFFLINE){
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function usersGet(event, context) {
    let users;

    try {
        const result = await dynamodb.scan({
            TableName: process.env.USERS_TABLE_NAME,
        }).promise();
        users = result.Items;
    }catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(users),
    };
}

export const handler = commonMiddleware(usersGet);


