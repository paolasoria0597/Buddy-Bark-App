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

dogSchema.post('save', async (recentlyCreatedDog) => {
      try{
        const shelter = await Shelter.findById(recentlyCreatedDog.shelter)
        if (shelter) {
            shelter.dogs.push(recentlyCreatedDog._id)
            await shelter.save()
        }
      } catch (error){
         console.log('Error updating Shelter with new Dog. Shelter does not have a reference to this dog', error)
      }
})


const Dog = mongoose.model('Dog', dogSchema);
module.exports= Dog;