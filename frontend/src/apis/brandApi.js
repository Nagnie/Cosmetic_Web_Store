import axios from "@utils/axios";

export const getBrands = async () => {
  const res = await axios.get("/brands");
  return res.data;
};
