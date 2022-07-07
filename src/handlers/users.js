import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function users(event, context) {
  const { username } = JSON.parse(event.body);
  const now = new Date();

  const user = {
    id: uuid(),
    username,
    createdAt: now.toISOString(),
  };

  await dynamodb.put({
    TableName: process.env.USERS_TABLE_NAME,
    Item: user
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

export const handler = users;


