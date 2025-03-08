import { CheckoutCustomerInfo, CheckoutPriceInfo } from "./components";

const CheckoutPage = () => {
  return (
    <div className="mx-auto mt-35 mb-4 pt-10 lg:px-4">
      <div className="grid grid-cols-1 gap-2 text-left lg:grid-cols-2 lg:gap-8">
        {/* Left */}
        <div className="order-2 lg:order-1">
          <CheckoutCustomerInfo />
        </div>
        {/* Right */}
        <div className="order-1 lg:order-2">
          <CheckoutPriceInfo />
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
