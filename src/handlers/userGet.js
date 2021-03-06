import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { offline_options } from '../../offline/lib/dynamo_data';

let options = offline_options();
process.env.USERS_TABLE_NAME = 'UserTable-dev';


const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function userGet(event, context) {
    let user;
    const { id } = event.pathParameters;

    try {
        const result = await dynamodb.get({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { id },
        }).promise();
        user = result.Item;
    }catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if(!user){
        throw new createError.NotFound(`User with "${id}" Not Found`);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(user),
    };
}

export const handler = commonMiddleware(userGet);


