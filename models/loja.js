const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Loja = new Schema({
    nome: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        default: '10000000000000'
    },
    endereco: {
        type: String,
        required: true
    },
    telefone: {
        type: Number,
        required: true
    }
})

mongoose.model("lojas", Loja);