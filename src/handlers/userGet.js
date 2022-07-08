import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

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

export const handler = middy(userGet)
.use(httpJsonBodyParser())
.use(httpEventNormalizer())
.use(httpErrorHandler());


