import express from 'express'
import { getPDF } from './pdf'
import { getDocument, getDocuments, getTemplate, saveTemplate } from './db/documents'

const prod = process.env.NODE_ENV === 'production'

const app = express()

app.use(express.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const api = async (req, res) => {
  const { country, category, id } = req.body

  if (country && category || id) {
    try {
      const response = await getPDF({ country, category, id })
      res.send(response)
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  } else {
    res.status(500).send({ error: 'You have missed some data' })
  }
}

const documents = async (req, res) => {
  try {
    const name = req.query.name

    if (name) {
      const response = await getDocument(name, true)
      res.send(response)
    } else {
      const response = await getDocuments()
      res.send(response)
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const template = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const template = await getTemplate(true)
      res.send(template)
    } else if (req.method === 'POST') {
      const { template } = req.body
      if (template) {
        await saveTemplate(template)
        res.send(template)
      } else  {
        res.status(500).send({ error: 'You have missed some data' })
      }
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

app.get('/api/template', template)
app.post('/api/template', template)
app.get('/api', documents)
app.post('/api', api)

// app.use('/pdf', express.static('pdf'))

if (prod) {
  app.use('/', express.static('build')) // react webpack build
  app.listen(3000, () => console.log('Server running on port 3000'))
} else {
  app.get('/', (req, res) =>  {
    res.redirect('http://localhost:3000') // react webpack dev server
  })
  app.listen(3001, () => console.log('Server running on port 3001'))
}


