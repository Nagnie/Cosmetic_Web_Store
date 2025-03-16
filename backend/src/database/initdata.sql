INSERT INTO category (name) VALUES 
('Chăm sóc da'),
('Chăm sóc tóc'),
('Chăm sóc cơ thể'),
('Đồ trang điểm'),
('Thực phẩm chức năng');

INSERT INTO brand (name) VALUES
('TheOrdinary'),
('MediAnswer'),
('CNP'),
('Abib'),
('Mise En Scene'),
('UNOVE'),
('Beyond'),
('Sungboon'),
('HEVEBLUE'),
('Romand');

INSERT INTO sub_category (name, id_cat) VALUES 
-- Chăm sóc da
('Sửa rửa mặt', 1),
('Tẩy trang', 1),
('Tẩy tế bào chết', 1),
('Toner/Lotion', 1),
('Serum/Essence', 1),
('Xịt khoáng', 1),
('Chống nắng', 1),
('Duỡng môi', 1),
('Chăm sóc mắt', 1),
('Mặt nạ', 1),
('Kem dưỡng', 1),

-- Chăm sóc tóc
('Dầu gội/xả', 2),
('Dưỡng tóc/Ủ tóc', 2),

-- Chăm sóc cơ thể
('Sữa tắm', 3),
('Dưỡng thể', 3),
('Tẩy da chết', 3),
('Dưỡng da tay', 3),
('Khử mùi/Nước hoa', 3),
('Chăm sóc vùng kín', 3),

-- Đồ trang điểm
('Son', 4),
('Kem nền/Cushion', 4),
('Che khuyết điểm', 4),
('Tạo khối/Highlight', 4),
('Kem lót', 4),
('Phấn phủ', 4),
('Phấn mắt', 4),
('Kẻ mắt', 4),
('Kẻ chân mày', 4),
('Mascara', 4),
('Xịt khóa nền', 4),
('Má hồng', 4),

-- Chức năng thực phẩm
('Chống lão ', 5),
('Dưỡng trắng', 5),
('Tăng sức đề kháng', 5),
('Hỗ trợ tiêu hóa', 5),
('Giảm cân', 5),
('Sâm, nấm, thuốc đột quỵ', 5);



INSERT INTO product (name, price, description, status, id_subcat, id_bra) VALUES 
('Toner TheOrdinary Glycolic Acid 7%Toning Solution', 400.000, 'Nước hoa hồng với 7% Glycolic Acid giúp tẩy da chết một cách nhẹ nhàng, loại bỏ các lớp sừng trên cùng của da, làm da sáng và mềm mượt hơn. Nước hoa hồng The Ordinary Glycolic Acid 7% Toning Solution pH~3.6 giúp cải thiện làn da không đều màu, tăng độ mượt của bề mặt da khi dùng thường xuyên.', 'available', 4, 1),
('HEVEBLUE Salmon Caring Centella Toner 200ml', 600.000, 'Duy trì cân bằng dầu - nước cho da với công thức hơi axit pH 5.5, giúp làn da luôn khỏe mạnh. Loại bỏ nước tinh khiết, thay vào đó là những thành phần cao cấp, bao gồm 828.168ppm nước chiết xuất rau má, madecassoside và 30.380ppm nước chiết xuất rau sam, mang đến hiệu quả tối ưu.Bổ sung 30.000ppm chiết xuất trứng cá hồi và 5.000ppm PDRN, tận dụng sức mạnh phục hồi từ cá hồi để tái tạo và chữa lành làn da tổn thương.', 'available', 9, 4),
('Mặt Nạ Thạch Collagen MediAnswer Vita Collagen Mask Hộp 10 miếng', 450.000, 'Chứa tới 83% Collagen tươi phân tử cực nhỏ thẩm thấu sâu vào da, nuôi dưỡng da căng trẻ. Bổ sung 20% Vitamin C dưỡng trắng mịn màng', 'available', 11, 2),
('Sungboon EDITOR Silk Peptide Nâng Chuyên Sâu Ampoule 35ml', 380.000, 'Ống nâng sợi peptit tơ tằm chống lại tuổi da. Chứa các peptide tơ tằm được cấp bằng sáng chế của Hàn Quốc để làm trắng và nâng nếp nhăn (13 loại phức hợp peptit).', 'available', 5, 8),
('Xịt khoáng CNP Laboratory Propolis Ampule Mist 100ml', 320.000, 'Sản phẩm chứa chiết xuất keo ong Amazon giúp chống oxy hóa hiệu quả để cải thiện sức sống của làn da. Thành phần Hyaluronic Acid giữ ẩm giúp duy trì làn da săn chắc, khỏe mạnh và sáng mịn.', 'available', 6, 3),
('Kem dưỡng phục hồi Abib Jericho Rose Cream Nutrition Tube 75ml', 580.000, 'Chiết xuất hoa hồng Jericho và nấm Chaga phục hồi và nuôi dưỡng da hư tổn và giữ làn da khoẻ khoắn. Dạng kem mịn thẩm thấu vào da và không để lại cảm giác dính. Chiết xuất Jericho giúp kích hoạt cấu trúc da, tăng khả năng hấp thụ các dưỡng chất hiệu quả để cấp ẩm và nuôi dưỡng làn da.', 'available', 11, 4),
('Serum dưỡng ẩm, chống lão hoá Abib Jericho Rose Bifida Serum Firming Drop 50ml', 320.000, 'Chiết xuất Cây Phục Sinh không chỉ chứa Trehalose, thành phần hút độ ẩm từ môi trường mạnh hơn HA và là nguồn chất chống oxy hóa (Quercetin) dồi dào dể chống lão hóa. Niacinamide, Vitamin C (SAP), Vitamin E, Bakuchiol chống oxy hóa mạnh ở cấp độ tế bào.', 'available', 5, 4),
('Mise En Scene Salon 10 Protein Shampoo 500ml (For Damaged Hair/For Extremely Damaged Hair)', 480.000, 'Tăng cường độ chắc khỏe cho tóc và cải thiện độ đàn hồi. Giúp giảm rối và thô ráp tóc', 'available', 12, 5),
('UNOVE Silk Oil Essence 70ml', 600.000, 'Đảm bảo độ suôn mượt lí tưởng cho tóc. Cung cấp các dưỡng chất thiết yếu cho tóc, chăm sóc và nuôi dưỡng sợi tóc', 'available', 13, 6),
('Sữa Tắm Dưỡng Ẩm Beyond Deep Moisture Body Wash 300ml', 650.000, 'Sữa tắm làm sạch & cấp ẩm tức thì cho làn da. Cải thiện tình trạng da khô, thô ráp trở nên mịn màng, săn chắc và khỏe khoắn hơn.', 'available', 14, 7),
('Deep Conditioner', 14.99, 'Intensive conditioner for dry and damaged hair.', 'available', 10, 8),
('Argan Hair Oil', 19.99, 'Nourishing hair oil infused with argan oil.', 'available', 11, 9),
('Keratin Hair Mask', 21.50, 'Strengthening mask for smooth and frizz-free hair.', 'available', 12, 7);
