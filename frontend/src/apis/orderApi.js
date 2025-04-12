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

export const createInvoice = async (fullData) => {
  const response = await axios.post("/order/invoice",
    fullData,
  );
  return response.data;
};

export const checkoutPayment = async (fullPayload) => {
  const response = await axios.post(
      "/payment/checkout",
      fullPayload,
      { withCredentials: true }
  );
  return response.data;
};

export const cancelPayment = async (error) => {
  const response = await axios.get(
      `/payment/cancel/${error}`
  );
  return response.data;
};

export const fetchListOrderItems = async () => {
  const response = await axios.get("/order/list-product");

  return response.data;
};


