const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let date = new Date()
let day = date.getDate()
let month = date.getMonth()
let year = date.getFullYear()
let prazo = (date.getDate()) + 14
if (prazo > 31) {
    month = (date.getMonth()) + 1
    prazo = prazo - 31
}

const Pedido = new Schema({
    solicitado: {
        type: Boolean,
        default: false
    },
    finalizado: {
        type: Boolean,
        default: false
    },
    etapa: {
        type: Boolean,
        default: false
    },
    nome: {
        type: String,
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: "produtos",
        required: true
    },
    item1: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item2: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item3: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item4: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item5: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item6: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item7: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    item8: {
        type: Schema.Types.ObjectId,
        ref: "produtos"
    },
    quantidade: {
        type: Number,
        required: true
    },
    quantidade1: {
        type: Number
    },
    quantidade2: {
        type: Number
    },
    quantidade3: {
        type: Number
    },
    quantidade4: {
        type: Number
    },
    quantidade5: {
        type: Number
    },
    quantidade6: {
        type: Number
    },
    quantidade7: {
        type: Number
    },
    quantidade8: {
        type: Number
    },
    observacao: {
        type: String
    },
    data: {
        type: String,
        default: `${day}/${month + 1}/${year}`
    },
    preco: {
        type: Number,
        default: 0
    },
    preco1: {
        type: Number,
        default: 0
    },
    preco2: {
        type: Number,
        default: 0
    },
    preco3: {
        type: Number,
        default: 0
    },
    preco4: {
        type: Number,
        default: 0
    },
    preco5: {
        type: Number,
        default: 0
    },
    preco6: {
        type: Number,
        default: 0
    },
    preco7: {
        type: Number,
        default: 0
    },
    preco8: {
        type: Number,
        default: 0
    },
    observacao: {
        type: String
    },
    loja: {
        type: String,
        default: ""

    },
    loja1: {
        type: String,
        default: ""


    },
    loja2: {
        type: String,
        default: ""

    },
    loja3: {
        type: String,
        default: ""
    },
    loja4: {
        type: String,
        default: ""
    },
    loja5: {
        type: String,
        default: ""
    },
    loja6: {
        type: String,
        default: ""
    },
    loja7: {
        type: String,
        default: ""
    },
    loja8: {
        type: String,
        default: ""
    },
    entrega: {
        type: String,
        default: `${prazo}/${month + 1}/${year}`
    },
    criacao: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Pedido Solicitado"
    },
    total: {
        type: Number,
        default: 0
    }

})


mongoose.model("pedidos", Pedido);