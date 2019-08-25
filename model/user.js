const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 18
    },
    age: {
        type: String,
        min: 1,
        max: 100
    },
    email: {
        type: String
    },
    hobbies: {
        type: [String]
    }
});

module.exports = mongoose.model('User', userSchema);