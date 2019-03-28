const useLocal = process.env.LOCALSTACK_HOSTNAME || (process.env.NODE_ENV !== 'production')
const isLambda = !!process.env.LAMBDA

const DynamoDB = {
  region: 'eu-west-2',
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4569` : undefined,
  ...isLambda ? {} : {
    accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
  },
}

const S3 = {
  region: 'eu-west-2',
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4572` : undefined,
  s3ForcePathStyle: true,
  ...isLambda ? {} : {
    accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
  },
}

const Lambda = {
  endpoint: useLocal ? `http://${process.env.LOCALSTACK_HOSTNAME || 'localhost'}:4574` : undefined,
  region: 'eu-west-2',
  ...isLambda ? {} : {
    accessKeyId: useLocal ? 'access-key' : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: useLocal ? 'secret-key' : process.env.AWS_SECRET_ACCESS_KEY,
  },
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
