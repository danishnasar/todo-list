import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function TodoCompo({ item, guid, remove, edit }) {
    return (
        <>
            <tr>
                <td style={{minWidth: "60vw", maxWidth: "60vw", wordWrap: "break-word"}}>{item}</td>
                <td><button type="button" className="btn btn-warning" onClick={() => edit(guid)}>Edit</button></td>
                <td><button type="button" className="btn btn-danger" onClick={() => remove(guid)}>Delete</button></td>
            </tr>
        </>
    )
}

export default TodoCompo