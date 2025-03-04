import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

const categories = [
    { title: "Anua", image: "https://i.pinimg.com/736x/5a/68/6a/5a686a397fa14181d2447358edb61f0c.jpg" },
    { title: "Medicube", image: "https://i.pinimg.com/736x/fe/bb/84/febb8481081d9a24c006755006cbf685.jpg" },
    { title: "Bioderma", image: "https://i.pinimg.com/736x/a6/36/84/a6368491d6c77e54f488e0c050e28d22.jpg" },
    { title: "Torriden", image: "https://i.pinimg.com/736x/cb/e7/15/cbe715429af3258e0a0764f90cfaed16.jpg" },
    { title: "Aestura", image: "https://i.pinimg.com/736x/ce/c7/6b/cec76bb3adc9922446ac684056124610.jpg" },
];

const Trending = [
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
]

const CategoryCard = ({ category }) => {
    return (
        <div className="relative w-55 h-66 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 mb-4">
            {/* Image */}
            <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
            />

            {/* Gradient overlay and text */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/50 to-transparent flex flex-col justify-end p-3 sm:p-4 md:p-5 lg:p-6">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold hover:underline">
                    {category.title}
                </h3>
            </div>
        </div>
    );
};

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className="font-sans">
            <Header />

            {/* Swiper Section */}
            <section className={"max-w-6xl mt-35 mx-auto mb-20 pt-10"}>
                <div className="text-center my-5" style={{ color: "#911f3f" }}>
                    <h1 className="text-5xl mb-2 font-bold">Welcome to Nâu Cosmetic</h1>
                    <p className="text-2xl">Your destination for all things beauty</p>
                </div>
                <style>
                    {`
                      .swiper-pagination-bullet {
                        opacity: 0.5;
                        width: 15px;
                        height: 15px;
                        background-color: #D14D72;
                      }
                      .swiper-pagination-bullet-active {
                        opacity: 1;
                        background-color: #D14D72;
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

                <div className="absolute top-60 left-29 right-29 h-96 flex items-center justify-center z-20">
                </div>
                {/*<Swiper*/}
                {/*    pagination={{*/}
                {/*        dynamicBullets: true,*/}
                {/*        clickable: true,*/}
                {/*    }}*/}
                {/*    autoplay={{*/}
                {/*        delay: 10000, // 10 seconds*/}
                {/*        disableOnInteraction: false,*/}
                {/*    }}*/}
                {/*    modules={[Pagination, Autoplay]}*/}
                {/*    className="h-106 rounded-3xl"*/}
                {/*>*/}
                {/*    {SlideData.map((slide, index) => (*/}
                {/*        <SwiperSlide key={index}>*/}
                {/*            <img*/}
                {/*                src={slide.image}*/}
                {/*                alt={slide.title}*/}
                {/*                className="w-full h-full object-cover rounded-3xl"*/}
                {/*            />*/}
                {/*            <div className="absolute top-0 left-0 right-0 h-96 opacity-20 z-10 rounded-3xl" style={{ backgroundColor: "#D14D72"}}/>*/}
                {/*        </SwiperSlide>*/}
                {/*    ))}*/}
                {/*</Swiper>*/}
            </section>

            {/* Category Section */}
            <section className="mx-auto py-3">
                <div className="flex justify-between items-center mx-10 mb-6">
                    <h2 className="text-3xl font-semibold text-black">Trending Brand</h2>
                    <button
                        href="#"
                        className="hover:underline text-sm font-medium"
                        style={{ color: "#D14D72" }}
                    >
                        Browse all brands →
                    </button>
                </div>
                <div className="flex flex-wrap gap-6 justify-center cursor-pointer">
                    {categories.map((category, index) => (
                        <CategoryCard key={index} category={category} />
                    ))}
                </div>
            </section>

            {/*Why choose us section*/}
            <section className="py-10 px-10 mt-10">
                <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="text-center  p-7 rounded-2xl shadow-xl" style={{ backgroundColor: '#FDE5EC' }}>
                        <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                        <p className="text-gray-600">We carefully select the finest materials and craftmanship to ensure exceptional quality in every product.</p>
                    </div>

                    <div className="text-center  p-7 rounded-2xl shadow-xl" style={{ backgroundColor: '#FFD1DA' }}>
                        <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                        <p className="text-gray-600">Your satisfaction is our priority. Enjoy responsive support and hassle-free shopping experience.</p>
                    </div>

                    <div className="text-center p-7 rounded-2xl shadow-xl" style={{ backgroundColor: '#ffbccc' }}>
                        <h3 className="text-xl font-semibold mb-3">Unique Designs</h3>
                        <p className="text-gray-600">Discover our exclusive collections that blend contemporary trends with timeless elegance.</p>
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            <div className="py-10 px-10">
                <h2 className="text-3xl font-semibold text-center">Best Sellers</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {Trending.map((_, index) => (
                        <ProductCard key={index} product={Trending[index]} />
                    ))}
                </div>
                <button className="block mx-auto my-10 text-white rounded-lg px-4 py-2"
                        style={{ backgroundColor: "#ab3556" }}
                        onClick={() => navigate("/all_products")}>
                    View all products
                </button>
            </div>


        </div>
    );
};

export default Homepage;
