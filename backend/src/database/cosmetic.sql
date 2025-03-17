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
    FOREIGN KEY (id_cat) REFERENCES category(id_cat) ON DELETE CASCADE
);

CREATE TABLE brand (
    id_bra SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    image TEXT
);

CREATE TABLE product (
    id_pro SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    id_subcat INT,
    id_bra INT,
    FOREIGN KEY (id_subcat) REFERENCES sub_category(id_subcat) ON DELETE CASCADE,
    FOREIGN KEY (id_bra) REFERENCES brand(id_bra) ON DELETE CASCADE
);

CREATE TABLE product_image (
    id_img SERIAL PRIMARY KEY,
    id_pro INT,
    link TEXT NOT NULL,
    FOREIGN KEY (id_pro) REFERENCES product(id_pro) ON DELETE CASCADE
);

CREATE TABLE classification (
    id_class SERIAL PRIMARY KEY,
    name VARCHAR(255),
    id_pro INT,
    FOREIGN KEY (id_pro) REFERENCES product(id_pro) ON DELETE CASCADE
);

CREATE TYPE order_status AS ENUM ('delivered', 'delivering', 'ordered', 'not_ordered');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(10),
    address VARCHAR(255),
    status order_status,
    sum_price DECIMAL(10, 2) DEFAULT 0,
    note TEXT,
    checked BOOLEAN DEFAULT FALSE
);

CREATE TABLE order_detail (
    id SERIAL PRIMARY KEY,
    order_id INT,
    pro_id INT,
    pro_image TEXT,
    pro_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10,2) NOT NULL,
    class_id INT,
    class_name VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pro_id) REFERENCES product(id_pro) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classification(id_class) ON DELETE CASCADE
);


create function cal_order_sum_price_on_insert_update_item() returns trigger as $$
begin
    update orders
    set sum_price = (
        select sum(quantity * price)
        from order_detail
        where order_id = new.order_id
    )
    where id = new.order_id;

    return null;
end;
$$ language plpgsql;

create function cal_order_sum_price_on_delete_item() returns trigger as $$
begin
    update orders
    SET sum_price = COALESCE(sum_price, 0) - (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_detail
        WHERE order_id = OLD.order_id
    )
    where id = old.order_id;

    return null;
end;
$$ language plpgsql;

create trigger update_order_sum_price_on_insert_update
after insert or update on order_detail
for each row execute function cal_order_sum_price_on_insert_update_item();

create trigger update_order_sum_price_on_delete
after delete on order_detail
for each row execute function cal_order_sum_price_on_delete_item();

-- Chèn danh mục chính (category) liên quan đến mỹ phẩm
-- INSERT INTO category (name) VALUES 
-- ('Makeup'),
-- ('Skincare'),
-- ('Haircare'),
-- ('Fragrances');

-- -- Chèn danh mục con (sub_category) cho từng loại mỹ phẩm
-- INSERT INTO sub_category (name, id_cat) VALUES 
-- -- Makeup
-- ('Foundation', 1),
-- ('Lipstick', 1),
-- ('Eyeliner', 1),
-- ('Blush', 1),

-- -- Skincare
-- ('Moisturizers', 2),
-- ('Cleansers', 2),
-- ('Sunscreen', 2),
-- ('Serums', 2),

-- -- Haircare
-- ('Shampoo', 3),
-- ('Conditioner', 3),
-- ('Hair Oil', 3),
-- ('Hair Mask', 3),

-- -- Fragrances
-- ('Perfume', 4),
-- ('Body Mist', 4),
-- ('Cologne', 4);

-- INSERT INTO brand (name) VALUES 
-- ('Maybelline'),
-- ('Neutrogena'),
-- ('Dove'),
-- ('Chanel'),
-- ('Gucci'),
-- ('Versace'),
-- ('Clinique'),
-- ('Estée Lauder'),
-- ('Nivea');


-- -- Chèn dữ liệu mẫu vào bảng product
-- INSERT INTO product (name, price, description, status, id_subcat, id_bra) VALUES 
-- -- Makeup
-- ('Liquid Foundation', 15.99, 'A lightweight liquid foundation for all-day wear.', 'available', 1, 1),
-- ('Matte Lipstick', 9.99, 'Long-lasting matte lipstick with vibrant color.', 'available', 2, 2),
-- ('Waterproof Eyeliner', 7.99, 'Smudge-proof and waterproof eyeliner.', 'available', 3, 3),
-- ('Peach Blush', 12.50, 'Soft peach-colored blush for a natural glow.', 'available', 4, 1),

-- -- Skincare
-- ('Hydrating Moisturizer', 25.00, 'Moisturizer with hyaluronic acid for deep hydration.', 'available', 5, 4),
-- ('Gentle Face Cleanser', 18.99, 'Mild cleanser suitable for sensitive skin.', 'available', 6, 5),
-- ('SPF 50 Sunscreen', 22.50, 'Broad-spectrum sunscreen for ultimate protection.', 'available', 7, 6),
-- ('Vitamin C Serum', 30.00, 'Brightening serum with vitamin C and antioxidants.', 'available', 8, 4),

-- -- Haircare
-- ('Anti-Dandruff Shampoo', 10.99, 'Shampoo formulated to reduce dandruff.', 'available', 9, 7),
-- ('Deep Conditioner', 14.99, 'Intensive conditioner for dry and damaged hair.', 'available', 10, 8),
-- ('Argan Hair Oil', 19.99, 'Nourishing hair oil infused with argan oil.', 'available', 11, 9),
-- ('Keratin Hair Mask', 21.50, 'Strengthening mask for smooth and frizz-free hair.', 'available', 12, 7),

-- -- Fragrances
-- ('Luxury Perfume', 49.99, 'A long-lasting luxury perfume with floral notes.', 'available', 13, 10),
-- ('Refreshing Body Mist', 15.99, 'Light body mist with a fresh and citrus scent.', 'available', 14, 11),
