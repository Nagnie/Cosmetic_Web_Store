import { create } from "zustand";

const useModalStore = create((set) => ({
  isVisible: false,
  modalProps: {},
  modalContent: null,

  showModal: (content, props = {}) =>
    set({
      isVisible: true,
      modalContent: content,
      modalProps: props,
    }),

  hideModal: () =>
    set({
      isVisible: false,
      modalContent: null,
    }),

  updateModalProps: (props) =>
    set((state) => ({
      modalProps: { ...state.modalProps, ...props },
    })),
}));

export default useModalStore;
