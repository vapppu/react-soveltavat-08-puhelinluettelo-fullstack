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

// If no additional parameters given, print phonebook
if (process.argv.length < 5) {
    Person.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// If 5 parameters were given, add new person to phonebook
else if (process.argv.length === 5) {

    const [name, number] = [process.argv[3], process.argv[4]]

    const person = new Person({
        name: name,
        number: number,
    })
    
    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

else {
    mongoose.connection.close()
}