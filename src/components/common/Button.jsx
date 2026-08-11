import "./Button.css";

function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    className = "",
    onClick,
}) {

    return (

        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`btn btn-${variant} btn-${size} ${className}`}
        >

            {loading ? "Loading..." : children}

        </button>

    );

}

export default Button;