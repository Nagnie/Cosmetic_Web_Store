import PropTypes from "prop-types";

const Wrapper = ({ children }) => {
  return (
    <div
      className="w-full rounded-lg bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.12)]"
      style={{
        maxHeight: "min((100vh - 96px) - 60px, 734px)",
        minHeight: "100px",
        padding: "8px 12px 0px 12px",
        overflowY: "auto",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;
