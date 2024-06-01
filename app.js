const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const Admin = require("./routes/admin")
require("./models/loja");
const Loja = mongoose.model("lojas");
require("./models/produtos");
const Produto = mongoose.model("produtos");
require("./models/usuario");
const Usuario = mongoose.model("usuarios");
require("./models/pedido");
const Pedido = mongoose.model("pedidos");
const bcrypt = require('bcryptjs');
const passport = require('passport');
require("./config/auth")(passport)
const {admin} = require("./helpers/admin");


// Sessão
app.use(session({
    secret: "compras",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next();
})


//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); 
app.use("/images", express.static(path.join(__dirname, "/public/img")));
app.set('/css', express.static(path.join(__dirname + "/public/css")));

//Public Bootstrap
app.use(express.static(path.join(__dirname, "public"))) //A pasta que está guardando todos nossos arquivos staticos é a Public

app.use((req, res, next) => {
    console.log("Midleware")
    next()

})

//mongoose
mongoose.connect('mongodb://localhost/setorCompras')
  .then(() => console.log('Connected!'));



//Rotas


app.get("/", (req, res) => {
    res.render("index")
})


app.use("/admin", Admin);


app.get("/registro", (req, res) => {
    res.render("usuario/registro")
})

app.post("/registrob", (req, res) => {
    var erros = []

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes"})
    }

    if(req.body.nome < 4){
        erros.push({texto: "Nome muito curto!"})
    }

    if(req.body.tipo == 0){
        erros.push({texto: "Cargo Invalido!"})
    }

    if(erros.length > 0){
        res.render("usuario/registro", {erros: erros})
    } else{

        Usuario.findOne({nome: req.body.nome}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe um usuario com este nome no nosso sistema")
                res.redirect("/registro")
            }else {
                const newUsuario =  new Usuario({
                    nome: req.body.nome,
                    senha: req.body.senha,
                    tipo: req.body.tipo
                })
                
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        newUsuario.senha = hash

                        newUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro interno")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })
                

            }
        })
        
    }
})

app.get("/login", (req, res) => {
    res.render("usuario/login")
})

app.post("/loginb", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/registro",
        failureFlash: true
    }) (req, res, next)

})

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
      })
})



//Outros
const PORT = 8081;
app.listen(PORT,() => {
    console.log("Servidor Rodando!")
});