const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

var morgan = require('morgan')

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
}))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people<p>
        <p>${date}<p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const name = request.body.name
  const number = request.body.number

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = {
    name,
    number,
    id
  }

  persons = persons.filter(note => note.id !== id).concat(person)

  response.json(person)
})

const generateId = () => Math.floor(Math.random() * 1000)
  
app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    }

    if (persons.map(person => person.name).includes(name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        name,
        number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
