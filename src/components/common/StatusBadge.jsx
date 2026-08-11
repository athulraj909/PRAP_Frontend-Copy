import "./StatusBadge.css";

function StatusBadge({ status }) {

    const normalizedStatus = status?.toLowerCase();

    return (

        <span
            className={`status-badge ${normalizedStatus}`}
        >
            {status}
        </span>

    );

}

export default StatusBadge;