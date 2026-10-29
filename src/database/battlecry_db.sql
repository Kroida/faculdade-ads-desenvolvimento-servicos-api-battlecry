CREATE DATABASE IF NOT EXISTS battlecry_bd;
USE battlecry_bd;

CREATE TABLE cidades (
    id INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    altura DOUBLE,
    nascimento DATETIME(3),
    cidade_id INT,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'CLIENTE',

    PRIMARY KEY (id),

    CONSTRAINT clientes_cidade_id_fkey
        FOREIGN KEY (cidade_id)
        REFERENCES cidades(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT,
    horario DATETIME NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cliente_id INT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_pedidos_clientes
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,
    categorias_id INT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_produtos_categorias
        FOREIGN KEY (categorias_id)
        REFERENCES categorias(id)
);

CREATE TABLE pedidos_produtos (
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,

    PRIMARY KEY (pedido_id, produto_id),

    CONSTRAINT fk_pedidos_produtos_pedidos
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id),

    CONSTRAINT fk_pedidos_produtos_produtos
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);
