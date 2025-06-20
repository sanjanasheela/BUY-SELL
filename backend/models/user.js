const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age:{
        type: Number,
        required:true,
    },
    contactnumber:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
