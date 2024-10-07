const mongoose= require("mongoose");

const shelterSchema= new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    // dogs: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Dog",
    // }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        type: String, 
    },
});

const Shelter= mongoose.model('Shelter', shelterSchema);
module.exports = Shelter;