const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://VeeraHil:${password}@veeradb.hrc3lns.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: 'Aku Ankka',
    number: '313',
})

person.save().then(result => {
    console.log('Person added!')
    mongoose.connection.close()
})