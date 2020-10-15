const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personSchema = Schema({
  name: String,
  image: String,
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
