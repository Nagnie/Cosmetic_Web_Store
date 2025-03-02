import { useState } from "react";
import { Image } from "antd";
import PropTypes from "prop-types";

const IMAGE_LIST = [
  {
    id: 1,
    src: "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  },
  {
    id: 2,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
];

const ProductImageGallery = ({ images = [] }) => {
  const imageList = images.length ? images : IMAGE_LIST;

  const [currentImage, setCurrentImage] = useState(IMAGE_LIST[0]);
  const [isChanging, setIsChanging] = useState(false);
  const [nextImage, setNextImage] = useState(null);

  const handleImageClick = (image) => {
    if (currentImage.id === image.id) return;

    setNextImage(image);
    setIsChanging(true);

    setTimeout(() => {
      setCurrentImage(image);

      setTimeout(() => {
        setIsChanging(false);
        setNextImage(null);
      }, 10);
    }, 300);
  };

  if (imageList.length === 0) {
    return <div className="text-gray-500">Không có hình ảnh sản phẩm</div>;
  }

  return (
    <div className="product-gallery select-none">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="scrollbar-hide order-2 flex gap-2 overflow-auto overscroll-contain md:order-1 md:w-1/5 md:flex-col">
          {imageList.map((image) => (
            <Image
              preview={false}
              key={image.id}
              src={image.src}
              alt="product"
              className={`aspect-square w-full cursor-pointer object-contain transition-all duration-300 ${
                currentImage.id === image.id ||
                (nextImage && nextImage.id === image.id)
                  ? "border-secondary-medium border-2"
                  : "border-2 border-transparent"
              }`}
              onClick={() => handleImageClick(image)}
              placeholder={
                <Image
                  preview={false}
                  src={`https://placehold.co/124x124?text=Loading`}
                />
              }
              onError={(e) => {
                e.target.width = 124;
                e.target.height = 124;
                e.target.src = "https://placehold.co/124x124?text=Not found";
              }}
            />
          ))}
        </div>
        <div className="order-1 md:order-2 md:w-4/5">
          <Image.PreviewGroup
            items={IMAGE_LIST.map((image) => ({
              src: image.src,
            }))}
          >
            <Image
              src={currentImage.src}
              className={`aspect-square w-full object-contain transition-opacity duration-300 ${
                isChanging ? "opacity-0" : "opacity-100"
              }`}
              alt="product"
              placeholder={
                <Image
                  preview={false}
                  src={`https://placehold.co/499x499?text=Loading`}
                />
              }
              onError={(e) => {
                e.target.width = 499;
                e.target.height = 499;
                e.target.src = "https://placehold.co/499x499?text=Not found";
              }}
            />
          </Image.PreviewGroup>
        </div>
      </div>
    </div>
  );
};

ProductImageGallery.propTypes = {
  images: PropTypes.array,
};

export default ProductImageGallery;
