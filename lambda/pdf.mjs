import pdf from 'html-pdf'
import path from 'path'
import { getDocument } from '../api/db/documents'
import { upload, getUrl } from '../api/s3/documents'

const handler = async (event, context) => {
    const { fileName } = event
    console.time('getDocument')
    const html = await getDocument(fileName)
    console.timeEnd('getDocument')

  try {
    const pdfUrl = await new Promise((resolve, error) => {
      try {
        pdf.create(html, { // SIGKILL error for large payloads - setting more memory in Lambda fixes it
          format: 'A4',
          phantomPath: `${path.resolve()}/phantomjs`, 
          timeout: '100000',
        })
          .toStream(async function(err, stream) {
            if (err) throw err
            console.time('uploadToS3')
            await upload(fileName, stream)
            console.timeEnd('uploadToS3')
            resolve(getUrl(fileName))
          })
      } catch (err) {
        console.error('problem with pdf.create', err)
        error(err)
      }
    })

    return pdfUrl
  } catch(err) {
    console.error('error in lambda', err)
  }
}

export {
  handler,
}
