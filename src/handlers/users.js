import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function users(event, context) {
  const { username } = event.body;
  const now = new Date();

  const user = {
    id: uuid(),
    username,
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb.put({
      TableName: process.env.USERS_TABLE_NAME,
      Item: user
    }).promise();
  }catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

export const handler = middy(users)
.use(httpJsonBodyParser())
.use(httpEventNormalizer())
.use(httpErrorHandler());


