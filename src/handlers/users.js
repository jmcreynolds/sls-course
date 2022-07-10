import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
const util = require('util');


let options = {};

if (process.env.IS_OFFLINE){
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

console.log('OPTIONS: ', options);

async function users(event, context) {
  const { username } = event.body;
  const now = new Date();

  const user = {
    id: uuid(),
    username,
    createdAt: now.toISOString(),
  };

  console.log('USER: ', user);
  console.log(JSON.stringify(process.env.USERS_TABLE_NAME, null, 2));

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

export const handler = commonMiddleware(users);
