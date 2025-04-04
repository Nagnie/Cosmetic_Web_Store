import PropTypes from "prop-types";

const PaymentSelectCard = ({ method, selected, onSelect }) => {
    return (
        <div
            className={`mb-3 flex cursor-pointer rounded-lg border p-4 transition-all ${
                selected
                    ? "border-primary bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(method.id)}
        >
            <div className="mr-3 flex-shrink-0">
                <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="paymentSelect"
                    checked={selected}
                    onChange={() => onSelect(method.id)}
                    className="text-primary focus:ring-primary h-5 w-5"
                />
            </div>

            <div className="flex-grow">
                <label htmlFor={`payment-${method.id}`} className="cursor-pointer">
                    <div className="font-medium text-gray-800">{method.name}</div>
                    <div className="mt-1 text-sm text-gray-500">{method.description}</div>
                </label>
            </div>
        </div>
    );
};

PaymentSelectCard.propTypes = {
    method: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    selected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default PaymentSelectCard;
