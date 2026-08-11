import "./Input.css";

function Input({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    disabled = false,
    required = false,
}) {
    return (
        <div className="input-group">

            {label && (
                <label>{label}</label>
            )}

            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />

        </div>
    );
}

export default Input;