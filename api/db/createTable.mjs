import AWS from 'aws-sdk'
import fs from 'fs'
import { DynamoDB as config } from '../config'

AWS.config.update(config)

const dynamodb = new AWS.DynamoDB()

const params = {
  TableName : 'Documents',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  }
}

const saveTemplate = () => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const templateSource = fs.readFileSync('../template.html')

  docClient.put({
    TableName : 'Documents',
    Item: {
      id: 'template',
      html: templateSource.toString('base64'),
    },
  }, (err) =>  {
    if (err) {
      console.error('Unable to add template. Error JSON:', JSON.stringify(err, null, 2))
    } else {
      console.log('Put template add succeeded')
    }
  })
}

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
    saveTemplate()
  }
})

