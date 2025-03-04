import  { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';

const ProductListingPage = () => {
    // State để lưu trạng thái hiển thị filter trên mobile
    const [showFilter, setShowFilter] = useState(false);
    // State cho danh sách sản phẩm
    const [products, setProducts] = useState([]);
    // State cho bộ lọc
    const [filters, setFilters] = useState({
        category: 'all',
        priceRange: 'all',
        sortBy: 'newest'
    });

    // Dữ liệu sản phẩm mẫu
    useEffect(() => {
        // Trong thực tế, bạn sẽ gọi API ở đây
        const dummyProducts = [
            {
                name: 'Medicube PDRN red Peptide Ampoule 30ml',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021429010ko.jpg?l=ko',
                price: '600.000'
            },
            {
                name: 'UNOVE Deep Damage Treament Ex',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A00000017142381ko.jpg?l=ko',
                price: '800.000'
            },
            {
                name: 'Ma:nyo Pure Cleansing Oil 200ml',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020744412ko.jpg?l=ko',
                price: '650.000'
            },
            {
                name: 'Flow lifting wrapping cream KOY 50ml',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021463307ko.jpg?l=ko',
                price: '1.200.000'
            },
            {
                name: "d'Alba Waterfull Tone-up Sun Cream SPF 50+ 50ml",
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018023767ko.jpg?l=ko',
                price: '900.000'
            },
            {
                name: 'Dear Dahlia Blooming Edition Petal Drop Liquid Blush 4g',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020514525ko.jpg?l=ko',
                price: '500.000'
            },
            {
                name: 'Mamonde Rose + PHA Liquid Mask 80ml',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021753007ko.jpg?l=ko',
                price: '750.000'
            },
            {
                name: 'MEDIHEAL N.M.F Intensive Hydrating Toner Pad 90ml',
                image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A000000171427112ko.png?l=ko',
                price: '550.000'
            }
        ];

        setProducts(dummyProducts);
    }, []);

    // Hàm xử lý khi thay đổi bộ lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Lọc và sắp xếp sản phẩm dựa trên bộ lọc
    const filteredProducts = products.filter(product => {
        // Lọc theo danh mục
        if (filters.category !== 'all' && product.category !== filters.category) {
            return false;
        }

        // Lọc theo khoảng giá
        if (filters.priceRange !== 'all') {
            const price = parseInt(product.price.replace(/\./g, ''));
            if (filters.priceRange === 'under300' && price >= 300000) {
                return false;
            } else if (filters.priceRange === '300to700' && (price < 300000 || price > 700000)) {
                return false;
            } else if (filters.priceRange === 'over700' && price <= 700000) {
                return false;
            }
        }

        return true;
    }).sort((a, b) => {
        // Sắp xếp theo bộ lọc
        if (filters.sortBy === 'priceLow') {
            return parseInt(a.price.replace(/\./g, '')) - parseInt(b.price.replace(/\./g, ''));
        } else if (filters.sortBy === 'priceHigh') {
            return parseInt(b.price.replace(/\./g, '')) - parseInt(a.price.replace(/\./g, ''));
        }
        // Mặc định sắp xếp theo mới nhất (theo id trong ví dụ này)
        return b.id - a.id;
    });

    // Toggle hiển thị filter trên mobile
    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    return (
        <div className="container mx-auto py-8 mt-40 mb-20">
            <h1 className="text-3xl font-bold mb-15 text-center" style={{ color: "#911f3f"}}>Danh Sách Sản Phẩm</h1>

            {/* Button hiển thị filter chỉ hiện trên mobile */}
            <button
                className="lg:hidden w-full bg-pink-100 text-pink-800 font-semibold py-2 px-4 rounded-lg mb-4"
                onClick={toggleFilter}
            >
                {showFilter ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
            </button>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cột filter - ẩn trên mobile trừ khi được toggle */}
                <div className={`lg:w-1/4 ${showFilter ? 'block' : 'hidden'} lg:block bg-pink-50 p-4 rounded-lg h-fit`}>
                    <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Danh mục</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="clothing">Quần áo</option>
                            <option value="shoes">Giày dép</option>
                            <option value="accessories">Phụ kiện</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Khoảng giá</label>
                        <select
                            name="priceRange"
                            value={filters.priceRange}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="under300">Dưới 300.000 VNĐ</option>
                            <option value="300to700">300.000 - 700.000 VNĐ</option>
                            <option value="over700">Trên 700.000 VNĐ</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Sắp xếp theo</label>
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="priceLow">Giá thấp đến cao</option>
                            <option value="priceHigh">Giá cao đến thấp</option>
                        </select>
                    </div>
                </div>

                {/* Cột danh sách sản phẩm */}
                <div className="lg:w-3/4">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;