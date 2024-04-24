![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 01 - Backend TypeScript

Seu papel é construir uma RESTful API, utilizando TypeScript, para administrar empréstimos de livros para alunos. A API deve conter as seguintes funcionalidades:

## Usuário do sistema

-   Cadastrar Usuário
-   Fazer Login
-   Detalhar Perfil do Usuário Logado
-   Editar Perfil do Usuário Logado

## Livros

-   Listar livros
-   Detalhar livro

Obs.: Para listar e detalhar livros, será necessário executar o dump da tabela de livros disponibilizado no arquivo `dump_livros.sql` deste repositório.

## Alunos

-   Cadastrar Aluno
-   Listar Alunos
-   Detalhar aluno
-   Editar aluno
-   Remover aluno

# Empréstimos

-   Registrar empréstimo de um livro para um aluno
-   Devolver um livro emprestado ao aluno
-   Listar empréstimos
-   Detalhar empréstimo

**Importante: Sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação, ok?**

**Exemplo:**

```javascript
// Quando é informado um id de transação que não existe:
// HTTP Status 404
{
    "mensagem": "Transação não encontrada!"
}
```

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL chamado `emprestimos` contendo as seguintes tabelas e colunas:

**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

-   usuarios

    -   id
    -   nome
    -   email (campo único)
    -   senha

-   livros

    -   id
    -   titulo
    -   autor
    -   descricao

-   alunos

    -   id
    -   nome
    -   email (campo único)

-   emprestimos

    -   id
    -   livro_id
    -   aluno_id
    -   devolvido

**IMPORTANTE: Deverá ser criado no projeto o(s) arquivo(s) SQL que deverá ser o script que cria as tabelas corretamente.**

## **Requisitos obrigatórios**

-   A API a ser criada deverá acessar o banco de dados a ser criado `emprestimos` para persistir e manipular os dados de usuários, livros, alunos e empréstimos utilizados pela aplicação.
-   Para interação com o banco de dados deve ser utilizado o `Knex (Query Builder)`.
-   O campo `id` das tabelas no banco de dados deve ser auto incremento, chave primária e não deve permitir edição uma vez criado.
-   Deverá ser criado o script de start do servidor em desenvolvimento usando o `nodemon` e o `ts-node`.
-   Deverá ser criado o script de start do servidor em produção usando o `node`.
-   Deverá ser criado o script para transpilar o código de TypeScript para JavaScript.
-   O código TypeScript deverá ser criado numa pasta chamada `src` e o código JavaScript Transpilado deverá estar numa pasta chamada `dist` ou `build`.
-   Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.

## **Status Codes**

Abaixo, listamos os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

-   **Requisição**  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, deveremos enviar no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo `id` e excluindo a senha criptografada.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se o e-mail informado já existe
    -   Criptografar a senha antes de persistir no banco de dados
    -   Cadastrar o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

-   **Requisição**  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **token** que deverá possuir como valor o token de autenticação gerado e uma propriedade **usuario** que deverá possuir as informações do usuário autenticado, exceto a senha do usuário.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**

    -   Verificar se o e-mail existe
    -   Validar e-mail e senha
    -   Criar token de autenticação com id do usuário

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

---

### **Validações do token**

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se o token foi enviado no header da requisição (Bearer Token)
    -   Verificar se o token é válido
    -   Consultar usuário no banco de dados pelo id contido no token informado

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário deverá ser identificado através do ID presente no token de autenticação.

-   **Requisição**  
    Não deverá possuir conteúdo no corpo da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário deverá ser identificado através do ID presente no token de autenticação.

-   **Requisição**
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se o novo e-mail já existe no banco de dados para outro usuário
        -   Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não deve ser permitida (o campo de email deve ser sempre único no banco de dados)
    -   Criptografar a senha antes de salvar no banco de dados
    -   Atualizar as informações do usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar livros**

#### `GET` `/livros`

Essa é a rota que será chamada quando o usuario logado quiser listar todos os livros cadastrados.

-   **Requisição**  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (livros) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   O endpoint deverá responder com um array de todos os livros cadastrados. Caso não exista nenhum livro deverá responder com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /livros
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204

;[
    {
        id: 1,
        titulo: "O Hobbit",
        autor: "J.R.R. Tolkien",
        descricao: "Lançado em 1937...",
    },
    {
        id: 2,
        titulo: "1984",
        autor: "George Orwell",
        descricao: "Publicada originalmente em 1949...",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
;[]
```

### **Detalhar um livro**

#### `GET` `/livros/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter um livro cadastrado.

-   **Requisição**  
    Deverá ser enviado o ID do livro no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o livro encontrado, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe livro para o id enviado como parâmetro na rota.

#### **Exemplo de requisição**

```javascript
// GET /livro/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 2,
    "titulo": "1984",
    "autor": "George Orwell",
    "descricao": "Publicada originalmente em 1949...",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Livro não encontrado."
}
```

### **Listar Alunos**

#### `GET` `/alunos`

Essa é a rota que será chamada quando o usuario logado quiser listar todos os alunos cadastrados.

-   **Requisição**  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (alunos) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   O endpoint deverá responder com um array de todos os alunos cadastrados. Caso não exista nenhum aluno cadastrado deverá responder com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /alunos
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
;[
    {
        id: 1,
        nome: "Maria",
        email: "maria@email.com",
    },
    {
        id: 2,
        nome: "João",
        email: "joao@email.com",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
;[]
```

### **Detalhar um aluno**

#### `GET` `/alunos/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter as informações de um aluno cadastrado.

-   **Requisição**  
    Deverá ser enviado o ID do aluno no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o aluno encontrado, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe aluno para o id enviado como parâmetro na rota.

#### **Exemplo de requisição**

```javascript
// GET /aluno/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 2,
    "nome": "João",
    "email": "joao@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Aluno(a) não encontrado(a)."
}
```

### **Cadastrar Aluno**

#### `POST` `/alunos`

Essa é a rota que será utilizada para cadastrar um aluno.

-   **Requisição**
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email

-   **Resposta**
    Em caso de **sucesso**, deveremos enviar, no corpo (body) da resposta, as informações do aluno cadastrado, incluindo seu respectivo `id`.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se o e-mail informado já existe
    -   Cadastrar o aluno no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /alunos
{
    "nome": "Maria",
    "email": "maria@email.com"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "Maria",
    "email": "maria@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já existe para outro aluno."
}
```

### **Atualizar Aluno**

#### `PUT` `/alunos/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar um aluno cadastrado.

-   **Requisição**  
    Deverá ser enviado o ID do aluno no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe aluno para o id enviado como parâmetro na rota.
    -   Validar se o novo e-mail já existe no banco de dados para outro aluno
        -   Caso já exista o novo e-mail fornecido para outro aluno no banco de dados, a alteração não deve ser permitida (o campo de email deve ser sempre único no banco de dados)
    -   Atualizar o aluno no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /alunos/1
{
	"nome": "Maria",
    "email": "maria@email.com"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já existe para outro aluno."
}
```

### **Excluir Aluno**

#### `DELETE` `/alunos/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir um aluno cadastrado.

-   **Requisição**  
    Deverá ser enviado o ID do aluno no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**:
    -   Validar se existe aluno para o id enviado como parâmetro na rota.
    -   Excluir o aluno e seus empréstimos (caso exista) no banco de dados.

#### **Exemplo de requisição**

```javascript
// DELETE /alunos/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Aluno não encontrado."
}
```

### **Emprestar um livro para um aluno**

#### `POST` `/emprestimos`

Essa é a rota que será chamada quando o usuario logado quiser registar um empréstimo de um livro para um aluno.
**Atenção!:** Um empréstimo só poderá ser registrado caso o livro não esteja emprestado para outro aluno.

-   **Requisição**
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   livro_id
    -   aluno_id

-   **Resposta**
    Em caso de **sucesso**, deveremos enviar, no corpo (body) da resposta, as informações do empréstimo cadastrado, incluindo seu respectivo `id`.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe aluno para o id enviado no corpo (body) da requisição.
    -   Validar se existe livro para o id enviado no corpo (body) da requisição.
    -   Validar se o livro não está emprestado para outro aluno.
    -   Cadastrar o empréstimo no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /emprestimos
{
	"livro_id": 6,
	"aluno_id": 1
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"id": 5,
	"aluno_id": 1,
	"livro_id": 6,
	"devolvido": false
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O livro informado já está emprestado para outro aluno."
}
```

### **Devolver um livro**

#### `PATCH` `/emprestimos/:id`

Essa é a rota que será chamada quando o usuario logado quiser registar a devolução de um empréstimo de um livro.

-   **Requisição**
    Deverá ser enviado o ID do empréstimo no parâmetro de rota do endpoint.
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe empréstimo para o id enviado no corpo (body) da requisição.
    -   Alterar o campo devolvido do empréstimo no banco de dados

#### **Exemplo de requisição**

```javascript
// PATCH /emprestimos/:id
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O empréstimo informado já houve a devolução anteriormente."
}
```

### **Listar Empréstimos**

#### `GET` `/emprestimos`

Essa é a rota que será chamada quando o usuario logado quiser listar todos os empréstimos cadastrados.

-   **Requisição**
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (empréstimos) encontrados, conforme exemplo abaixo.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   O endpoint deverá responder com um array de todos os empréstimos cadastrados. Caso não exista nenhum empréstimo cadastrado deverá responder com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /emprestimos
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
;[
    {
        id: 1,
        devolvido: false,
        aluno: {
            id: 1,
            nome: "João",
            email: "joao@email.com",
        },
        livro: {
            id: 1,
            titulo: "O Hobbit",
            autor: "J.R.R. Tolkien",
            descricao: "Lançado em 1937...",
        },
    },
    {
        id: 2,
        devolvido: false,
        aluno: {
            id: 2,
            nome: "Maria",
            email: "maria@email.com",
        },
        livro: {
            id: 2,
            titulo: "1984",
            autor: "George Orwell",
            descricao: "Publicada originalmente em 1949...",
        },
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
;[]
```

### **Detalhar um empréstimo**

#### `GET` `/emprestimos/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter as informações de um emprestimo cadastrado.

-   **Requisição**  
    Deverá ser enviado o ID do emprestimo no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o emprestimo encontrado, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

-   **REQUISITOS OBRIGATÓRIOS**
    -   Validar se existe emprestimo para o id enviado como parâmetro na rota.

#### **Exemplo de requisição**

```javascript
// GET /emprestimos/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    id: 2,
    devolvido: false,
    aluno: {
        id: 2,
        nome: "Maria",
        email: "maria@email.com",
    },
    livro: {
        id: 2,
        titulo: "1984",
        autor: "George Orwell",
        descricao: "Publicada originalmente em 1949...",
    },
},
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Empréstimo não encontrado."
}
```

---

**LEMBRE-SE**: Feito é melhor que perfeito!!!

###### tags: `back-end` `módulo 1` `nodeJS` `JavaScript` `TypeScript` `API REST` `desafio`
