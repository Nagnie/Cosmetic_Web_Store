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
