import "./Modal.css";

function Modal({
    isOpen,
    title,
    children,
    onClose,
    scrollable = false,
}) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h3>{title}</h3>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className={`modal-body ${scrollable ? "modal-body-scrollable" : ""}`}>

                    {children}

                </div>

            </div>

        </div>

    );

}

export default Modal;