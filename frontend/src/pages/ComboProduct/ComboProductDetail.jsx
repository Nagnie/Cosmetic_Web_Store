import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ProductImageGallery } from "@pages/ProductDetail/components/index.js";
import { Button, Spin, message } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import comboApi from "@apis/comboApi.js";
import { useAddCartItem } from "@hooks/useCartQueries";
import { toast } from "react-toastify";
import Card from "./Component/Card.jsx"

const CosmeticComboPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Query to fetch combo details using the id from URL params
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comboDetail", id],
    queryFn: ({ signal }) =>
      comboApi
        .getComboDetail(id, { signal })
        .then((response) => response.data.data),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const comboData = data?.[0];

  console.log(comboData);

  // Format price with dots as thousand separators and add VNĐ
  const formatPrice = (price) => {
    if (!price) return "";
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
  };

  const addCartItemMutation = useAddCartItem();

  const handleAddToCart = async () => {
    const item = {
      id_pro: comboData.id_pro ?? comboData?.id_combo ?? 0,
      id_class: comboData?.id_class ?? 0,
      quantity: 1,
      type: comboData.type || "combo",
    };

    try {
      const res = await addCartItemMutation.mutateAsync(item);

      if (res && res.cart && res.cart.length > 0) {
        toast.success("Thêm vào giỏ hàng thành công");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleBuyNow = async () => {
    const item = {
      id_pro: comboData.id_pro ?? comboData?.id_combo ?? 0,
      id_class: comboData?.id_class ?? 0,
      quantity: 1,
      type: comboData.type || "combo",
    };

    try {
      const res = await addCartItemMutation.mutateAsync({
        ...item,
        isBuyNow: true,
      });

      if (res && res.cart && res.cart.length > 0) {
        navigate("/checkout");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  // Prepare images for gallery component
  const images = useMemo(() => {
    if (!comboData || !comboData.images || !comboData.images.length) {
      return [{ id: 0, src: "https://placehold.co/400x400/png?text=No+Image" }];
    }

    return comboData.images.map((image, index) => ({
      id: index,
      src: image,
    }));
  }, [comboData?.images]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen mt-50 items-center justify-center">
        <Spin
          size="large"
          // tip="Đang tải..." thư viện đang bị lỗi nên không sử dụng được
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl text-red-500">
          Có lỗi xảy ra khi tải thông tin combo
        </h2>
        <p className="mb-4 text-gray-600">
          {error?.message || "Vui lòng thử lại sau"}
        </p>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (!comboData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl text-gray-700">Không tìm thấy combo</h2>
        <Button type="primary" onClick={() => navigate("/all_combos")}>
          Xem danh sách combo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-50 min-h-screen max-w-7xl px-4 py-8">
      {/* Main Content - 2 Column Grid */}
      <div className="mb-12 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <ProductImageGallery images={images} />
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6 ps-4">
          <h2 className="text-3xl font-bold text-gray-800">{comboData.name}</h2>

          <div className="flex items-center space-x-4">
            {comboData.origin_price && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(comboData.origin_price)}
              </span>
            )}
            <span className="text-primary-dark text-2xl font-semibold">
              {formatPrice(comboData.price)}
            </span>
            <span
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                comboData.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {comboData.status === "available" ? "Có sẵn" : "Đặt hàng"}
            </span>
          </div>

          <div className="rounded-lg bg-gray-50">
            <h3 className="mb-2 text-lg font-medium">Mô tả:</h3>
            <p className="text-gray-700">{comboData.description}</p>
          </div>

          <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
            <Button
              type="default"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={handleAddToCart}
              disabled={comboData.status !== "available"}
              className="!bg-secondary !border-secondary !text-primary-dark flex flex-1 items-center justify-center"
            >
              Thêm vào giỏ
            </Button>

            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              size="large"
              onClick={handleBuyNow}
              disabled={comboData.status !== "available"}
              className="!bg-primary-dark !border-primary-dark flex flex-1 items-center justify-center !text-white"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Product Cards Section */}
      {comboData.products && comboData.products.length > 0 && (
        <div className="mt-20">
          <h2 className="my-10 text-3xl font-bold text-primary-dark">
            Sản phẩm trong combo
          </h2>
          <div className="grid grid-cols-1 mb-15 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {comboData.products.map((product) => (
                <Card key={product.id_pro} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmeticComboPage;
