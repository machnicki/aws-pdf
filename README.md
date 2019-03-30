# AWS Lambda PDF News generator

## Run locally with Localstack

1. Go to `newsapi.org`, get apiKey for theirs API and set it as `NEWS_API_KEY` env variable on your machine
1. Download Localstack from [this repo](https://github.com/localstack/localstack)
1. `cd {localstack DIR}`
1. `TMPDIR=/private$TMPDIR LAMBDA_EXECUTOR=docker docker-compose up` - you need to run Localstack via docker to have all services, `TMPDIR=/private$TMPDIR` prefix is necessary on Mac (as docker has problems with symbolic links)
1. Another terminal: `cd {this project DIR}`
1. `npm install` - postisntall will create DB, S3 and Lambda function
1. `npm run server` - Express backend
1. Another terminal: `npm start` - React webpack devserver

As a final result you should have 3 running processes in differents terminals (Localstack, Express API, React UI) and open application on `http://localhost:3000`
