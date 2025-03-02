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
    id_cat INT,
    FOREIGN KEY (id_cat) REFERENCES category(id_cat) ON DELETE SET NULL
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
    id_subcat INT,
    id_bra INT,
    FOREIGN KEY (id_subcat) REFERENCES sub_category(id_subcat) ON DELETE SET NULL,
    FOREIGN KEY (id_bra) REFERENCES brand(id_bra) ON DELETE SET NULL
);

CREATE TABLE product_image (
    id_img SERIAL PRIMARY KEY,
    id_pro INT,
    link TEXT NOT NULL,
    FOREIGN KEY (id_pro) REFERENCES product(id_pro) ON DELETE CASCADE
);

-- Chèn danh mục chính (category) liên quan đến mỹ phẩm
INSERT INTO category (name) VALUES 
('Makeup'),
('Skincare'),
('Haircare'),
('Fragrances');

-- Chèn danh mục con (sub_category) cho từng loại mỹ phẩm
INSERT INTO sub_category (name, id_cat) VALUES 
-- Makeup
('Foundation', 1),
('Lipstick', 1),
('Eyeliner', 1),
('Blush', 1),

-- Skincare
('Moisturizers', 2),
('Cleansers', 2),
('Sunscreen', 2),
('Serums', 2),

-- Haircare
('Shampoo', 3),
('Conditioner', 3),
('Hair Oil', 3),
('Hair Mask', 3),

-- Fragrances
('Perfume', 4),
('Body Mist', 4),
('Cologne', 4);

