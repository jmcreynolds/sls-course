import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { offline_options } from '../../offline/lib/dynamo_data';

let options = offline_options();
process.env.USERS_TABLE_NAME = 'UserTable-dev';

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


