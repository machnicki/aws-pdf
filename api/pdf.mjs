import axios from 'axios'
import Handlebars from 'handlebars'
import format from 'date-fns/format'
import { getTemplate, saveDocument, deleteDocument } from './db/documents'
import { getUrl } from './s3/documents'
import generatePDF from './pdf-generator'

const getAPIData = async ({ country, category }) => {
  const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`)
  if (data && data.articles && data.articles.length > 0) return data.articles
  throw new Error('Bad response from newsapi!')
}

export const getPDF = async ({ country, category }) => {
  const date = format(new Date(), 'YYYY-MM-DD_HH')
  const fileName = `${country}-${category}-${date}.pdf`
  const fileUrl = await getUrl(fileName)

  if (fileUrl) return fileUrl

  // if (fs.existsSync(`./pdf/${fileName}`)) return `http://localhost:3001/pdf/${fileName}`

  console.time('getAPIData')
  const data = await getAPIData({ country, category })
  console.timeEnd('getAPIData')
  console.time('templating')
  const templateSource = await getTemplate()
  const template = Handlebars.compile(templateSource)
  
  const html = template({
    headline: `NEWS ${country.toUpperCase()} / ${category} / ${date}`,
    articles: data,
  })
  console.timeEnd('templating')

  console.time('saveDocument')
  await saveDocument(fileName, html)
  console.timeEnd('saveDocument')
  console.time('generatePDF')
  const pdf = await generatePDF(fileName)
  console.timeEnd('generatePDF')
  console.time('deleteDocument')
  await deleteDocument(fileName)
  console.timeEnd('deleteDocument')
  return pdf
}
