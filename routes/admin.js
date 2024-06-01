const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/loja");
const Loja = mongoose.model("lojas");
require("../models/produtos");
const Produto = mongoose.model("produtos");
require("../models/pedido");
const Pedido = mongoose.model("pedidos");
const { admin } = require("../helpers/admin");
const { auth } = require("../helpers/autenticado");
const { diretor } = require("../helpers/diretor");

router.get("/criar/produto", admin, (req, res) => {
    res.render("criacao/criarproduto")
})

router.post("/criarproduto", admin, (req, res) => {
    const newProduto = {
        nome: req.body.nome
    }

    new Produto(newProduto).save().then(() => {
        req.flash("success_msg", "Produto Salvo com Sucesso!")
        res.redirect("/")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar o produto!")
        res.redirect("/")
    })
})

router.get("/criar/loja", admin, (req, res) => {
    res.render("criacao/criarloja")
})

router.post("/criarloja", admin, (req, res) => {
    const newLoja = {
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    }

    new Loja(newLoja).save().then(() => {
        req.flash("success_msg", "Sucesso ao registrar nova loja!")
        res.redirect("/")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao registrar nova loja!")
        res.redirect("/")
    })

})

router.get("/criar/pedido", auth, (req, res) => {
    Pedido.find().lean().then((pedidos) => {
        Produto.find().lean().sort({ nome: 'asc' }).then((produtos) => {
            res.render("criacao/criarpedido", { produtos: produtos, pedidos: pedidos })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar a pagina")
            res.redirect("/")
        })
    })
})

router.post("/criarpedido", (req, res) => {
    const newPedido = {
        nome: req.body.nome,
        observacao: req.body.descricao,

        item: req.body.produto,
        quantidade: req.body.quantidade,

        item1: req.body.produto1,
        quantidade1: req.body.quantidade1,

        item2: req.body.produto2,
        quantidade2: req.body.quantidade2,

        item3: req.body.produto3,
        quantidade3: req.body.quantidade3,

        item4: req.body.produto4,
        quantidade4: req.body.quantidade4,

        item5: req.body.produto5,
        quantidade5: req.body.quantidade5,

        item6: req.body.produto6,
        quantidade6: req.body.quantidade6,

        item7: req.body.produto7,
        quantidade7: req.body.quantidade7,

        item8: req.body.produto8,
        quantidade8: req.body.quantidade8
    }

    new Pedido(newPedido).save().then(() => {
        req.flash("success_msg", "Pedido enviado com sucesso!")
        res.redirect("/")
    }).catch((err) => {
        req.flash("error_msg", "Houve um problema ao registrar o pedido!")
        res.redirect("/")
        console.log(err)
    })
})

router.get("/pedidos", admin, (req, res) => {
    Pedido.find().lean().populate("item").sort({ criacao: "desc" }).then((pedidos) => {
        res.render("xAdmin/listadepedidos", { pedidos: pedidos })
    })

})

router.get("/pedidos/meuspedidos/:nome", auth, (req, res) => {
    Pedido.find({ nome: req.params.nome }).lean().then((pedidos) => {
        res.render("meus/meuspedidos", { pedidos: pedidos })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar a pagina")
        res.redirect("/")
    })

})

router.get("/pedido/editar/:id", admin, (req, res) => {
    Pedido.findOne({ _id: req.params.id }).lean()
        .populate("item")
        .populate("item1")
        .populate("item2")
        .populate("item3")
        .populate("item4")
        .populate("item5")
        .populate("item6")
        .populate("item7")
        .populate("item8").then((pedido) => {
            Produto.find().lean().then((produtos) => {
                Loja.find().lean().then((lojas) => {
                    res.render("xAdmin/editarpedido", { pedido: pedido, produtos: produtos, lojas: lojas })
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao carregar as lojas")
                    res.redirect("/admin/pedidos")
                })

            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao carregar as produtos")
                res.redirect("/admin/pedidos")
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o pedido")
            res.redirect("/admin/pedidos")
        })
})

router.post("/pedidoeditar", admin, (req, res) => {
    Pedido.findOne({ _id: req.body.id }).then((pedido) => {
        let preco = req.body.valor * req.body.quantidade
        let preco1 = req.body.valor1 * req.body.quantidade1
        let preco2 = req.body.valor2 * req.body.quantidade2
        let preco3 = req.body.valor3 * req.body.quantidade3
        let preco4 = req.body.valor4 * req.body.quantidade4
        let preco5 = req.body.valor5 * req.body.quantidade5
        let preco6 = req.body.valor6 * req.body.quantidade6
        let preco7 = req.body.valor7 * req.body.quantidade7
        let preco8 = req.body.valor8 * req.body.quantidade8


        pedido.loja = req.body.loja
        pedido.loja1 = req.body.loja1
        pedido.loja2 = req.body.loja2
        pedido.loja3 = req.body.loja3
        pedido.loja4 = req.body.loja4
        pedido.loja5 = req.body.loja5
        pedido.loja6 = req.body.loja6
        pedido.loja7 = req.body.loja7
        pedido.loja8 = req.body.loja8

        isNaN(preco) == true ? console.log() : pedido.preco = preco
        isNaN(preco1) == true ? console.log() : pedido.preco1 = preco1
        isNaN(preco2) == true ? console.log() : pedido.preco2 = preco2
        isNaN(preco3) == true ? console.log() : pedido.preco3 = preco3
        isNaN(preco4) == true ? console.log() : pedido.preco4 = preco4
        isNaN(preco5) == true ? console.log() : pedido.preco5 = preco5
        isNaN(preco6) == true ? console.log() : pedido.preco6 = preco6
        isNaN(preco7) == true ? console.log() : pedido.preco7 = preco7
        isNaN(preco8) == true ? console.log() : pedido.preco8 = preco8
        pedido.status = req.body.status

        let a = "ok"
        let b = "ok"

        let total = preco
        let total1 = preco + preco1
        let total2 = preco + preco1 + preco2
        let total3 = preco + preco1 + preco2 + preco3
        let total4 = preco + preco1 + preco2 + preco3 + preco4
        let total5 = preco + preco1 + preco2 + preco3 + preco4 + preco5
        let total6 = preco + preco1 + preco2 + preco3 + preco4 + preco5 + preco6
        let total7 = preco + preco1 + preco2 + preco3 + preco4 + preco5 + preco6 + preco7
        let total8 = preco + preco1 + preco2 + preco3 + preco4 + preco5 + preco6 + preco7 + preco8




        isNaN(total) == true ? console.log() : pedido.total = total
        isNaN(total1) == true ? console.log() : pedido.total = total1
        isNaN(total2) == true ? console.log() : pedido.total = total2
        isNaN(total3) == true ? console.log() : pedido.total = total3
        isNaN(total4) == true ? console.log() : pedido.total = total4
        isNaN(total5) == true ? console.log() : pedido.total = total5
        isNaN(total6) == true ? console.log() : pedido.total = total6
        isNaN(total7) == true ? console.log() : pedido.total = total7
        isNaN(total8) == true ? console.log() : pedido.total = total8

        pedido.solicitado = req.body.solicitado

        pedido.save().then(() => {
            req.flash("success_msg", "Pedido editado com sucesso!")
            res.redirect("/admin/pedidos")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar o pedido")
        })
    })
})

router.get("/pedido/aprovacao", diretor, (req, res) => {
    Pedido.find().lean().sort({ criacao: "desc" }).then((pedidos) => {
        res.render("diretor/Diretorlistadepedidos", { pedidos: pedidos })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao exibir os pedidos")
    })
})

router.get("/pedido/visualizar/:id", diretor, (req, res) => {
    Pedido.findOne({ _id: req.params.id }).lean()
        .populate("item")
        .populate("item1")
        .populate("item2")
        .populate("item3")
        .populate("item4")
        .populate("item5")
        .populate("item6")
        .populate("item7")
        .populate("item8").then((pedido) => {
            Produto.find().lean().then((produtos) => {
                Loja.find().lean().then((lojas) => {
                    res.render("diretor/aprovarpedido", { pedido: pedido, produtos: produtos, lojas: lojas })
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao carregar as lojas")
                    res.redirect("/admin/pedidos")
                })

            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao carregar as produtos")
                res.redirect("/")
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o pedido")
            res.redirect("/admin/pedidos")
        })
})

router.post("/pedidoaprovar", diretor, (req, res) => {
    Pedido.findOne({ _id: req.body.id }).then((pedido) => {
        pedido.status = req.body.status
        pedido.etapa = req.body.etapa

        pedido.save().then(() => {
            req.flash("success_msg", "Pedido editado com sucesso!")
            res.redirect("/")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar o pedido")
        })
    })
})

router.post("/finalizar", (req, res) => {
    Pedido.findOne({ _id: req.body.id }).then((pedido) => {
        pedido.status = req.body.status
        pedido.finalizado = req.body.finalizado

        pedido.save().then(() => {
            req.flash("success_msg", "Pedido finalizado com sucesso!")
            res.redirect("/admin/pedidos")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao finalizar o pedido")
        })
    })
})

router.get("/pedidos/imprimir", admin, (req, res) => {
    Pedido.find().lean()
        .populate("item")
        .populate("item1")
        .populate("item2")
        .populate("item3")
        .populate("item4")
        .populate("item5")
        .populate("item6")
        .populate("item7")
        .populate("item8").then((pedidos) => {
            Produto.find().lean().then((produtos) => {
                Loja.find().lean().then((lojas) => {
                    res.render("impressao/imprimir", { pedidos: pedidos, produtos: produtos, lojas: lojas })
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao carregar as lojas")
                    res.redirect("/admin/pedidos")
                })

            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao carregar as produtos")
                res.redirect("/admin/pedidos")
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o pedido")
            res.redirect("/admin/pedidos")
        })
})

router.get("/postagens/deletar/:id", (req, res) => {
    Pedido.deleteOne({ _id: req.params.id }).lean().then(() => {
        req.flash("success_msg", "Postagem Deletada com sucesso!")
        res.redirect("/admin/pedidos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a Postagem")
        res.redirect("/admin/pedidos")
    })
})

module.exports = router