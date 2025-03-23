import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";

const ComboProductCard = ({ combo }) => {
    const navigate = useNavigate();

    // Format price with dots as thousand separators and add VNĐ
    const formatPrice = (price) => {
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
    };

    // If no combo is provided, return null
    if (!combo) return null;

    // Extract the first image or use a placeholder
    const mainImage = combo.images && combo.images.length > 0
        ? combo.images[0]
        : "https://placehold.co/400x400/png?text=No+Image";

    return (
        <div className="bg-white max-w-98 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
                <img
                    src={mainImage}
                    alt={combo.name}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                        e.target.src = "https://placehold.co/400x400/png?text=Image+Error";
                    }}
                />
                {combo.origin_price && (
                    <div className="absolute top-0 right-0 bg-primary line-through text-sm text-white px-4 py-2 m-3 rounded-full">
                        {formatPrice(combo.origin_price)}
                    </div>
                )}
                <div className="absolute top-12 right-0 bg-primary-deepest text-white px-4 py-2 m-3 rounded-full">
                    {formatPrice(combo.price)}
                </div>
            </div>
            <div className="p-6">
                <Link
                    to={`/combo/${combo.name}/${combo.id_combo}`}
                    className="text-2xl font-bold text-primary-dark mb-2 block">
                    {combo.name}
                </Link>
                <p className="text-gray-600 mb-4">{combo.description}</p>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-primary-deepest mb-3">Sản phẩm trong combo:</h3>
                    {combo.products && combo.products.length > 0 ? (
                        <ul className="space-y-2">
                            {combo.products.map((product) => (
                                <li key={product.id_pro} className="flex justify-between">
                                    <Link
                                        to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
                                        className="text-primary-dark hover:text-orange-800 hover:underline">
                                        {product.pro_name}
                                    </Link>
                                    <span className="text-gray-600">{formatPrice(product.pro_price)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Không có sản phẩm trong combo này</p>
                    )}

                    <div className="mt-6 text-center flex justify-center">
                        <button className="bg-primary flex items-center hover:bg-primary-medium text-white font-bold py-2 px-6 rounded-full transition duration-300 mx-2">
                            <FaShoppingBag size={18} />
                            <span className={"mx-2"}>Mua ngay</span>
                        </button>
                        <button className="bg-primary-light hover:bg-primary-light text-white font-bold py-2 px-6 rounded-full transition duration-300">
                            <BsCartPlus size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboProductCard;