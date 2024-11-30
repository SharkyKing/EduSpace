import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css'; 

const NavItem = ({ to, children, exact = false, onClick, icon }) => {
    return (
        <NavLink
            to={to}
            exact={exact}
            className="nav-item"
            activeClassName="active"
            onClick={onClick}
        >
            <span className="nav-item-text">{children}</span>
            {icon && <span className="nav-item-icon">{icon}</span>} 
        </NavLink>
    );
};

export default NavItem;
