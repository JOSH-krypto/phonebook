const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phone_user:${password}@cluster0.aqqukzg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')

  Phone.find({}).then(result => {
    result.forEach(phone => {
      console.log(`${phone.name} ${phone.number}`)
    })
    mongoose.connection.close()
  })
}


else if (process.argv.length === 5) {
  const phone = new Phone({
    name: process.argv[3],
    number: process.argv[4],
  })

  phone.save().then(result => {
    console.log(
      `added ${result.name} number ${result.number} to phonebook`
    )
    mongoose.connection.close()
  })}
