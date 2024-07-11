# Gerenciador de Usuários

## Descrição
Um sistema de gerenciamento de usuários construído com Node.js, JavaScript, Handlebars, e CSS. Inclui:

- Sistema de privação de rotas para diferentes tipos de usuários.
- Criptografia de senhas usando bcryptjs.
- Login e Registro utilizando Passport e MongoDB.
- Opção para baixar PDF somente para usuários de nível 4 ou superior.

## Funcionalidades

### Sistema de Níveis de Usuário

- **Nível 1 a 3**: Acesso limitado.
- **Nível 4 ou superior**: Acesso à funcionalidade de download de PDF.

------------------------------------------

### Rotas Disponíveis

### Ver todos os usuário
[GET] http://localhost:8081/users

### Ver usuário especifico
[GET] http://localhost:8081/users/:id

### Criar usuário

[POST] http://localhost:8081/users/

{
  "name": "exemplo", // Não pode ter menos que 4 letras
  
  "email": "exemplo@exemplo",
  
  "password": "12345", // As senhas têm que ser iguais
  
  "password2": "12345",
  
  "nivel": 1 | 2 | 3 | 4 | 5
}


### Editar usuário especifico

[PUT] http://localhost:8081/users/:id

{
  "name": "exemplo", // Não pode ter menos que 4 letras
  
  "email": "exemplo@exemplo",
  
  "password": "12345", // As senhas têm que ser iguais
  
  "password2": "12345",
  
  "nivel": 1 | 2 | 3 | 4 | 5
}

### Deleta usuário especifico

[PUT] http://localhost:8081/users/:id


### Faz login

[POST] http://localhost:8081/login

{
    "email": "exemplo@exemplo",

    "password": "12345"
}

(Um token vai ser informado como resposta)

### Dowload do pdf (Acesso somente nivel 4)

[POST] http://localhost:8081/users/report

Headers: 
[key: Authorization] , [valu: Bearer {token}] (token da resposta do login)

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

mongod

nodemon app.js
-------------------------------------------

