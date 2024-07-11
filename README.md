Projeto criado para ser utilizado como Gerenciador de Usuários.

NodeJs - JavaScript - Handlebars - Css

Sistema de privação de rotas para diferentes tipos de usuarios no sistema;

Incriptação de senhas usando bcryptjs;

Login e Registro utilizando Passport e MongoDb;

Opção para baixar pdf somente para usuários nivel 4 ou superior.


------------------------------------------

Rotas:

Ver todos os usuário
[GET] http://localhost:8081/users

Ver usuário especifico
[GET] http://localhost:8081/users/:id

Criar usuário
[POST] http://localhost:8081/users/
{
    nome: exemplo, (Não pode ter menos que 4 letras)
    email: exemplo@exemplo,
    senha: 12345, (As senhas tem que ser iguais)
    senha2: 12345,
    nivel: 1 | 2 | 3 | 4 | 5
}

Editar usuário especifico
[PUT] http://localhost:8081/users/:id
{
    nome: exemplo, (Não pode ter menos que 4 letras)
    email: exemplo@exemplo,
    senha: 12345, (As senhas tem que ser iguais)
    senha2: 12345,
    nivel: 1 | 2 | 3 | 4 | 5
}

Deleta usuário especifico
[PUT] http://localhost:8081/users/:id


Faz login
[POST] http://localhost:8081/login
{
    email: exemplo@exemplo,
    password: 12345
}
(Um token vai ser informado como resposta)

Dowload do pdf (Acesso somente nivel 4)
[POST] http://localhost:8081/users/report
Headers: [key: Authorization] , [valu: Bearer {token}] (token da resposta do login)

------------------------------------------

Comando Utilizados no Desenvolvimento:

npm install express

npm install express-handlebars

npm install body-parser

npm install --save path

npm install express-session

npm install mongoose

npm install connect-flash

npm install --save bcryptjs

npm install passport

npm install passport-local

npm install pdfkit

npm install jsonwebtoken

nodemon app.js
-------------------------------------------

