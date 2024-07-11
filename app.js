const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { auth } = require("./helpers/autenticado");
require("./config/auth")(passport);
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
const jwtConfig = require("./config/jwt");
const { authenticateToken } = require("./helpers/jwtautenticado");
const { pdfAuthenticateToken } = require("./helpers/pdfautenticado");
const { autenticadoWeb } = require("./helpers/autenticadoweb")


// Sessão
app.use(session({
    secret: "usuarios",
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/images", express.static(path.join(__dirname, "/public/img")));
app.set('/css', express.static(path.join(__dirname + "/public/css")));

//Public Bootstrap
app.use(express.static(path.join(__dirname, "public"))) //A pasta que está guardando todos nossos arquivos staticos é a Public

app.use((req, res, next) => {

    next()
})

//mongoose
mongoose.connect('mongodb://localhost/gerenciadorusuario')
    .then(() => console.log('Connected!'));



//Rotas http

//Ler todos
app.get("/users", (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        res.json(usuarios)
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao ler os usuarios")
    })
})

//Ler um usuario
app.get("/users/:id", (req, res) => {
    Usuario.findOne({ _id: req.params.id }).lean().then((usuarios) => {
        res.json(usuarios)
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as lojas")
        res.redirect("/")
    })
})

//Criar
app.post("/users", (req, res) => {
    const { name, email, password, nivel } = req.body;

    let erros = [];

    if (password !== req.body.password2) {
        erros.push({ texto: "Senhas diferentes" });
    }
    if (name.length < 4) {
        erros.push({ texto: "Nome muito curto!" });
    }
    if (email.length < 4) {
        erros.push({ texto: "Email muito curto!" });
    }
    if (nivel == 0 || nivel > 5) {
        erros.push({ texto: "Nivel Inválido!" });
    }

    if (erros.length > 0) {
        res.json({ erros: erros });
    } else {
        Usuario.findOne({ name: name }).then((usuario) => {
            if (usuario) {
                res.json({ error: "Já existe um usuário com este nome no nosso sistema" });
            } else {
                const newUsuario = new Usuario({
                    name: name,
                    email: email,
                    password: password,
                    level: nivel
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUsuario.password, salt, (erro, hash) => {
                        if (erro) {
                            res.json({ error: "Houve um erro durante o salvamento do usuário" });
                        }
                        newUsuario.password = hash;

                        newUsuario.save().then(() => {
                            res.json({ message: "Usuário criado com sucesso!" });
                        }).catch((err) => {
                            res.json({ error: "Houve um erro interno" });
                        });
                    });
                });
            }
        });
    }
});

//Edita um usuario
app.put("/users/:id", (req, res) => {
    const { name, email, password, nivel } = req.body;

    let erros = [];

    if (password !== req.body.password2) {
        erros.push({ texto: "Senhas diferentes" });
    }
    if (name.length < 4) {
        erros.push({ texto: "Nome muito curto!" });
    }
    if (email.length < 4) {
        erros.push({ texto: "Email muito curto!" });
    }
    if (nivel == 0 || nivel > 5) {
        erros.push({ texto: "Nivel Inválido!" });
    }

    if (erros.length > 0) {
        res.json({ erros: erros });
    } else {
        Usuario.findOne({ _id: req.params.id }).then((usuario) => {
            const newUsuario = new Usuario({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                level: req.body.nivel
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(newUsuario.password, salt, (erro, hash) => {
                    if (erro) {
                        res.json({ error: "Houve um erro durante o salvamento do usuário" });
                    }
                    newUsuario.password = hash


                    usuario.name = name
                    usuario.email = email
                    usuario.password = newUsuario.password
                    usuario.level = nivel

                    usuario.save().then(() => {
                        res.json({ message: "Usuário editado com sucesso!" });
                    }).catch((err) => {
                        res.json({ error: "Houve um erro interno" });
                    })
                })
            })
        })
    }
})

//Deleta um usuario
app.delete("/users/:id", (req, res) => {
    Usuario.deleteOne({ _id: req.params.id })
        .then(() => {
            res.json({ message: "Usuário deletado com sucesso!" });
        })
        .catch((err) => {
            res.json({ error: "Houve um erro interno" });
        });
});

//Login JWT Token
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    Usuario.findOne({ email: email }).then((usuario) => {
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign(
                    { id: usuario._id, name: usuario.name, email: usuario.email, level: usuario.level },
                    jwtConfig.secret,
                    { expiresIn: jwtConfig.expiresIn }
                )
                res.json({ token });
            } else {
                return res.status(400).json({ error: "Senha incorreta" });
            }
        })
    }).catch(err => {
        console.error("Erro ao autenticar o usuário:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    })
});

//Pdf
app.post('/users/report', pdfAuthenticateToken, (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        const str = " ";
        const _ = "_";
        const doc = new PDFDocument();
        let filename = 'usuarios.pdf';
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.font('Courier')
        doc.fontSize(14).text('Lista de Usuarios', {
            align: 'center'
        });

        doc.moveDown();
        doc.fontSize(12);
        doc.text(`${str.repeat(4)} Nome ${str.repeat(8)}| ${str.repeat(8)} Nivel ${str.repeat(4)} | ${str.repeat(4)} Email`);
        doc.text(`${_.repeat(65)}`);
        doc.moveDown();

        usuarios.forEach(usuario => {
            const resp = usuario.name.length;
            const space = 24 - resp;
            const str = " "

            doc.text(`${str.repeat(4)} ${usuario.name} ${str.repeat(space)} ${usuario.level} ${str.repeat(9)} ${usuario.email}`);
            doc.moveDown();
        });

        doc.pipe(res);
        doc.end();
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao gerar o PDF");
        res.redirect('/generate-pdf');
    });
});



//Rotas

//Pagina Inicial
app.get("/", (req, res) => {
    res.render("index")
})

//Interface para criar usuario
app.get("/criar-usuario", (req, res) => {
    res.render("usuario/registro")
})

//Cria um Usuario
app.post("/criarusuario", (req, res) => {
    var erros = []

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "Senhas diferentes" })
    }

    if (req.body.nome.length < 4) {
        erros.push({ texto: "Nome muito curto!" })
    }

    if (req.body.email.length < 4) {
        erros.push({ texto: "Email muito curto!" })
    }

    if (req.body.tipo == 0 || req.body.tipo > 5) {
        erros.push({ texto: "Cargo Invalido!" })
    }

    if (erros.length > 0) {
        res.render("usuario/registro", { erros: erros })
    } else {

        Usuario.findOne({ name: req.body.nome }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe um usuario com este nome no nosso sistema")
                res.redirect("/registro")
            } else {
                const newUsuario = new Usuario({
                    name: req.body.nome,
                    email: req.body.email,
                    password: req.body.senha,
                    level: req.body.tipo
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUsuario.password, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        newUsuario.password = hash

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

//Lista todos os usuarios

app.get("/lista-de-usuarios", autenticadoWeb, (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        res.render("xAdmin/listadeusuarios", { usuarios: usuarios })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao ler os usuarios")
    })
})

//Ler um usuario
app.get("/detalhes-usuario/:id", autenticadoWeb, (req, res) => {
    Usuario.findOne({ _id: req.params.id }).lean().then((usuarios) => {
        res.render("xAdmin/editarusuario", { usuarios: usuarios })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as lojas")
        res.redirect("/")
    })
})

//Edita um usuario
app.post("/editar-usuario/:id", autenticadoWeb, (req, res) => {
    var erros = []

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "Senhas diferentes" })
    }

    if (req.body.nome.length < 4) {
        erros.push({ texto: "Nome muito curto!" })
    }

    if (req.body.email.length < 4) {
        erros.push({ texto: "Email muito curto!" })
    }

    if (req.body.tipo == 0 || req.body.tipo > 5) {
        erros.push({ texto: "Cargo Invalido!" })
    }

    if (erros.length > 0) {
        res.render("usuario/registro", { erros: erros })
    } else {
        Usuario.findOne({ _id: req.params.id }).then((usuario) => {
            const newUsuario = new Usuario({
                name: req.body.nome,
                email: req.body.email,
                password: req.body.senha,
                level: req.body.tipo
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(newUsuario.password, salt, (erro, hash) => {
                    if (erro) {
                        req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                        res.redirect("/")
                    }
                    newUsuario.password = hash


                    usuario.name = req.body.nome
                    usuario.email = req.body.email
                    usuario.password = newUsuario.password
                    usuario.level = req.body.tipo

                    usuario.save().then(() => {
                        req.flash("success_msg", "Pedido editado com sucesso!")
                        res.redirect("/")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao editar o pedido")
                        res.redirect("/")
                    })
                })
            })
        })
    }
})


app.delete("/delete-user/:id", autenticadoWeb, (req, res) => {
    Usuario.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Usuário deletado com sucesso!");
            res.redirect("/users");
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar o usuário");
            res.redirect("/users");
        });
});

//Interface de Login
app.get("/dash-login", (req, res) => {
    res.render("usuario/login")
})

//Autenticação de login
app.post("/logar", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/criar-usuario",
        failureFlash: true
    })(req, res, next);
})

//Logout
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

app.get('/geradorpdf', auth, (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        res.render("pdf/pdf", { usuarios: usuarios })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao ler os usuarios")
    })
});

app.post('/generatepdf', auth, (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        const str = " ";
        const _ = "_";
        const doc = new PDFDocument();
        let filename = 'usuarios.pdf';
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.font('Courier')
        doc.fontSize(14).text('Lista de Usuarios', {
            align: 'center'
        });

        doc.moveDown();
        doc.fontSize(12);
        doc.text(`${str.repeat(4)} Nome ${str.repeat(8)}| ${str.repeat(8)} Nivel ${str.repeat(4)} | ${str.repeat(4)} Email`);
        doc.text(`${_.repeat(65)}`);
        doc.moveDown();

        usuarios.forEach(usuario => {
            const resp = usuario.name.length;
            const space = 24 - resp;
            const str = " "

            doc.text(`${str.repeat(4)} ${usuario.name} ${str.repeat(space)} ${usuario.level} ${str.repeat(9)} ${usuario.email}`);
            doc.moveDown();
        });

        doc.pipe(res);
        doc.end();
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao gerar o PDF");
        res.redirect('/generate-pdf');
    });
});


//Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
});