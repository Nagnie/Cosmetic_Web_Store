import { useMemo } from "react";
import PropTypes from "prop-types";

const ResultSummary = ({ isLoading, totalItems, searchParam }) => {
  // Xây dựng text kết quả tìm kiếm
  const resultText = useMemo(() => {
    if (!searchParam) return null;
    return <p>Kết quả tìm kiếm cho từ khóa &quot;{searchParam}&quot;.</p>;
  }, [searchParam]);

  if (isLoading) return null;

  return (
    <>
      <div className="mb-8 text-center text-gray-600">
        <p>
          Có{" "}
          <span className="font-semibold text-gray-800">
            {totalItems} sản phẩm
          </span>{" "}
          cho tìm kiếm
        </p>
        <div className="mx-auto mt-4 w-20 border-4 border-b border-gray-300"></div>
      </div>

      {resultText && (
        <div className="mb-4 text-left text-gray-600">{resultText}</div>
      )}
    </>
  );
};

ResultSummary.propTypes = {
  isLoading: PropTypes.bool,
  totalItems: PropTypes.number,
  searchParam: PropTypes.string,
};

export default ResultSummary;
