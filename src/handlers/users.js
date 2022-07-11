import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { offline_options } from '../../offline/lib/dynamo_data';

let options = offline_options();
process.env.USERS_TABLE_NAME = 'UserTable-dev';

const dynamodb = new AWS.DynamoDB.DocumentClient(options);


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
    //console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

export const handler = commonMiddleware(users);
