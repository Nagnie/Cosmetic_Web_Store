import { Skeleton, Tag } from "antd";
import PropTypes from "prop-types";

const ProductDetailSkeleton = ({ isShowBottomSheet = false }) => {
  return (
    <div className="text-left">
      {/* Title skeleton */}
      <div className="text-primary-dark text-left text-xl font-bold md:text-2xl">
        <Skeleton.Input active style={{ width: "100%", height: 30 }} />
      </div>

      {/* Tags skeleton */}
      <div className="mt-2">
        <Tag
          bordered={false}
          className="mr-2 !rounded-full"
          color="magenta"
          style={{ backgroundColor: "#f5f5f5", border: "none" }}
        >
          <Skeleton.Button active size="small" style={{ width: 80 }} />
        </Tag>
        <Tag
          bordered={false}
          className="mr-2 !rounded-full"
          color="blue"
          style={{ backgroundColor: "#f5f5f5", border: "none" }}
        >
          <Skeleton.Button active size="small" style={{ width: 80 }} />
        </Tag>
        <Tag
          bordered={false}
          className="!rounded-full"
          color="green"
          style={{ backgroundColor: "#f5f5f5", border: "none" }}
        >
          <Skeleton.Button active size="small" style={{ width: 80 }} />
        </Tag>
      </div>

      {/* Price skeleton */}
      <div className="!mt-4">
        <Tag
          bordered={false}
          className="!flex w-full !items-center !rounded-full !p-2 !px-4"
          color="red"
          style={{ backgroundColor: "#f5f5f5", border: "none" }}
        >
          <Skeleton.Button active size="large" style={{ width: 120 }} />
        </Tag>
      </div>

      {/* Classification skeleton */}
      <div className="!mt-4">
        <Skeleton.Input active style={{ width: 100, height: 24 }} />

        <div className="!mt-2 !flex !flex-wrap text-sm">
          {[1, 2, 3].map((item) => (
            <Tag
              key={item}
              className="!border-primary-dark !mx-1 !my-1 !flex !h-[35px] !w-fit !items-center !justify-between bg-white !px-4"
              style={{ backgroundColor: "#f5f5f5", border: "none" }}
            >
              <Skeleton.Button active size="small" style={{ width: 60 }} />
            </Tag>
          ))}
        </div>
      </div>

      {/* Quantity and buttons skeleton */}
      <div className={`!mt-10 ${isShowBottomSheet ? "" : "hidden md:block"}`}>
        <div className="flex items-center space-x-4">
          <Skeleton.Input active style={{ width: 100, height: 24 }} />
          <Skeleton.Button active size="large" style={{ width: 120 }} />
        </div>

        <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
          <Skeleton.Button
            active
            size="large"
            style={{ width: "100%", height: 40 }}
          />
          <Skeleton.Button
            active
            size="large"
            style={{ width: "100%", height: 40 }}
          />
        </div>
      </div>
    </div>
  );
};

ProductDetailSkeleton.propTypes = {
  isShowBottomSheet: PropTypes.bool,
};

export default ProductDetailSkeleton;
