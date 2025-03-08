import { CheckoutCustomerInfo } from "./components";

const CheckoutPage = () => {
  return (
    <div className="mx-auto mt-35 mb-4 pt-10 lg:px-4">
      <div className="grid grid-cols-1 gap-1 text-left lg:grid-cols-2 lg:gap-8">
        {/* Left */}
        <CheckoutCustomerInfo />
        {/* Right */}
        <div></div>
      </div>
    </div>
  );
};
export default CheckoutPage;
