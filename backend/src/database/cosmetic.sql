CREATE TABLE account (
    id_acc SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE category (
    id_cat SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE sub_category (
    id_subcat SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_cat INT NOT NULL,
    FOREIGN KEY (id_cat) REFERENCES category(id_cat) ON DELETE CASCADE
);

CREATE TABLE brand (
    id_bra SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE product (
    id_pro SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    id_subcat INT NOT NULL,
    id_bra INT NOT NULL,
    FOREIGN KEY (id_subcat) REFERENCES sub_category(id_subcat) ON DELETE CASCADE,
    FOREIGN KEY (id_bra) REFERENCES brand(id_bra) ON DELETE CASCADE
);

CREATE TABLE product_image (
    id_img SERIAL PRIMARY KEY,
    id_pro INT NOT NULL,
    link TEXT NOT NULL,
    FOREIGN KEY (id_pro) REFERENCES product(id_pro) ON DELETE CASCADE
);

