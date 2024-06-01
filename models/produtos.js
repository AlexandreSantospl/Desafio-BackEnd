const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Produto = new Schema({
    nome: {
        type: String,
        required: true
    }
})

mongoose.model("produtos", Produto);
