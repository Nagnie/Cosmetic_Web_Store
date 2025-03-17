import axios from "@utils/axios";

export const finishOrder = async ({
  name,
  email,
  phone,
  address,
  note,
  order_items,
  total_price,
}) => {
  const response = await axios.post("/order/finish", {
    name,
    email,
    phone,
    address,
    note,
    order_items,
    total_price,
  });
  return response.data;
};

export const fetchListOrderItems = async () => {
  const response = await axios.get("/order/list-product");

  return response.data;
};
