import AWS from 'aws-sdk'
import { DynamoDB as config } from '../config'

AWS.config.update(config)

const dynamodb = new AWS.DynamoDB()

dynamodb.deleteTable({ TableName : 'Documents' }, (err, data) => {
  if (err) {
    console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Table has been deleted. Info:', JSON.stringify(data, null, 2));
  }
})
