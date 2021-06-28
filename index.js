require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// Connect to middleware
app.use(express.static('build'));
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

// ErrorHandler from fullstackopen's code
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    console.log('sent a validation error');
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

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

app.get('/api', (req, res, next) => {
  const date = new Date();

  Person.find({})
    .then((persons) => {
      res.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${date}</p>
    `);
    })
    .catch((err) => next(err));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((returnedPersons) => {
      res.json(returnedPersons);
    })
    .catch((err) => next(err));
  // res.json(persons);
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
  // const id = Number(req.params.id);
  // const person = persons.find((p) => p.id === id);

  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).end();
  // }
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));

  // const id = Number(req.params.id);
  // persons = persons.filter((person) => person.id !== id);
});

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'name missing' });
  }
  if (!req.body.number) {
    return res.status(400).json({ error: 'number missing' });
  }
  if (persons.find((p) => p.name === req.body.name)) {
    return res.status(400).json({ error: 'name already exists' });
  }

  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));

  // const newId = Math.floor(Math.random() * 1000000);

  // const newPerson = {
  //   name: person.name,
  //   number: person.number,
  //   id: newId,
  // };

  // persons = persons.concat(newPerson);
  // console.log(person);

  // res.json(newPerson);
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
