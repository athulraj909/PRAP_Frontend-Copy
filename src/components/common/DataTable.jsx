import "./DataTable.css";

function DataTable({
    columns = [],
    data = [],
    emptyMessage = "No records found.",
}) {

    return (

        <div className="table-container">

            <table className="data-table">

                <thead>

                    <tr>

                        {
                            columns.map((column) => (

                                <th key={column.key}>
                                    {
                                        column.headerRender
                                            ? column.headerRender()
                                            : column.title
                                    }
                                </th>

                            ))
                        }

                    </tr>

                </thead>

                <tbody>

                    {
                        data.length === 0 ? (

                            <tr>

                                <td colSpan={columns.length}>
                                    {emptyMessage}
                                </td>

                            </tr>

                        ) : (

                            data.map((row, index) => (

                                <tr key={row.id || index}>

                                    {
                                        columns.map((column) => (

                                            <td key={column.key}>

                                                {
                                                    column.render
                                                        ? column.render(row, index)
                                                        : row[column.key]
                                                }

                                            </td>

                                        ))
                                    }

                                </tr>

                            ))

                        )
                    }

                </tbody>

            </table>

        </div>

    );

}

export default DataTable;