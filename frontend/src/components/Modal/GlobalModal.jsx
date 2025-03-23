import { ConfigProvider, Modal } from "antd";
import { useEffect, useState } from "react";

import useModalStore from "./useModalStore";

const GlobalModal = () => {
  const { isVisible, modalContent, modalProps, hideModal } = useModalStore();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mặc định cho modalProps nếu không được cung cấp
  const defaultProps = {
    title: "Thông báo",
    width: windowWidth < 640 ? "90%" : 520,
    destroyOnClose: true,
    centered: true,
    footer: null,
    styles: {
      header: {
        // backgroundColor: "#FAF5F0",
        // borderBottom: "1px solid #C8B6A6",
      },
      body: {
        padding: 0,
        // backgroundColor: "#FAF5F0",
      },
      mask: {
        backgroundColor: "rgba(145, 119, 94, 0.2)",
      },
      content: {
        borderRadius: "12px",
        overflow: "hidden",
      },
    },
  };

  // Kết hợp defaultProps và modalProps
  const mergedProps = {
    ...defaultProps,
    ...modalProps,
    styles: { ...defaultProps.styles, ...modalProps.styles },
  };

  return (
    <ConfigProvider>
      <Modal open={isVisible} onCancel={hideModal} {...mergedProps}>
        {modalContent}
      </Modal>
    </ConfigProvider>
  );
};

export default GlobalModal;
