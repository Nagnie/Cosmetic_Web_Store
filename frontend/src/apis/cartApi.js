import axios from "@utils/axios";

export const addItemToCart = async (item) => {
  const res = await axios.post("/cart/add", item);
  return res.data;
};
