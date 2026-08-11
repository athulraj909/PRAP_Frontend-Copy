import Button from "../common/Button";

import "./CrudHeader.css";

function CrudHeader({
    title,
    buttonText = "Add New",
    onAdd,
    children,
    extraButtons,
}) {

    return (

        <div className="crud-header">

            <div className="crud-header-left">

                <h2>{title}</h2>

                {
                    children
                }

            </div>

            <div className="crud-header-right">

                {extraButtons && (
                    <div style={{ display: "flex", gap: "10px", marginRight: "10px" }}>
                        {extraButtons}
                    </div>
                )}

                <Button
                    size="md"
                    onClick={onAdd}
                >
                    {buttonText}
                </Button>

            </div>

        </div>

    );

}

export default CrudHeader;