import Button from "./Button";
import Modal from "./Modal";

function ConfirmDialog({
    isOpen,
    title = "Confirm Delete",
    message = "Are you sure you want to continue?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) {

    return (

        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onCancel}
        >

            <p>{message}</p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px",
                }}
            >

                <Button
                    type="button"
                    onClick={onCancel}
                >
                    {cancelText}
                </Button>

                <Button
                    type="button"
                    onClick={onConfirm}
                >
                    {confirmText}
                </Button>

            </div>

        </Modal>

    );

}

export default ConfirmDialog;