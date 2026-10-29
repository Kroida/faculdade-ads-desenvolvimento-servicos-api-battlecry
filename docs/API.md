# BattleCry API — Endpoints e exemplos

Base URL local:

```text
http://localhost:3000
```

## Clientes

### POST `/clientes`

Cadastra um cliente. O campo `tipo` é definido pela aplicação como `CLIENTE`.

```json
{
  "nome": "Luis",
  "altura": 1.75,
  "nascimento": "2000-01-01T00:00:00.000Z",
  "cidade_id": 1,
  "email": "luis@email.com",
  "senha": "123456"
}
```

Resposta esperada: `201 Created`.

### GET `/clientes`

Lista clientes. Requer JWT de administrador.

```http
Authorization: Bearer SEU_TOKEN_ADMIN
```

A senha não é retornada.

### GET `/clientes/:id`

Consulta um cliente por ID. Requer administrador.

---

## Autenticação

### POST `/auth/login`

```json
{
  "email": "luis@email.com",
  "senha": "123456"
}
```

Resposta `200 OK`:

```json
{
  "token": "eyJhbGciOi..."
}
```

Use o token nas rotas protegidas:

```http
Authorization: Bearer eyJhbGciOi...
```

---

## Produtos

### GET `/produtos`

Lista produtos e respectivas categorias.

> Produtos com estoque `0` também podem aparecer. A API não implementa uma rota separada de produtos disponíveis.

### GET `/produtos/:id`

Consulta um produto por ID.

### POST `/produtos`

Requer administrador.

```json
{
  "nome": "Espada Longa",
  "preco": 149.90,
  "quantidade": 10,
  "categorias_id": 1
}
```

Resposta esperada: `201 Created`.

### PUT `/produtos/:id`

Requer administrador e recebe o produto completo:

```json
{
  "nome": "Espada Longa +1",
  "preco": 199.90,
  "quantidade": 15,
  "categorias_id": 1
}
```

Resposta esperada: `200 OK`.

### DELETE `/produtos/:id`

Requer administrador.

Resposta esperada: `204 No Content`.

---

## Pedidos

### POST `/pedidos`

Requer autenticação. O `cliente_id` é obtido do JWT e não deve ser enviado no body.

```json
{
  "endereco": "Rua dos Hunters, 150",
  "produtos": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 2,
      "quantidade": 1
    }
  ]
}
```

A API busca o preço atual de cada produto no banco, valida estoque e executa toda a operação dentro de uma transação.

### GET `/pedidos/meus`

Requer autenticação. Retorna apenas pedidos pertencentes ao usuário identificado pelo JWT.

### GET `/pedidos`

Requer administrador. Retorna todos os pedidos, cliente associado e itens do pedido.

---

## Exemplos de erro

### 400 Bad Request

```json
{
  "erro": "Quantidade deve ser maior que zero"
}
```

### 401 Unauthorized

```json
{
  "erro": "Token não informado"
}
```

### 403 Forbidden

```json
{
  "erro": "Acesso permitido somente para administradores"
}
```

### 404 Not Found

```json
{
  "erro": "Produto não encontrado"
}
```

### 500 Internal Server Error

```json
{
  "erro": "Erro interno do servidor"
}
```
