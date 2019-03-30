import AWS from 'aws-sdk'
import { S3 as config } from '../config'

const s3client = new AWS.S3(config)

const BUCKET = 'silesis'

export const create = () => s3client.createBucket(
  {
    Bucket: BUCKET,
  },
  (err, response) => {
    if (err) throw err
    console.log('S3 bucket has been created: ', response)
  },
)

export const upload = async (name, data) => 
  new Promise((resolve) => {
    s3client.upload(
      {
        Bucket: BUCKET,
        Key: `documents/${name}`,
        Body: data,
        ContentType: 'application/pdf',
        ACL: 'public-read',
      },
      (err, response) => {
        if (err) throw err
        resolve(response)
      },
    )
  })

export const doestExist = async (name) => new Promise((resolve) => s3client.headObject(
  {
    Bucket: BUCKET,
    Key: `documents/${name}`,
  },
  (err, response) => {
    if (err && err.code) {
      resolve(undefined)
    } else if (err) {
      throw err
    } else {
      resolve(true)
    }
  },
))

export const getSignedUrl = (name) => s3client.getSignedUrl('putObject', {
  Bucket: BUCKET,
  Key: `documents/${name}`,
  ContentType: 'application/pdf',
  ACL: 'public-read',
})

export const getUrl = async (name) => {
  if (await doestExist(name)) {
    //return getSignedUrl(name)
    return `${config.baseUrl}/${BUCKET}/documents/${name}`
  } return undefined
}
