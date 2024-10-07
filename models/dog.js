const mongoose= require('mongoose');
const Shelter = require('./shelter');

const dogSchema= new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    age: {
        type: Number,
    },
    breed: {
        type: String,
    },
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter"
    },
     image: {
        type: String, 
     }
});

const Dog = mongoose.model('Dog', dogSchema);
module.exports= Dog;