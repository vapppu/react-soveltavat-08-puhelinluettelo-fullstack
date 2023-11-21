require('dotenv').config()


const express = require ('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req) => 
   JSON.stringify(req.body))

app.use(express.json())

app.use(morgan(function (tokens, req, res) {

  const loggingString = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

  if (req.method === "POST")
  {
    return [loggingString, tokens['body'](req)].join(' ')
  }
  return loggingString
   
}))


let persons = 
[
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
    res.send("<h1>Puhelinluettelo</h1>")
})

app.get('/info', (req, res) => {
    const date = Date.now()
    res.send(`<p>Phonebook has info for ${persons.length} people.<p><p>${new Date(date).toString()}</p>`)
    })

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })


app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const person = persons.find(person => String(person.id) === req.params.id)
  if (person) {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).end()
  }
  else {
    res.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number))
  {
    return response.status(400).json({error: 'content missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)