const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')


const cors = require('cors')
const persons = [
     {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Olavi Virta",
      "number": "12-55-2222131",
      "id": "Olavi Virta"
    },
    {
      "name": "Teuvo Hakkarainen",
      "number": "013-155-1233-111",
      "id": "Teuvo Hakkarainen"
    }
  ];


app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

const generateId = () => {

    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (persons.find(person => person.name == body.name)) {
        return response.status(400).json({
            error: 'name is already in the list'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {

    const date = new Date()
    const message = `
    <p>Phonebook has info for ${persons.length} persons</p>
    <p>${date}</p>
    `

    response.send(message)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})