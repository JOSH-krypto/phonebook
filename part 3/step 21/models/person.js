const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
    type:String,
    minLength:3
  },
  number: {
   type: String,
   minlentgh:8,
   validate:{
   validator:function(v){
    return /\d{2}-\d{6}|\d{3}-\d{5}/.test(v)
   },
   message: props=>`${props.value} is an invalid number!!`
  }
}
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)