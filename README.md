>ATENÇÃO!!! O projeto já vem com uma cidade e usuário predefinidos no id 1 - o id 1 é o administrador, faça login com ele para ter acesso ao crud completo

# BattleCry API ⚔️

API REST para uma loja online desenvolvida em **JavaScript com Node.js**, utilizando **Express**, **Prisma ORM**, **MySQL**, **JWT** e **bcrypt**.

O projeto permite cadastro e autenticação de clientes, consulta e gerenciamento de produtos, criação de pedidos com controle de estoque e consulta de pedidos. Operações administrativas são protegidas por autorização baseada em perfil.

## Tecnologias

- Node.js
- Express 5
- Prisma ORM 6
- MySQL 8.4
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- Docker Compose
- Postman / Insomnia para testes

## Arquitetura

A aplicação utiliza separação em camadas:

```text
Request HTTP
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Prisma ORM
    ↓
MySQL
```

Responsabilidades:

| Camada | Responsabilidade |
|---|---|
| `routes` | Define endpoints e middlewares aplicados a cada rota |
| `controllers` | Recebe `req`, chama o service e monta a resposta HTTP |
| `services` | Valida dados e aplica regras de negócio |
| `repositories` | Executa operações no banco usando Prisma |
| `middlewares` | Autenticação, autorização e tratamento global de erros |
| `errors` | Erros HTTP personalizados |
| `database` | Instância compartilhada do Prisma e SQL auxiliar |

## Estrutura de pastas

```text
BattleCry/
├── docs/
│   ├── API.md
│   ├── DIAGRAMAS.md
│   ├── TESTES.md
│   ├── swagger.json
│   └── BattleCry.postman_collection.json
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── database/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js instalado
- Docker Desktop ou uma instalação MySQL compatível
- npm

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e altere os valores se necessário.

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Subir o MySQL com Docker

```bash
docker compose up -d
```

O projeto usa por padrão:

```text
localhost:5432 → MySQL do container:3306
```

### 4. Gerar o Prisma Client

```bash
npm run prisma:generate
```

### 5. Aplicar migrations

Para montar o banco a partir das migrations existentes:

```bash
npm run prisma:deploy
```

`migrate deploy` aplica o histórico existente sem precisar criar o *shadow database* usado pelo `migrate dev`.

> O projeto possui uma migration baseline `0_init`. Evite editar migrations que já foram aplicadas; alterações futuras devem gerar novas migrations com `npm run prisma:migrate -- --name nome_da_alteracao`.

### 6. Inserir dados básicos

Como clientes dependem de uma cidade e produtos dependem de uma categoria, existe um seed mínimo para desenvolvimento:

```bash
npm run db:seed
```

Ele cria, se ainda não existirem:

```text
Cidade: Porto Alegre
Categoria: Geral
```

### 7. Executar a API

```bash
npm start
```

Por padrão:

```text
http://localhost:3000
```

## Autenticação

O login retorna um JWT:

```http
POST /auth/login
```

```json
{
  "email": "luis@email.com",
  "senha": "123456"
}
```

Rotas protegidas recebem:

```http
Authorization: Bearer SEU_TOKEN
```

Perfis utilizados:

- `CLIENTE`: cria e consulta os próprios pedidos.
- `ADMIN`: possui acesso adicional ao gerenciamento de clientes, produtos, pedidos, categorias e cidades.

O cadastro público sempre força `tipo = "CLIENTE"`; enviar `"ADMIN"` no body não transforma o usuário em administrador.

### Criar um administrador para teste local

Cadastre um cliente normalmente e, apenas no ambiente de desenvolvimento, altere o perfil no banco:

```sql
UPDATE clientes
SET tipo = 'ADMIN'
WHERE id = 1;
```

Faça login novamente para gerar um JWT contendo o perfil atualizado.

## Endpoints principais

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/clientes` | Público | Cadastra cliente |
| `GET` | `/clientes` | Admin | Lista clientes sem expor senha |
| `GET` | `/clientes/:id` | Admin | Consulta cliente por ID |
| `PUT` | `/clientes/:id` | Admin | Atualiza dados do cliente |
| `DELETE` | `/clientes/:id` | Admin | Exclui cliente e seus pedidos, restaurando estoque |
| `POST` | `/auth/login` | Público | Autentica usuário e gera JWT |
| `GET` | `/cidades` | Público | Lista cidades |
| `POST` | `/cidades` | Admin | Cadastra cidade |
| `PUT` | `/cidades/:id` | Admin | Atualiza cidade |
| `DELETE` | `/cidades/:id` | Admin | Exclui cidade; clientes vinculados ficam sem cidade |
| `GET` | `/categorias` | Público | Lista categorias |
| `POST` | `/categorias` | Admin | Cadastra categoria |
| `PUT` | `/categorias/:id` | Admin | Atualiza categoria |
| `DELETE` | `/categorias/:id` | Admin | Exclui categoria sem produtos vinculados |
| `GET` | `/produtos` | Público | Lista produtos cadastrados |
| `GET` | `/produtos/:id` | Público | Consulta produto por ID |
| `POST` | `/produtos` | Admin | Cadastra produto |
| `PUT` | `/produtos/:id` | Admin | Atualiza produto |
| `DELETE` | `/produtos/:id` | Admin | Exclui produto |
| `POST` | `/pedidos` | Cliente autenticado | Cria pedido para o usuário do JWT |
| `GET` | `/pedidos/meus` | Cliente autenticado | Lista os próprios pedidos |
| `GET` | `/pedidos` | Admin | Lista todos os pedidos |
| `PUT` | `/pedidos/:id` | Admin | Atualiza endereço, cliente e/ou itens do pedido |
| `DELETE` | `/pedidos/:id` | Admin | Exclui pedido e restaura estoque |

> As operações `PUT` e `DELETE` de clientes, pedidos, categorias e cidades são exclusivas de administradores e passam pelos middlewares de autenticação e autorização.

> `GET /produtos` lista os produtos cadastrados e retorna a quantidade em estoque. O projeto não possui um endpoint separado `/produtos/disponiveis`.


## Swagger / OpenAPI

A API possui documentação interativa com **Swagger UI**. Com o servidor em execução, acesse:

```text
http://localhost:3000/api-docs
```

A especificação OpenAPI utilizada pela interface pode ser consultada diretamente em:

```text
http://localhost:3000/api-docs.json
```

O endpoint `/api-docs.json` serve o arquivo `docs/swagger.json` com cache desabilitado, evitando que alterações recentes na documentação fiquem presas no navegador ou no processo do Node.js.

Para testar rotas protegidas pelo Swagger:

1. execute `POST /auth/login`;
2. copie o JWT retornado;
3. clique em **Authorize**;
4. informe o token;
5. execute as rotas protegidas.

As operações administrativas de clientes, produtos, pedidos, categorias e cidades exigem um token de usuário com perfil `ADMIN`.

## Respostas de erro

A API utiliza respostas JSON padronizadas:

```json
{
  "erro": "Produto não encontrado"
}
```

Principais status:

| Status | Significado |
|---|---|
| `400` | Dados ou parâmetros inválidos |
| `401` | Usuário não autenticado / token inválido |
| `403` | Usuário autenticado sem permissão |
| `404` | Recurso ou rota não encontrado |
| `500` | Erro interno inesperado |

## Pedidos e transações

A criação de pedido usa `prisma.$transaction()` para garantir atomicidade. A operação:

1. cria o pedido;
2. consulta cada produto;
3. valida estoque;
4. decrementa o estoque;
5. salva os itens em `pedidos_produtos`.

Se qualquer etapa falhar, a transação é revertida e o banco não fica com um pedido parcial.

O preço enviado pelo cliente não é aceito: o valor do item é obtido da tabela `produtos` no momento da compra.

## Documentação adicional

- [Endpoints e exemplos](docs/API.md)
- [UML e fluxogramas](docs/DIAGRAMAS.md)
- [Roteiro de testes](docs/TESTES.md)
- `docs/swagger.json` — especificação OpenAPI exibida em `/api-docs`
- `docs/BattleCry.postman_collection.json` — coleção pronta para importar no Postman

## Observações de segurança

- Senhas são armazenadas usando bcrypt.
- Hashes de senha não são retornados nos endpoints de clientes.
- A chave JWT fica em variável de ambiente.
- O ID do cliente que cria um pedido é obtido do JWT, não do body da requisição.
- Endpoints administrativos exigem autenticação e perfil `ADMIN`.
- `.env` e `node_modules` não devem ser versionados nem enviados na entrega.
