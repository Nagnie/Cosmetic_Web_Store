import { ConfigProvider, Spin } from "antd";
import PropTypes from "prop-types";

const CustomSpin = ({
  size = "default",
  tip,
  fullScreen = false,
  ...props
}) => {
  const themeColors = {
    primary: "#91775E",
    primaryDark: "#675746",
    primaryDeepest: "#574A3A",
    secondary: "#F1DEC9",
    secondaryDeep: "#91775E",
  };

  // Component chính
  const spinComponent = (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary,
        },
      }}
    >
      <Spin size={size} tip={tip} {...props} />
    </ConfigProvider>
  );

  if (fullScreen) {
    return (
      <div className="bg-opacity-60 bg-background absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center">
          {spinComponent}
          {tip && <p className="text-primary-dark mt-2 font-medium">{tip}</p>}
        </div>
      </div>
    );
  }

  return spinComponent;
};

CustomSpin.propTypes = {
  size: PropTypes.oneOf(["small", "default", "large"]),
  tip: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default CustomSpin;
