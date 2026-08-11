import "./CrudSearch.css";

function CrudSearch({
    value,
    onChange,
    placeholder = "Search...",
}) {

    const handleClear = () => {
        onChange({
            target: {
                value: "",
            },
        });
    };

    return (

        <div className="crud-search">

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

            {
                value && (
                    <button
                        type="button"
                        className="crud-search-clear"
                        onClick={handleClear}
                    >
                        ✕
                    </button>
                )
            }

        </div>

    );

}

export default CrudSearch;