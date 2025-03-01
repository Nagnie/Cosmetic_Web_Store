import ProductImageGallery from "./components/ProductImageGallery";

const ProductDetail = () => {
  return (
    <div>
      <div className="mt-35 grid w-full grid-cols-2 gap-4 pt-10">
        <div>
          <ProductImageGallery />
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default ProductDetail;
