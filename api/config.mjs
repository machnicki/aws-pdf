const useLocal = process.env.LOCALSTACK_HOSTNAME || (process.env.NODE_ENV !== 'production')

const DynamoDB = {
  region: 'eu-west-2',
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4569` : undefined,
  accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
}

const S3 = {
  region: 'eu-west-2',
  accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4572` : undefined,
  s3ForcePathStyle: true,
}

const Lambda = {
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4574` : undefined,
  region: 'eu-west-2',
  accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
}

const config = {
  DynamoDB,
  S3,
  Lambda,
}

export {
  DynamoDB,
  S3,
  Lambda,
}

export default config
