// src/components/common/InputField.jsx

function InputField({ type = "text", placeholder, onChange, error }) {
  // 👈 Added 'error' prop
  const style = {
    width: "100%",
    padding: "12px 15px",
    margin: "8px 0 2px 0", // Reduced bottom margin to fit error text
    borderRadius: "8px",
    border: error ? "1px solid #ff4d4d" : "1px solid #444", // 🔴 Red border if error
    backgroundColor: "#1a1a1a",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {" "}
      {/* Wrapper for spacing */}
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        style={style}
        onFocus={(e) => !error && (e.target.style.borderColor = "#646cff")}
        onBlur={(e) => !error && (e.target.style.borderColor = "#444")}
      />
      {/* 🔴 Only show this text if there is an error */}
      {error && (
        <div
          style={{
            color: "#ff4d4d",
            fontSize: "0.85rem",
            textAlign: "left",
            paddingLeft: "5px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default InputField;
