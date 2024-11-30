import React, {useState} from "react";
import './FilterUnit.css'

function FilterUnit ({header, data, setDataId, displayColumn,defaultID = 0, showAll = true}) {
    const [selectedId, setSelectedId] = useState(defaultID);

    return (
        <div className="filter-unit">
            <h4>{header}</h4>
            {
                data && data.length > 0 && (
                    <div className="filter-options">
                        {showAll && <p className={selectedId === 0 ? "active-filter" : ""} onClick={() => {
                            if(setDataId){
                                setDataId(0);
                                setSelectedId(0);
                            }
                        }}>
                            All
                        </p>}
                        {data.map((item, index) => (
                            <p key={index} onClick={() => {
                                    if(setDataId){
                                        setDataId(item.id);
                                        setSelectedId(item.id);
                                    }
                                }}
                                className={selectedId === item.id ? "active-filter" : ""}
                                >
                                {item[displayColumn]}
                            </p>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default FilterUnit;