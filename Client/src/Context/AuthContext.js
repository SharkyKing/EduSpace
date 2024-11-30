import React, { createContext, useContext, useState, useEffect, useCallback  } from 'react';
import { useNavigate  } from 'react-router-dom';
import Swal from 'sweetalert2';
import EndPoint from '../Utils/Endpoint';

const RoleTypes = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [userData, setUser] = useState();
    const [isAuth, setIsAuth] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [role, setRole] = useState(RoleTypes.GUEST);
    const [checkingRole, setCheckingRole] = useState(false);
    

    const alertMessage = (message, success = false) => {
        Swal.fire({
            title: message,
            icon: `${success ? "success": "error"}`,
            confirmButtonText: 'Okay',
            customClass: {
                confirmButton: 'custom-button'
            }
        });
    };

    const checkAuth = (async (isLogin) => {
        if(accessToken === '' || checkingRole) return;

        try {
            const response = await EndPoint.Api.getRequest(EndPoint.Api.ApiPaths.auth.auth, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            if (response.status === 200) {
                 const responseRole = await EndPoint.Api.getRequest(EndPoint.Api.ApiPaths.account.role, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                console.log(responseRole);

                if (responseRole.status === 200) {
                    const roleID = responseRole.data.roleId;

                    if (roleID === 1) {
                        setRole(RoleTypes.ADMIN);
                    } else if (roleID === 2) {
                        setRole(RoleTypes.USER);
                    } else {
                        setRole(RoleTypes.GUEST);
                    }
                    setIsAuth(true);
                    setUser(response.data.user);
                    if(isLogin){
                        navigate(EndPoint.Paths.Forum);
                    }
                }
                else{
                    alertMessage("Failed to set user role");
                }
            }
            else{
                setIsAuth(false);
                setUser(null);
                alertMessage("Failed to authenticate user");
                navigate(EndPoint.Paths.Signin);
            }
        } catch (error) {
            console.log(error);
            setIsAuth(false); 
            alertMessage("Failed to check user date");
            navigate(EndPoint.Paths.Signin);
        } finally {
            // setTimeout(() => {
            //     setLoading(false);
            // }, 2000)
        }
    });

    const login = async () => {
        setCheckingRole(true);
        await checkAuth(true);
        setCheckingRole(false);
    }

    const logout = () => {
        EndPoint.Api.postRequest(EndPoint.Api.ApiPaths.account.logout, {}, { withCredentials: true })
            .then(() => {
                setIsAuth(false);
                setAccessToken(null);
                setUser(null);
                navigate(EndPoint.Paths.Signin);
            })
            .catch(error => {
                console.error("Logout failed:", error);
            });
    };

    useEffect(() => {
        checkAuth();
    }, [accessToken, navigate]);

    return (
        <AuthContext.Provider value={{ isAuth, logout, alertMessage, checkAuth, userData, setAccessToken, login, role, accessToken, RoleTypes}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
