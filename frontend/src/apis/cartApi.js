import axios from "@utils/axios";

export const addItemToCart = async (item) => {
  const res = await axios.post("/cart/add", item);

  return res.data;
};

export const fetchCartItems = async ({ page = 1, limit = 10, signal }) => {
  const res = await axios.get("/cart", {
    params: { page, limit },
    signal,
  });

  return res.data;
};

export const updateCartItem = async ({
  id_pro,
  id_class,
  quantity,
  old_id_class,
}) => {
  const res = await axios.patch("/cart/update", {
    id_pro,
    id_class,
    quantity,
    old_id_class,
  });

  return res.data;
};

export const removeCartItem = async ({ id_pro, id_class }) => {
  const res = await axios.delete(`/cart/delete`, {
    data: { id_pro, id_class },
  });

  return res.data;
};
