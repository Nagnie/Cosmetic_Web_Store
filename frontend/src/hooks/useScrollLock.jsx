import { useEffect } from "react";

/**
 * Custom hook để khóa cuộn body khi cần thiết
 * @param {boolean} lock - trạng thái khóa cuộn
 */
export const useScrollLock = (lock) => {
  useEffect(() => {
    if (lock) {
      // Lưu vị trí cuộn hiện tại
      const scrollY = window.scrollY;

      // Thêm style để ngăn cuộn trên body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Lấy vị trí cuộn từ thuộc tính top của body
      const scrollY = document.body.style.top;

      // Đặt lại các style của body
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Khôi phục vị trí cuộn khi đóng bottom sheet
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    // Hàm clean up để đảm bảo reset style khi component unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [lock]);
};

// Cách sử dụng:
// import { useScrollLock } from './hooks/useScrollLock';
//
// const Component = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   useScrollLock(isModalOpen);
//   ...
// }
