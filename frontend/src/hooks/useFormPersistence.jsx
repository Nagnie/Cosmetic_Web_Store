import { useEffect } from "react";

// Custom hook cho việc lưu và khôi phục form data
// Dùng localStorage để lưu form data
const useFormPersistence = (form, formName) => {
  useEffect(() => {
    const savedData = localStorage.getItem(formName);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.setFieldsValue(parsedData);
    }
  }, [form, formName]);

  const saveFormData = (values) => {
    localStorage.setItem(formName, JSON.stringify(values));
  };

  return { saveFormData };
};

export default useFormPersistence;
