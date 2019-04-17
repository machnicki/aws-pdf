import AWS from 'aws-sdk'
import { DynamoDB as config } from '../config'

AWS.config.update(config)
  const docClient = new AWS.DynamoDB.DocumentClient()

export const getTemplate = async (base64 = false) => {
  // const templateSource = fs.readFileSync('api/template.html', 'utf-8') // 10x faster locally
  const { Item: { html: html64 } } = await docClient.get({
    TableName : 'Documents',
    Key: {
      id: 'template',
    },
  }).promise()

  if (base64) return html64

  const buffer = Buffer.from(html64, 'base64')
  return buffer.toString('utf-8')
}

export const saveTemplate = async (template) => docClient.put({
  TableName : 'Documents',
  Item: {
    id: 'template',
    html: template,
  },
}).promise()

export const saveDocument = async (fileName, html) => docClient.put({
  TableName : 'Documents',
  Item: {
    id: fileName,
    html: Buffer.from(html, 'utf-8').toString('base64'),
  },
}).promise()

export const getDocument = async (fileName, base64 = false) => {
  const { Item: { html: html64 } } = await docClient.get({
    TableName : 'Documents',
    Key: {
      id: fileName,
    },
  }).promise()

  if (base64) return html64

  const buffer = Buffer.from(html64, 'base64')
  return buffer.toString('utf-8')
}

export const getDocuments = async () => {
  const data = await docClient.scan({
    TableName : 'Documents',
    ProjectionExpression: 'id',
    FilterExpression: 'contains(#id, :name)',
    ExpressionAttributeNames: {
        '#id': 'id',
    },
    ExpressionAttributeValues: {
        ':name': 'pdf',
    },
  }).promise()

  return data
}

export const deleteDocument = async (fileName) => docClient.delete({
  TableName : 'Documents',
  Key: {
    id: fileName,
  },
}).promise()
