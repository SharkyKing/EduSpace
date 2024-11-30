import React, {useState, useRef, useEffect} from "react";
import './Navbar.css'
import EndPoint from "../../Utils/Endpoint";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../Context/AuthContext";

function Navbar () {
    const {isAuth, role, RoleTypes} = useAuth();
    const navBarRef = useRef();
    const [isMobile, setIsMobile] = useState(false);
    const isMobileRef = useRef(isMobile);
    const [isHidden, setIsHidden] = useState(isMobile);
    const [isScrollingDown, setIsScrollingDown] = useState(false); 

    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        const guestNavItems = [
            { to: EndPoint.Paths.About, label: 'About' },
            { to: EndPoint.Paths.Forum, label: 'Forum' },
            { to: EndPoint.Paths.Home, label: 'Home' },
            { to: EndPoint.Paths.Signin, label: 'Sign in' },
            { to: EndPoint.Paths.Signup, label: 'Sign up' }
        ];

        const userNavItems = [
            { to: EndPoint.Paths.About, label: 'About' },
            { to: EndPoint.Paths.Forum, label: 'Forum' },
            { to: EndPoint.Paths.Home, label: 'Home' },
            { to: EndPoint.Paths.About, label: 'Dashboard' },
            { to: EndPoint.Paths.NewPost, label: 'Write new!' },
            { to: EndPoint.Paths.Signup, label: 'Profile' }
        ];

        const adminNavItems = [
            { to: EndPoint.Paths.About, label: 'About' },
            { to: EndPoint.Paths.Forum, label: 'Forum' },
            { to: EndPoint.Paths.Home, label: 'Home' },
            { to: EndPoint.Paths.About, label: 'Dashboard' },
            { to: EndPoint.Paths.NewPost, label: 'Write new!' },
            { to: EndPoint.Paths.Signup, label: 'Profile' },
            { to: EndPoint.Paths.AdminDashboard, label: 'Admin' }
        ];
        
        setNavItems(isAuth ? (role === RoleTypes.ADMIN ? adminNavItems : userNavItems) : guestNavItems);
    },[isAuth, role])

    const [currentTo, setCurrentTo] = useState(() => {
        const currentPath = window.location.pathname;
        const initialNavItem = navItems.find(item => item.to === currentPath);
        return initialNavItem || { to: EndPoint.Paths.Home, label: 'Home' };
    });

    const OnNavitemClick = (to) => {
        let neededItemIndex = navItems.findIndex(item => item.to === to);
        setCurrentTo(navItems[neededItemIndex])

        if(isMobile){
            setIsHidden(true);
        }
    }

     useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 800px)");

        setIsMobile(mediaQuery.matches);

        const handleResize = (e) => {
            setIsMobile(e.matches);

            if(e.matches){
                setIsHidden(true);
            }
            else{
                setIsHidden(false);
            }
        };

        mediaQuery.addEventListener('change', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    useEffect(() => {
        isMobileRef.current = isMobile;
    }, [isMobile]);

     useEffect(() => {
        const mainBody = document.querySelector('.main-body');
        let lastScrollY = mainBody ? mainBody.scrollTop : 0;

        const handleScroll = () => {
            if(isMobileRef.current) {
                setIsScrollingDown(false);
                return;
            }
            else {
                setIsScrollingDown(window.scrollY > lastScrollY);
                lastScrollY = window.scrollY; 
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
      <>
        <div className={`nav-bar ${isMobile ? 'mobile' : ''} ${isHidden ? 'hidden' : ''} ${isScrollingDown ? 'scrollingDown' : ''}` } ref={navBarRef}>
            {!isHidden && navItems.map((item, index) => (
                <EndPoint.Components.NavItem onClick={() => OnNavitemClick(item.to)} key={index} to={item.to}>
                    {item.label}
                </EndPoint.Components.NavItem>
            ))}
            {isHidden && isMobile &&
                <div className="nav-bar-hamburger" onClick={() => {setIsHidden(!isHidden)}}>
                    <FontAwesomeIcon icon={faBars} size="2x" />
                    <EndPoint.Components.NavItem to={currentTo.to}>
                        {currentTo.label}
                    </EndPoint.Components.NavItem>
                </div>
            }
        </div>
      </>  
    );
}

export default Navbar;