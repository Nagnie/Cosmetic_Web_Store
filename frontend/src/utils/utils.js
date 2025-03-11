export const numberToArray = (number) => {
  return Array.from({ length: number }, (_, i) => i);
};

export const formatCurrency = (number, currency = "VND") => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency || "VND",
  }).format(number);
};
