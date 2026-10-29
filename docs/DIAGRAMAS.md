# Diagramas — BattleCry API

Os diagramas abaixo estão em Mermaid e podem ser visualizados diretamente no GitHub ou em editores com suporte a Mermaid.

## Diagrama UML de classes / entidades

```mermaid
classDiagram
    class Cidade {
        +Int id
        +String nome
    }

    class Cliente {
        +Int id
        +String nome
        +Float altura
        +DateTime nascimento
        +Int cidade_id
        +String email
        -String senha
        +String tipo
    }

    class Categoria {
        +Int id
        +String nome
    }

    class Produto {
        +Int id
        +String nome
        +Float preco
        +Float quantidade
        +Int categorias_id
    }

    class Pedido {
        +Int id
        +DateTime horario
        +String endereco
        +Int cliente_id
    }

    class PedidoProduto {
        +Int pedido_id
        +Int produto_id
        +Float preco
        +Float quantidade
    }

    Cidade "1" --> "0..*" Cliente : possui
    Cliente "1" --> "0..*" Pedido : realiza
    Categoria "1" --> "0..*" Produto : classifica
    Pedido "1" --> "1..*" PedidoProduto : contém
    Produto "1" --> "0..*" PedidoProduto : participa
```

## Fluxograma — requisição e autorização

```mermaid
flowchart TD
    A[Cliente envia requisição] --> B{Rota protegida?}
    B -- Não --> C[Controller]
    B -- Sim --> D[authMiddleware]
    D --> E{JWT válido?}
    E -- Não --> F[401 Unauthorized]
    E -- Sim --> G{Rota somente ADMIN?}
    G -- Sim --> H[adminMiddleware]
    H --> I{tipo = ADMIN?}
    I -- Não --> J[403 Forbidden]
    I -- Sim --> C
    G -- Não --> C
    C --> K[Service]
    K --> L[Repository]
    L --> M[Prisma]
    M --> N[(MySQL)]
    N --> O[Resposta JSON]
```

## Fluxograma — criação de pedido

```mermaid
flowchart TD
    A[POST /pedidos + JWT] --> B[Obter cliente_id do JWT]
    B --> C[Validar endereço e itens]
    C --> D{Cliente existe?}
    D -- Não --> E[404 Cliente não encontrado]
    D -- Sim --> F[Iniciar transação]
    F --> G[Criar pedido]
    G --> H[Para cada item]
    H --> I{Produto existe?}
    I -- Não --> J[Rollback + 404]
    I -- Sim --> K{Estoque suficiente?}
    K -- Não --> L[Rollback + 400]
    K -- Sim --> M[Decrementar estoque]
    M --> N[Salvar pedidos_produtos]
    N --> O{Ainda há itens?}
    O -- Sim --> H
    O -- Não --> P[Commit]
    P --> Q[201 Created]
```

## Fluxo de autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant API as API
    participant DB as MySQL

    U->>API: POST /auth/login (email, senha)
    API->>DB: buscar cliente por email
    DB-->>API: cliente + hash da senha
    API->>API: bcrypt.compare()
    alt credenciais inválidas
        API-->>U: 401 Unauthorized
    else credenciais válidas
        API->>API: jwt.sign({id, tipo})
        API-->>U: token JWT
        U->>API: Authorization: Bearer token
        API->>API: jwt.verify()
        API-->>U: acesso ao recurso autorizado
    end
```
