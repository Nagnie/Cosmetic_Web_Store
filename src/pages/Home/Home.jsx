import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const SlideData = [
    {
        title: 'Slide 1',
        description: 'Description 1',
        image: 'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/7163984838025058368.jpg'
    },
    {
        title: 'Slide 2',
        description: 'Description 2',
        image: 'https://image.oliveyoung.co.kr/cfimages/contents/planshop/image/202502041113525796.jpg'
    },
    {
        title: 'Slide 3',
        description: 'Description 3',
        image: 'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/4295970989401172279.jpg'
    },
    {
        title: 'Slide 4',
        description: 'Description 4',
        image: 'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/576807548360671.jpg'
    },
    {
        title: 'Slide 5',
        description: 'Description 5',
        image: 'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/8878704506545864568.jpg'
    },
]

const categories = [
    { title: "Skin Care", image: "https://i.pinimg.com/736x/5a/68/6a/5a686a397fa14181d2447358edb61f0c.jpg" },
    { title: "Body Care", image: "https://i.pinimg.com/736x/fe/bb/84/febb8481081d9a24c006755006cbf685.jpg" },
    { title: "Hair Care", image: "https://i.pinimg.com/736x/a7/c5/46/a7c546b9ab26144432224f6a893f070a.jpg" },
    { title: "Dietary Supplement", image: "https://i.pinimg.com/736x/cb/e7/15/cbe715429af3258e0a0764f90cfaed16.jpg" },
    { title: "Make Up", image: "https://i.pinimg.com/736x/ce/c7/6b/cec76bb3adc9922446ac684056124610.jpg" },
];

const Trending = [
    {
        name: 'Medicube PDRN Pink Peptide Ampoule 30ml',
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
]

const CategoryCard = ({ category }) => {
    return (
        <div className="relative w-full h-66 rounded-lg overflow-hidden shadow-lg">
            {/* Hình ảnh */}
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />

            {/* Overlay mờ và text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-semibold">{category.title}</h3>
            </div>
        </div>
    );
};

const ProductCard = ({ product }) => {
    return (
        <div className="w-full h-100 bg-red-50 flex flex-col justify-between p-4 rounded-lg">
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded" />
            <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{product.price} VNĐ</span>
                <button className="text-white  px-4 py-2 rounded-lg">Add to cart</button>
            </div>
        </div>
    )
}

const Homepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="font-sans">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

            {/* Swiper Section */}
            <section className={"mt-20 mb-10 pt-10"}>
                <style>
                    {`
                      .swiper-pagination-bullet {
                        opacity: 0.8;
                        width: 15px;
                        height: 15px;
                        background-color: #FFCFB3;
                      }
                      .swiper-pagination-bullet-active {
                        opacity: 1;
                        background-color: #FA4032;
                      }
                      .swiper {
                        padding-bottom: 40px !important;
                      }
                      .swiper-pagination {
                        bottom: 10px !important;
                      }
                    `}
                </style>
                {/* Static Overlay */}
                <div className="absolute top-30 left-29 right-29 h-96 bg-red-950 opacity-30 z-10 rounded-3xl" />
                <div className="absolute top-30 left-29 right-29 h-96 flex items-center justify-center z-20">
                    <div className="text-white text-center">
                        <h1 className="text-5xl mb-2 font-bold">Welcome to Nâu Cosmetic</h1>
                        <p className="text-2xl">Your destination for all things beauty</p>
                    </div>
                </div>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 10000, // 10 seconds
                        disableOnInteraction: false,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="w-full h-106 rounded-3xl"
                >
                    {SlideData.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover rounded-3xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Category Section */}
            <section className="max-w-6xl mx-auto py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black">Shop by Category</h2>
                    <a
                        href="#"
                        className="text-red-700 hover:underline text-sm font-medium"
                    >
                        Browse all categories →
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((category, index) => (
                        <CategoryCard key={index} category={category} />
                    ))}
                </div>
            </section>

            {/*Why choose us section*/}
            <section className="py-10 px-10 mt-10">
                <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                        <p className="text-gray-600">We carefully select the finest materials and craftmanship to ensure exceptional quality in every product.</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                        <p className="text-gray-600">Your satisfaction is our priority. Enjoy responsive support and hassle-free shopping experience.</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-3">Unique Designs</h3>
                        <p className="text-gray-600">Discover our exclusive collections that blend contemporary trends with timeless elegance.</p>
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            <div className="py-10 px-10">
                <h2 className="text-3xl font-semibold text-center">Best Sellers</h2>
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {Trending.map((_, index) => (
                        <ProductCard key={index} product={Trending[index]} />
                    ))}
                </div>
                <button className="block mx-auto my-10 text-white bg-blue-600 px-4 py-2 rounded-lg">View all products</button>
            </div>


        </div>
    );
};

export default Homepage;
