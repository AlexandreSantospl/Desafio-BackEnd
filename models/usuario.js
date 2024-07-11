const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Usuario = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
})


mongoose.model("usuarios", Usuario)