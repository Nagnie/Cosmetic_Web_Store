import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
// import { useBrands } from "@hooks/useBrandQueries.js";
import { useProducts } from "@hooks/useProductQueries.js";
import { numberToArray } from "@utils/utils.js";
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";

const categories = [
  {
    title: "Anua",
    image:
      "https://i.pinimg.com/736x/5a/68/6a/5a686a397fa14181d2447358edb61f0c.jpg",
  },
  {
    title: "Medicube",
    image:
      "https://i.pinimg.com/736x/fe/bb/84/febb8481081d9a24c006755006cbf685.jpg",
  },
  {
    title: "Bioderma",
    image:
      "https://i.pinimg.com/736x/a6/36/84/a6368491d6c77e54f488e0c050e28d22.jpg",
  },
  {
    title: "Torriden",
    image:
      "https://i.pinimg.com/736x/cb/e7/15/cbe715429af3258e0a0764f90cfaed16.jpg",
  },
  {
    title: "Aestura",
    image:
      "https://i.pinimg.com/736x/ce/c7/6b/cec76bb3adc9922446ac684056124610.jpg",
  },
];

const Trending = [
  {
    name: "Medicube PDRN red Peptide Ampoule 30ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021429010ko.jpg?l=ko",
    price: "600.000",
  },
  {
    name: "UNOVE Deep Damage Treament Ex",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A00000017142381ko.jpg?l=ko",
    price: "800.000",
  },
  {
    name: "Ma:nyo Pure Cleansing Oil 200ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020744412ko.jpg?l=ko",
    price: "650.000",
  },
  {
    name: "Flow lifting wrapping cream KOY 50ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021463307ko.jpg?l=ko",
    price: "1.200.000",
  },
  {
    name: "d'Alba Waterfull Tone-up Sun Cream SPF 50+ 50ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018023767ko.jpg?l=ko",
    price: "900.000",
  },
  {
    name: "Dear Dahlia Blooming Edition Petal Drop Liquid Blush 4g",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020514525ko.jpg?l=ko",
    price: "500.000",
  },
  {
    name: "Mamonde Rose + PHA Liquid Mask 80ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021753007ko.jpg?l=ko",
    price: "750.000",
  },
  {
    name: "MEDIHEAL N.M.F Intensive Hydrating Toner Pad 90ml",
    image:
      "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A000000171427112ko.png?l=ko",
    price: "550.000",
  },
];

const CategoryCard = ({ category }) => {
  return (
    <div className="relative mb-4 h-66 w-55 overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="h-full w-full object-cover"
      />

      {/* Gradient overlay and text */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-orange-950/50 to-transparent p-3 sm:p-4 md:p-5 lg:p-6">
        <h3 className="text-lg font-semibold text-white hover:underline sm:text-xl md:text-2xl">
          {category.title}
        </h3>
      </div>
    </div>
  );
};

const Homepage = () => {
  const navigate = useNavigate();

  // const brandsQuery = useBrands();

  const productsQuery = useProducts({ page: 1, limit: 10 });

  // const brands = brandsQuery.data;

  const products = productsQuery.data?.data || [];

  // console.log(">>> brands", brands);

  return (
    <div className="font-sans">
      <Header />

      {/* Swiper Section */}
      <section className={"mx-auto mt-40 mb-20 max-w-6xl pt-10"}>
        <div className="my-5 text-center" style={{ color: "#574a3a" }}>
          <h1 className="mb-2 text-5xl font-bold">Welcome to Nâu Cosmetic</h1>
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

        <div className="absolute top-60 right-29 left-29 z-20 flex h-96 items-center justify-center"></div>
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
        <div className="mx-10 mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-black">Trending Brand</h2>
          <button
            href="#"
            className="text-sm font-medium hover:underline"
            style={{ color: "#91775e" }}
          >
            Browse all brands →
          </button>
        </div>
        <div className="flex cursor-pointer flex-wrap justify-center gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </section>

      {/*Why choose us section*/}
      <section className="mt-10 px-10 py-10">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose Us?</h2>

        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="rounded-2xl p-7 text-center shadow-xl"
            style={{ backgroundColor: "#F1DEC9" }}
          >
            <h3 className="mb-3 text-xl font-semibold">Premium Quality</h3>
            <p className="text-gray-600">
              We carefully select the finest materials and craftmanship to
              ensure exceptional quality in every product.
            </p>
          </div>

          <div
            className="rounded-2xl p-7 text-center shadow-xl"
            style={{ backgroundColor: "#C8B6A6" }}
          >
            <h3 className="mb-3 text-xl font-semibold">Customer First</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. Enjoy responsive support and
              hassle-free shopping experience.
            </p>
          </div>

          <div
            className="rounded-2xl p-7 text-center shadow-xl"
            style={{ backgroundColor: "#A4907C" }}
          >
            <h3 className="mb-3 text-xl font-semibold">Unique Designs</h3>
            <p className="text-gray-600">
              Discover our exclusive collections that blend contemporary trends
              with timeless elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <div className="px-10 py-10">
        <h2 className="text-center text-3xl font-semibold">Best Sellers</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productsQuery.isLoading &&
            numberToArray(8).map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          {!productsQuery.isLoading &&
            products.map((product) => (
              <ProductCard key={product.id_pro} product={product} />
            ))}
        </div>
        <button
          className="mx-auto my-10 block rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: "#675746" }}
          onClick={() => navigate("/all_products")}
        >
          View all products
        </button>
      </div>
    </div>
  );
};

export default Homepage;
