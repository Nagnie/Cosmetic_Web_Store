import {useNavigate} from "react-router-dom";

const BrandCard = ({ brand }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/all_products?brand=${brand.name}`);
    };

    return (
        <div
            className="relative mb-4 h-66 w-55 overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            onClick={handleClick}
        >
            {/* Image */}
            <img
                src={brand.image}
                alt={brand.name}
                className="h-full w-full object-cover"
            />

            {/* Gradient overlay and text */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-orange-950/50 to-transparent p-3 sm:p-4 md:p-5 lg:p-6">
                <h3 className="text-lg font-semibold text-white hover:underline sm:text-xl md:text-2xl">
                    {brand.name}
                </h3>
                <p className="mt-1 text-sm text-white">
                    {brand.numProducts} sản phẩm
                </p>
            </div>
        </div>
    );
};

export default BrandCard;