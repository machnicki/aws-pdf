import AWS from 'aws-sdk'
import Zip from 'node-native-zip'
import { Lambda as config } from '../api/config'
import MemoryFS from 'memory-fs'
import webpack from 'webpack'
import fs from 'fs'

const lambda = new AWS.Lambda(config)

const build = async (file, name) => new Promise((resolve, error) => {
  try {
    const fs = new MemoryFS()
    const compiler = webpack({
      entry: {
        file,
      },
      target: 'node',
      optimization: {
        minimize: false
      },
      output: {
        filename: `${name}.js`,
        libraryTarget: 'commonjs'
      },
    })
    compiler.outputFileSystem = fs
    compiler.run((err, stats) => {
      if (err) return error(err)
      const content = stats.compilation.assets[`${name}.js`].source()

      resolve(content)
    })
  } catch (err) {
    console.error(err)
    error(err)
  }
})

const createLambda = async (file, name, files) => {
  const code = await build(file, name)

  const archive = new Zip()
  archive.add(`${name}.js`, Buffer.from(code, 'utf8'))


  if (process.env.JS_ONLY) {
    await new Promise((success, error) => {
      fs.writeFile(`PDFGenerator/${name}.js`, code, (err) => {
        if (err) error(err)
        success()
      })
    })
  }

  if (files && Array.isArray(files)) {
    await new Promise((success, error) => {
      archive.addFiles(files, (err) => {
        if (err) error(err)
        success()
      })
    })
  }

  const buffer = archive.toBuffer()

  if (process.env.ZIP_ONLY) {
    fs.writeFile(`./${name}.zip`, buffer, function () {
      console.log('Zip has been created in project directory.');
    })
  } else if (!process.env.JS_ONLY) {
    try {
      await lambda.deleteFunction({
        FunctionName: name,
      }).promise()
    } catch(e) {}
  
    await lambda.createFunction({
      FunctionName: name,
      Runtime: 'nodejs8.10',
      Handler: `${name}.handler`,
      Code: {
        ZipFile: buffer,
      },
      Role: 'testRole',
    }).promise()
  
    console.log(`${name} has been created`)
  }
}

const createAll = async () => {
  await createLambda('./lambda/pdf.mjs', 'PDFGenerator', [{
    name: 'phantomjs',
    path: './lambda/phantomjs',
  }, {
    name: 'scripts/pdf_a4_portrait.js',
    path: './node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js',
  }])
}

createAll()
