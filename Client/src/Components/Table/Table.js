import React, {useState} from 'react';
import './Table.css';
import EndPoint from '../../Utils/Endpoint';
import { useAuth } from '../../Context/AuthContext';

const Table = ({data, headers, FormToOpen, refreshFunction}) => {
    const {alertMessage} = useAuth();

    const [openForm, setOpenForm] = useState(false)
    const [dataSource, setDataSource] = useState(data);
    const [activeId, setActiveId] = useState(0);
    const [headersSource, setHeadersSource] = useState(headers);
    const [saveFunction, setSaveFunction] = useState(() => {});
    const [deleteFunction, setDeleteFunction] = useState(() => {});

    const handleSave = () => {
        if (typeof saveFunction === "function") {
            saveFunction(activeId);  
        } else {
            alertMessage("No save function defined");
        }
    };

    const handleDelete = () => {
        if (typeof deleteFunction === "function") {
            deleteFunction(activeId);  
        } else {
            alertMessage("No delete function defined");
        }
    };

    const handleExit = async () => {
        setOpenForm(false);
        setActiveId(0);
        await refreshFunction();
    }

    return (
        <div className='edit-table'>
            <table>
                <thead>
                    <tr>
                        <th className='edit-table-command-icon'>
                            <EndPoint.Components.SIcon src={EndPoint.Icons.addIcon} onClick={
                                () => {
                                    setOpenForm(!openForm)
                                }
                            }/>
                        </th>
                        {Object.keys(headersSource).map((field) => (
                            <th key={field}>{headersSource[field]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                     {dataSource.map((dataUnit) => (
                        <tr key={dataUnit.id}>
                            <td className='edit-table-command-icon'>
                                <EndPoint.Components.SIcon src={EndPoint.Icons.editIcon} onClick={
                                    () => {
                                        setActiveId(dataUnit.id)
                                        setOpenForm(!openForm)
                                    }
                                }/>
                            </td>
                            {Object.keys(headersSource).map((field) => (
                                <td key={field}>{dataUnit[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        { 
            openForm &&
            <div>
                <div className='tableedit-form-background'></div>
                <div className='tableedit-form'>
                    <div className='tableedit-form-header'>
                        <EndPoint.Components.SIcon src={EndPoint.Icons.exitIcon} onClick={handleExit}/>
                    </div>
                    <div className='tableedit-form-content'>
                        {FormToOpen && React.cloneElement(FormToOpen, { id: activeId, setSaveFunction,setDeleteFunction, setActiveId,setOpenForm, refreshFunction })}
                    </div>
                    {(saveFunction || deleteFunction) && activeId &&
                        <div className='tableedit-form-footer'>
                            {saveFunction && 
                            <EndPoint.Components.SButton onClick={handleSave} className={"saveButtonTable"}>
                                    Save
                            </EndPoint.Components.SButton>
                            }
                            {deleteFunction &&
                            <EndPoint.Components.SButton onClick={handleDelete} className={"deleteButtonTable"}>
                                    Delete
                            </EndPoint.Components.SButton>
                            }
                        </div>
                    }    
                </div>
            </div>
        }
    </div>
    );
};

export default Table;
