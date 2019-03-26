import express from 'express'
import { getPDF } from './pdf'

const prod = process.env.NODE_ENV === 'production'

const app = express()

app.use(express.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const api = async (req, res) => {
  const { country, category } = req.body

  if (country && category) {
    try {
      const response = await getPDF({ country, category })
      res.send(response)
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  } else {
    res.status(500).send({ error: 'You have missed some data' })
  }
}

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


