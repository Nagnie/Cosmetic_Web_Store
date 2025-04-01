import PropTypes from "prop-types";

const PaymentMethodCard = ({ method, selected, onSelect }) => {
  // Tách icon đầu tiên và các icon còn lại (nếu có)
  const mainIcon = method.icons[0];
  const secondaryIcons = method.icons.slice(1);

  return (
    <div
      className={`mb-3 flex cursor-pointer rounded-lg border p-4 transition-all ${
        selected
          ? "border-primary bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(method.id)}
    >
      <div className="mr-3 flex-shrink-0">
        <input
          type="radio"
          id={`payment-${method.id}`}
          name="paymentMethod"
          checked={selected}
          onChange={() => onSelect(method.id)}
          className="text-primary focus:ring-primary h-5 w-5"
        />
      </div>

      <div className="flex-grow">
        <label htmlFor={`payment-${method.id}`} className="cursor-pointer">
          <div className="font-medium text-gray-800">{method.name}</div>
          <div className="mt-1 text-sm text-gray-500">{method.description}</div>

          {/* Hiển thị các icon thứ 2 trở đi (nếu có) */}
          {secondaryIcons.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {secondaryIcons.map((icon, index) => (
                <img
                  key={index}
                  src={icon}
                  alt={`${method.name} secondary icon`}
                  className="h-6 object-contain"
                />
              ))}
            </div>
          )}
        </label>
      </div>

      {/* Hiển thị icon chính */}
      <div className="ml-2 flex-shrink-0">
        <img
          src={mainIcon}
          alt={`${method.name} main icon`}
          className="h-10 w-10 object-contain"
        />
      </div>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icons: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PaymentMethodCard;
