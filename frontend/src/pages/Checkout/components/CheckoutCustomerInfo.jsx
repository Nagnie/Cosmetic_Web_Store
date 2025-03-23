import { fetchListOrderItems } from "@apis/orderApi";
import { useCartStore } from "@components/Cart";
import CustomSpin from "@components/Spin/CustomSpin";
import useFormPersistence from "@hooks/useFormPersistence";
import { useFinishOrder } from "@hooks/useOrderQueries";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@hooks/useLocationQueries";
import { Form, Input, Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const CheckoutCustomerInfo = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // State cho selected values
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // State cho location availability
  const [locationAvailability, setLocationAvailability] = useState({
    hasDistricts: true,
    hasWards: true,
  });

  // State cho loading submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking initial render for restoring
  const initialRender = useRef({
    isFirstLoad: true,
    districts: true,
    wards: true,
  });

  // Form persistence
  const { saveFormData } = useFormPersistence(form, "checkoutFormData");

  // Fetch locations sử dụng React Query
  const {
    data: cities = [],
    isLoading: loadingCities,
    error: citiesError,
  } = useProvinces();

  const {
    data: districts = [],
    isLoading: loadingDistricts,
    error: districtsError,
  } = useDistricts(selectedCity);

  const {
    data: wards = [],
    isLoading: loadingWards,
    error: wardsError,
  } = useWards(selectedDistrict);

  // Xử lý lỗi
  useEffect(() => {
    if (citiesError) {
      toast.error("Không thể tải danh sách tỉnh/thành phố");
      console.error("Error fetching provinces:", citiesError);
    }
    if (districtsError) {
      toast.error("Không thể tải danh sách quận/huyện");
      console.error("Error fetching districts:", districtsError);
    }
    if (wardsError) {
      toast.error("Không thể tải danh sách phường/xã");
      console.error("Error fetching wards:", wardsError);
    }
  }, [citiesError, districtsError, wardsError]);

  // Xử lý khi data districts và wards về
  useEffect(() => {
    if (selectedCity && districts) {
      if (!districts.length) {
        setLocationAvailability((prev) => ({ ...prev, hasDistricts: false }));
        form.setFieldsValue({
          district: "N/A",
          ward: "N/A",
        });
      } else {
        setLocationAvailability((prev) => ({ ...prev, hasDistricts: true }));

        // Restore district value nếu là first render
        if (initialRender.current.districts) {
          initialRender.current.districts = false;
          const savedData = localStorage.getItem("checkoutFormData");
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.district) {
              form.setFieldsValue({ district: parsedData.district });
              setSelectedDistrict(parsedData.district);
            }
          }
        }
      }
    }
  }, [districts, selectedCity, form]);

  useEffect(() => {
    if (selectedDistrict && wards) {
      if (!wards.length) {
        setLocationAvailability((prev) => ({ ...prev, hasWards: false }));
        form.setFieldsValue({
          ward: "N/A",
        });
      } else {
        setLocationAvailability((prev) => ({ ...prev, hasWards: true }));

        // Restore ward value nếu là first render
        if (initialRender.current.wards) {
          initialRender.current.wards = false;
          const savedData = localStorage.getItem("checkoutFormData");
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.ward) {
              form.setFieldsValue({ ward: parsedData.ward });
            }
          }
        }
      }
    }
  }, [wards, selectedDistrict, form]);

  // Restore saved location data (if any)
  useEffect(() => {
    if (!initialRender.current.isFirstLoad || !cities.length) return;

    const restoreSavedLocationData = () => {
      const savedFormData = localStorage.getItem("checkoutFormData");
      if (!savedFormData) return;

      const parsedData = JSON.parse(savedFormData);

      // Restore city
      if (parsedData.city) {
        form.setFieldsValue({ city: parsedData.city });
        setSelectedCity(parsedData.city);
        initialRender.current.isFirstLoad = false;
      }
    };

    restoreSavedLocationData();
  }, [cities, form]);

  // Handle city selection
  const handleCityChange = useCallback(
    (cityId) => {
      setSelectedCity(cityId);
      // Reset dependent fields
      form.setFieldsValue({
        district: undefined,
        ward: undefined,
      });
      setSelectedDistrict(null);
    },
    [form],
  );

  // Handle district selection
  const handleDistrictChange = useCallback(
    (districtId) => {
      if (districtId === "N/A") return;

      setSelectedDistrict(districtId);
      form.setFieldsValue({
        ward: undefined,
      });
    },
    [form],
  );

  const finishOrderMutation = useFinishOrder();
  const totalCartPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore((state) => state.itemCount);
  const discountInfo = useCartStore((state) => state.discountInfo);

  const queryClient = useQueryClient();

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Save form data
      saveFormData(values);

      // Get location names
      const cityName =
        cities.find((city) => city.id === values.city)?.name || "";
      const districtName =
        districts.find((district) => district.id === values.district)?.name ||
        "N/A";
      const wardName =
        wards.find((ward) => ward.id === values.ward)?.name || "N/A";

      // Format location data for submission
      const formattedAddress = {
        ...values,
        cityName,
        districtName,
        wardName,
      };

      // Submit order
      const data = await fetchListOrderItems();

      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        toast.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        return;
      }

      const order_items = data.data.map((item) => ({
        id_pro: item?.id_pro ?? item?.id ?? 0,
        pro_image: item.images[0] || "",
        pro_name: item?.pro_name ?? item?.name ?? "",
        id_class: item.id_class ?? 0,
        class_name: item.class_name || "",
        quantity: +item.quantity || 1,
        price: Number(item?.pro_price ?? item?.price ?? 0),
        type: item.type || "product",
      }));

      const persistData = {
        name: formattedAddress.name,
        email: formattedAddress.email || "",
        phone: formattedAddress.phone,
        address: `${formattedAddress.address}, ${formattedAddress.wardName}, ${formattedAddress.districtName}, ${formattedAddress.cityName}`,
        note: formattedAddress.note || "",
        order_items: order_items,
        total_price: discountInfo?.new_total_prices
          ? +discountInfo.new_total_prices
          : +totalCartPrice || 0,
      };

      const res = await finishOrderMutation.mutateAsync({
        ...persistData,
      });

      if (res && +res.statusCode === 201) {
        toast.success("Đặt hàng thành công!");

        // Clear cart
        clearCart();
        queryClient.invalidateQueries("infiniteCartItems");

        navigate("/payment-confirmation", {
          state: {
            invoice_url: res.invoice_url.url,
            qr_code_url: res.qr_code_url.url,
          },
        });

        return res;
      } else {
        toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phone number validator
  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập số điện thoại!"));
    }

    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(new Error("Số điện thoại chỉ được chứa số!"));
    }

    if (value.length < 10 || value.length > 11) {
      return Promise.reject(new Error("Số điện thoại phải có 10-11 số!"));
    }

    return Promise.resolve();
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Thông tin giao hàng
      </h2>

      <div className="mt-2">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          name="checkout-form"
          scrollToFirstError
        >
          {/* Name field */}
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên người nhận"
              className="rounded-md"
            />
          </Form.Item>

          {/* Email and Phone */}
          <div className="grid gap-0 sm:grid-cols-2 sm:gap-4">
            <Form.Item
              label="Email"
              name="email"
              tooltip={{
                title: "Email sẽ được sử dụng để nhận thông báo đơn hàng",
                icon: <span className="text-gray-400">(không bắt buộc)</span>,
              }}
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
            >
              <Input placeholder="example@email.com" className="rounded-md" />
            </Form.Item>

            <Form.Item
              required
              label="Số điện thoại"
              name="phone"
              rules={[{ validator: validatePhoneNumber }]}
            >
              <Input placeholder="0xxxxxxxxx" className="rounded-md" />
            </Form.Item>
          </div>

          {/* Address */}
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input
              placeholder="Số nhà, tên đường, khu vực..."
              className="rounded-md"
            />
          </Form.Item>

          {/* Location selectors */}
          <div className="grid gap-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <Form.Item
              label="Tỉnh/Thành phố"
              name="city"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
              ]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleCityChange}
                className="w-full rounded-md"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={loadingCities}
                disabled={loadingCities}
                notFoundContent={
                  loadingCities ? <CustomSpin size="small" /> : null
                }
              >
                {cities.map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, currentValues) => {
                return prevValues.city !== currentValues.city;
              }}
            >
              {({ getFieldValue }) => (
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    disabled={!getFieldValue("city") || loadingDistricts}
                    className="w-full rounded-md"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    loading={loadingDistricts}
                    notFoundContent={
                      loadingDistricts ? <CustomSpin size="small" /> : null
                    }
                  >
                    {locationAvailability.hasDistricts ? (
                      districts.map((district) => (
                        <Select.Option key={district.id} value={district.id}>
                          {district.name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="N/A">N/A</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, currentValues) => {
                return (
                  prevValues.district !== currentValues.district ||
                  prevValues.city !== currentValues.city
                );
              }}
            >
              {({ getFieldValue }) => (
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    disabled={
                      !getFieldValue("district") ||
                      !locationAvailability.hasDistricts ||
                      loadingWards
                    }
                    className="w-full rounded-md"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    loading={loadingWards}
                    notFoundContent={
                      loadingWards ? <CustomSpin size="small" /> : null
                    }
                  >
                    {locationAvailability.hasWards ? (
                      wards.map((ward) => (
                        <Select.Option key={ward.id} value={ward.id}>
                          {ward.name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="N/A">N/A</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          </div>

          <div>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea
                rows={4}
                placeholder="Nhập ghi chú (nếu có)"
                className="rounded-md"
              />
            </Form.Item>
          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              to="/cart"
              className="text-primary flex shrink-0 items-center justify-center gap-1 text-sm font-semibold"
            >
              <span className="text-primary underline">Quay lại giỏ hàng</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !itemCount}
              className={`bg-primary hover:bg-primary-dark flex w-full items-center justify-center rounded-md py-3 text-white transition-colors duration-300 ${
                isSubmitting || !itemCount
                  ? "!cursor-not-allowed opacity-70"
                  : ""
              }`}
            >
              {isSubmitting ? <CustomSpin size="small" /> : null}
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutCustomerInfo;
