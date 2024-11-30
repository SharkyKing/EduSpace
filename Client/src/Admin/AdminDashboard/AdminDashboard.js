import React, {useState, useEffect} from 'react';
import './AdminDashboard.css';
import EndPoint from '../../Utils/Endpoint';


const AdminDashboard = () => {
    const [activePagePanel, setActivePagePanel] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false);
    const [buttonInactiveClass, setButtonInactiveClass] = useState("");
    const [buttonActiveClass, setButtonActiveClass] = useState("");
    const [adminPageClass, setAdminPageClass] = useState("");

    const onPagePanelClick = (id) => {
        setIsAnimating(true);
        setActivePagePanel(id);
    };

    useEffect(() => {
        if(activePagePanel > 0){
            setButtonInactiveClass("button-inactive-opacityDown");
            setButtonActiveClass("button-active-sizeDown");
            setTimeout(() => {
                setButtonInactiveClass("button-inactive-sizeZero");
                setButtonActiveClass("button-active-sizeZero");
                setTimeout(() => {
                    setButtonActiveClass("button-active-corner");
                    setAdminPageClass("admin-dashboard-single")
                    setIsAnimating(false);
                }, 500); 
            }, 500); 
        }
    }, [activePagePanel])

    return (
        <>
        <div className={`admin-dashboard ${adminPageClass}`}>
            <EndPoint.Components.SButton 
                className={`admin-dashboard-button ${activePagePanel === 1 ? buttonActiveClass: ""} ${activePagePanel > 0 && activePagePanel != 1 ? buttonInactiveClass : ""}`}
                id={1} 
                onClick={() => onPagePanelClick(1)}>
                    Users
            </EndPoint.Components.SButton>
            <EndPoint.Components.SButton 
                className={`admin-dashboard-button ${activePagePanel === 2 ? buttonActiveClass: ""} ${activePagePanel > 0 && activePagePanel != 2 ? buttonInactiveClass : ""}`}
                id={2} 
                onClick={() => onPagePanelClick(2)}>
                    Categories
            </EndPoint.Components.SButton>
            <EndPoint.Components.SButton 
                className={`admin-dashboard-button ${activePagePanel === 3 ? buttonActiveClass: ""} ${activePagePanel > 0 && activePagePanel != 3 ? buttonInactiveClass : ""}`}
                id={3} 
                onClick={() => onPagePanelClick(3)}>
                    Grades
            </EndPoint.Components.SButton>
            <EndPoint.Components.SButton 
                className={`admin-dashboard-button ${activePagePanel === 4 ? buttonActiveClass: ""} ${activePagePanel > 0 && activePagePanel != 4 ? buttonInactiveClass : ""}`}
                id={4} 
                onClick={() => onPagePanelClick(4)}>
                    Roles
            </EndPoint.Components.SButton>
            <div className={`admin-page-panel ${activePagePanel > 0 && !isAnimating ? "admin-page-panel-active" : ""}`}>
                {activePagePanel == 2 && <EndPoint.Panels.AdminDashboardPanels.Categories/>}
                {activePagePanel == 3 && <EndPoint.Panels.AdminDashboardPanels.Grades/>}
            </div>
            
        </div>
        </>
    );
};

export default AdminDashboard;
