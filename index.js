const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

morgan.token('body-content', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body-content'
  )
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people.</p>
    <p>${date}</p>
  `);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'name missing' });
  }
  if (!req.body.number) {
    return res.status(400).json({ error: 'number missing' });
  }
  if (persons.find((p) => p.name === req.body.name)) {
    return res.status(400).json({ error: 'name already exists' });
  }

  const person = req.body;

  const newId = Math.floor(Math.random() * 1000000);

  const newPerson = {
    name: person.name,
    number: person.number,
    id: newId,
  };

  persons = persons.concat(newPerson);
  console.log(person);

  res.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
