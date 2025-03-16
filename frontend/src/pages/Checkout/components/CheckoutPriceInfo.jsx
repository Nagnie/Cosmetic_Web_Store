import { useCartStore } from "@components/Cart";
import { CustomCollapse } from ".";
import { formatCurrency } from "@utils/utils";

const CheckoutPriceInfo = () => {
  const totalCartPrice = useCartStore((state) => state.totalPrice);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div>
        {/* List CheckoutCard */}

        <CustomCollapse />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Tạm tính</span>
          <span className="text-sm font-semibold">
            {formatCurrency({ number: +totalCartPrice || 0 })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Phí vận chuyển</span>
          <span className="text-sm font-semibold">0đ</span>
        </div>
      </div>

      {/* horizontal separate */}
      <div className="my-4 border-t border-gray-200"></div>

      <div className="text-secondary-deep flex items-center justify-between text-xl font-semibold">
        <span>Tổng cộng</span>
        <span>{formatCurrency({ number: +totalCartPrice || 0 })}</span>
      </div>
    </div>
  );
};
export default CheckoutPriceInfo;
