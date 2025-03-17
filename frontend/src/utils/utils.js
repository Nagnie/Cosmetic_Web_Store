export const numberToArray = (number) => {
  return Array.from({ length: number }, (_, i) => i);
};

export const formatCurrency = ({
  number,
  currency = "VND",
  useFullCurrencyName = false,
}) => {
  const formattedNumber = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency || "VND",
  }).format(number);

  if (useFullCurrencyName && currency === "VND") {
    return formattedNumber.replace("₫", "VNĐ");
  }

  return formattedNumber;
};

export const getUnavailableClassifications = (cartItems) => {
  // Kết quả trả về: { `${id_pro}_${id_class}`: [unavailable_id_class] }
  const result = {};

  // Nhóm các item theo id_pro
  const groupedByIdPro = {};

  cartItems.forEach((item) => {
    if (!groupedByIdPro[item.id_pro]) {
      groupedByIdPro[item.id_pro] = [];
    }
    groupedByIdPro[item.id_pro].push(item);
  });

  // Xử lý mỗi nhóm sản phẩm
  Object.keys(groupedByIdPro).forEach((id_pro) => {
    const items = groupedByIdPro[id_pro];

    // Chỉ xử lý nếu sản phẩm có nhiều hơn 1 phân loại đã chọn
    if (items.length > 1) {
      // Lấy danh sách các id_class đã được chọn cho sản phẩm này
      const selectedClassIds = items
        .filter((item) => item.id_class !== null)
        .map((item) => item.id_class);

      // Duyệt qua từng item trong nhóm
      items.forEach((currentItem) => {
        const key = `${currentItem.id_pro}_${currentItem.id_class || "null"}`;
        result[key] = [];

        // Thêm tất cả id_class đã chọn vào danh sách không thể chọn,
        // ngoại trừ id_class hiện tại của item
        selectedClassIds.forEach((classId) => {
          if (classId !== currentItem.id_class) {
            result[key].push(classId);
          }
        });
      });
    }
  });

  return result;
};

export const getAvailableClassifications = (product, unavailableClasses) => {
  const key = `${product.id_pro}_${product.id_class || "null"}`;
  const unavailableClassIds = unavailableClasses[key] || [];

  // Lọc ra các phân loại còn có thể chọn
  return product.classification.filter(
    (cls) => !unavailableClassIds.includes(cls.id_class),
  );
};
