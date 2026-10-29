# Roteiro de testes — BattleCry API

## Preparação

1. Suba o MySQL com `docker compose up -d`.
2. Execute `npm run prisma:generate` e `npm run prisma:deploy`.
3. Execute `npm run db:seed` para criar uma cidade e uma categoria básicas.
4. Inicie a API com `npm start`.

## Clientes

### Cadastro válido

`POST /clientes`

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

Esperado: `201` e nenhuma propriedade `senha` na resposta.

### Senha curta

```json
{
  "nome": "Luis",
  "altura": 1.75,
  "nascimento": "2000-01-01T00:00:00.000Z",
  "cidade_id": 1,
  "email": "outro@email.com",
  "senha": "123"
}
```

Esperado: `400`.

### Cidade inexistente

Use `cidade_id: 999999`.

Esperado: `404`.

## Login

### Válido

`POST /auth/login`

```json
{
  "email": "luis@email.com",
  "senha": "123456"
}
```

Esperado: `200` + JWT.

### Senha errada

Esperado: `401`.

## Produtos / autorização

Use `POST /produtos` com:

```json
{
  "nome": "Espada Longa",
  "preco": 149.90,
  "quantidade": 10,
  "categorias_id": 1
}
```

- Sem token → `401`.
- Token de `CLIENTE` → `403`.
- Token de `ADMIN` → `201`.

Teste também `GET`, `PUT` e `DELETE`.

## Pedidos

### Pedido válido

`POST /pedidos` com token de cliente:

```json
{
  "endereco": "Rua dos Hunters, 150",
  "produtos": [
    { "produto_id": 1, "quantidade": 2 }
  ]
}
```

Esperado:

- `201`;
- registro em `pedidos`;
- registro em `pedidos_produtos`;
- estoque reduzido em `produtos`.

### Estoque insuficiente

```json
{
  "endereco": "Rua dos Hunters, 150",
  "produtos": [
    { "produto_id": 1, "quantidade": 999999 }
  ]
}
```

Esperado: `400` e rollback completo da transação.

### Produto duplicado no mesmo pedido

```json
{
  "endereco": "Rua dos Hunters, 150",
  "produtos": [
    { "produto_id": 1, "quantidade": 1 },
    { "produto_id": 1, "quantidade": 2 }
  ]
}
```

Esperado: `400`.

### Consultas

- `GET /pedidos/meus` com cliente autenticado → `200`.
- `GET /pedidos` sem token → `401`.
- `GET /pedidos` com cliente → `403`.
- `GET /pedidos` com admin → `200`.

## Rotas inexistentes

Exemplo:

```text
GET /batata
```

Esperado: `404`:

```json
{
  "erro": "Rota não encontrada"
}
```
