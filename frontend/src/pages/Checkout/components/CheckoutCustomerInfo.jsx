import useFormPersistence from "@hooks/useFormPersistence";
import LocationService from "@services/LocationService";
import { Form, Input, Select, Spin, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CheckoutCustomerInfo = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Location states
  const [locationData, setLocationData] = useState({
    cities: [],
    districts: [],
    wards: [],
  });

  const [locationAvailability, setLocationAvailability] = useState({
    hasDistricts: true,
    hasWards: true,
  });

  // Loading states
  const [loading, setLoading] = useState({
    cities: false,
    districts: false,
    wards: false,
    submit: false,
  });

  // Tracking initial render for restoring
  const initialRender = useRef({
    isFirstLoad: true,
    districts: true,
    wards: true,
  });

  // Form persistence
  const { saveFormData } = useFormPersistence(form, "checkoutFormData");

  // Load initial data (cities)
  useEffect(() => {
    const loadCities = async () => {
      setLoading((prev) => ({ ...prev, cities: true }));
      try {
        const data = await LocationService.fetchProvinces();
        if (data.data && Array.isArray(data.data)) {
          setLocationData((prev) => ({ ...prev, cities: data.data }));
        } else {
          message.error("Không thể tải danh sách tỉnh/thành phố");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        message.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    loadCities();
  }, []);

  // Restore saved location data (if any)
  useEffect(() => {
    if (!initialRender.current.isFirstLoad) return;

    const restoreSavedLocationData = async () => {
      const savedFormData = localStorage.getItem("checkoutFormData");
      if (!savedFormData) return;

      const parsedData = JSON.parse(savedFormData);

      // Restore location data in sequence
      if (parsedData.city) {
        await handleCityChange(parsedData.city);

        if (parsedData.district && parsedData.district !== "N/A") {
          await handleDistrictChange(parsedData.district);
        }
      }

      initialRender.current.isFirstLoad = false;
    };

    restoreSavedLocationData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle city selection
  const handleCityChange = useCallback(
    async (cityId) => {
      // Reset dependent fields
      form.setFieldsValue({
        district: undefined,
        ward: undefined,
      });

      setLoading((prev) => ({ ...prev, districts: true }));

      try {
        const data = await LocationService.fetchDistricts(cityId);

        if (!data.data || data.data.length === 0) {
          setLocationAvailability((prev) => ({ ...prev, hasDistricts: false }));
          setLocationData((prev) => ({ ...prev, districts: [], wards: [] }));

          // Set N/A values
          form.setFieldsValue({
            district: "N/A",
            ward: "N/A",
          });
        } else {
          setLocationAvailability((prev) => ({ ...prev, hasDistricts: true }));
          setLocationData((prev) => ({ ...prev, districts: data.data }));

          // Restore district value if first render
          if (initialRender.current.districts) {
            initialRender.current.districts = false;
            const savedData = localStorage.getItem("checkoutFormData");
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              form.setFieldsValue({
                district: parsedData.district,
              });
            }
          }
        }

        return data.data;
      } catch (error) {
        console.error("Error fetching districts:", error);
        message.error("Không thể tải danh sách quận/huyện");
      } finally {
        setLoading((prev) => ({ ...prev, districts: false }));
      }
    },
    [form],
  );

  // Handle district selection
  const handleDistrictChange = useCallback(
    async (districtId) => {
      if (districtId === "N/A") return;

      form.setFieldsValue({
        ward: undefined,
      });

      setLoading((prev) => ({ ...prev, wards: true }));

      try {
        const data = await LocationService.fetchWards(districtId);

        if (!data.data || data.data.length === 0) {
          setLocationAvailability((prev) => ({ ...prev, hasWards: false }));
          setLocationData((prev) => ({ ...prev, wards: [] }));

          form.setFieldsValue({
            ward: "N/A",
          });
        } else {
          setLocationAvailability((prev) => ({ ...prev, hasWards: true }));
          setLocationData((prev) => ({ ...prev, wards: data.data }));

          // Restore ward value if first render
          if (initialRender.current.wards) {
            initialRender.current.wards = false;
            const savedData = localStorage.getItem("checkoutFormData");
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              form.setFieldsValue({
                ward: parsedData.ward,
              });
            }
          }
        }

        return data.data;
      } catch (error) {
        console.error("Error fetching wards:", error);
        message.error("Không thể tải danh sách phường/xã");
      } finally {
        setLoading((prev) => ({ ...prev, wards: false }));
      }
    },
    [form],
  );

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      // Save form data
      saveFormData(values);

      // Format location data for submission
      const formattedAddress = {
        ...values,
        cityName:
          locationData.cities.find((city) => city.id === values.city)?.name ||
          "",
        districtName:
          locationData.districts.find(
            (district) => district.id === values.district,
          )?.name || "N/A",
        wardName:
          locationData.wards.find((ward) => ward.id === values.ward)?.name ||
          "N/A",
      };

      console.log("Submitting form data:", formattedAddress);

      // Navigate to next step
      navigate("/payment-confirmation");
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
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
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-sm">
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
                loading={loading.cities}
                disabled={loading.cities}
                notFoundContent={loading.cities ? <Spin size="small" /> : null}
              >
                {locationData.cities.map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!form.getFieldValue("city") || loading.districts}
                className="w-full rounded-md"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={loading.districts}
                notFoundContent={
                  loading.districts ? <Spin size="small" /> : null
                }
              >
                {locationAvailability.hasDistricts ? (
                  locationData.districts.map((district) => (
                    <Select.Option key={district.id} value={district.id}>
                      {district.name}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="N/A">N/A</Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={
                  !form.getFieldValue("district") ||
                  !locationAvailability.hasDistricts ||
                  loading.wards
                }
                className="w-full rounded-md"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                loading={loading.wards}
                notFoundContent={loading.wards ? <Spin size="small" /> : null}
              >
                {locationAvailability.hasWards ? (
                  locationData.wards.map((ward) => (
                    <Select.Option key={ward.id} value={ward.id}>
                      {ward.name}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="N/A">N/A</Select.Option>
                )}
              </Select>
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
              disabled={loading.submit}
              className={`bg-primary hover:bg-primary-dark flex w-full items-center justify-center rounded-md py-3 text-white transition-colors duration-300 ${
                loading.submit ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading.submit ? <Spin size="small" className="mr-2" /> : null}
              {loading.submit ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutCustomerInfo;
