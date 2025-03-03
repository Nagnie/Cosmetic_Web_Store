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

INSERT INTO brand (name) VALUES 
('Maybelline'),
('Neutrogena'),
('Dove'),
('Chanel'),
('Gucci'),
('Versace'),
('Clinique'),
('Estée Lauder'),
('Nivea');


-- Chèn dữ liệu mẫu vào bảng product
INSERT INTO product (name, price, description, status, id_subcat, id_bra) VALUES 
-- Makeup
('Liquid Foundation', 15.99, 'A lightweight liquid foundation for all-day wear.', 'available', 1, 1),
('Matte Lipstick', 9.99, 'Long-lasting matte lipstick with vibrant color.', 'available', 2, 2),
('Waterproof Eyeliner', 7.99, 'Smudge-proof and waterproof eyeliner.', 'available', 3, 3),
('Peach Blush', 12.50, 'Soft peach-colored blush for a natural glow.', 'available', 4, 1),

-- Skincare
('Hydrating Moisturizer', 25.00, 'Moisturizer with hyaluronic acid for deep hydration.', 'available', 5, 4),
('Gentle Face Cleanser', 18.99, 'Mild cleanser suitable for sensitive skin.', 'available', 6, 5),
('SPF 50 Sunscreen', 22.50, 'Broad-spectrum sunscreen for ultimate protection.', 'available', 7, 6),
('Vitamin C Serum', 30.00, 'Brightening serum with vitamin C and antioxidants.', 'available', 8, 4),

-- Haircare
('Anti-Dandruff Shampoo', 10.99, 'Shampoo formulated to reduce dandruff.', 'available', 9, 7),
('Deep Conditioner', 14.99, 'Intensive conditioner for dry and damaged hair.', 'available', 10, 8),
('Argan Hair Oil', 19.99, 'Nourishing hair oil infused with argan oil.', 'available', 11, 9),
('Keratin Hair Mask', 21.50, 'Strengthening mask for smooth and frizz-free hair.', 'available', 12, 7),

-- Fragrances
('Luxury Perfume', 49.99, 'A long-lasting luxury perfume with floral notes.', 'available', 13, 10),
('Refreshing Body Mist', 15.99, 'Light body mist with a fresh and citrus scent.', 'available', 14, 11),
('Classic Men\'s Cologne', 39.99, 'Sophisticated cologne with woody undertones.', 'available', 15, 12);

