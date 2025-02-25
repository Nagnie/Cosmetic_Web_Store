import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Header from "../../components/Header/Header.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

const Products = () => {
    return (
        <div className={"mt-50"}>
            <h2>Tất cả sản phẩm</h2>
            <div className={"grid-cols-2"}>
                <div>

                </div>
            </div>
        </div>
    );
};

export default Products;
