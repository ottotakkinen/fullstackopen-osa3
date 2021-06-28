const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('password missing from arguments');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://takkinen:${password}@fullstackopen.icfte.mongodb.net/people-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((response) => {
    console.log('note saved');
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  console.log('phonebook');
  Person.find({}).then((res) => {
    res.forEach((person) => {
      console.log(person.name, person.number);
      mongoose.connection.close();
    });
  });
}
