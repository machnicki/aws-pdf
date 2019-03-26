import AWS from 'aws-sdk'
import { Lambda as config } from './config'

const generatePDF = async (fileName) => new Promise((resolve, error) => {
  const lambda = new AWS.Lambda(config)
  lambda.invoke({
    FunctionName: "PDFGenerator",
    Payload: JSON.stringify({
      fileName,
    }),
    }, (err, data) => {
    if (err) throw err
    console.log('lambda response => ', JSON.stringify(data))
    resolve(data.Payload)
  })
})

export default generatePDF

// alernative version - without AWS
// const pdfUrl = await new Promise((resolve, reject) => {
//   pdf.create(html, { format: 'A4' })
//     .toStream(async function(error, stream) {
//       if (error) reject(error)
//       stream.pipe(fs.createWriteStream(`./pdf/${fileName}`))
//       stream.on('end', () => {
//         resolve(`http://localhost:3001/documents/${fileName}`)
//       })
//     })
//   // to file is faster then streams
//   .toFile(`./pdf/${fileName}`, (error, response) => {
//     if (error) reject(error)
//     resolve(`http://localhost:3001/pdf/${fileName}`)
//   })
// })
