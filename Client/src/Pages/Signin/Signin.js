import React, {useState, useEffect} from "react";
import "./Signin.css";
import EndPoint from "../../Utils/Endpoint";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function Signin() {
    const {login, setAccessToken} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleButtonSignInClick = async () => {
        try {
            const swalInstance = Swal.fire({
                position: "top",
                title: "Signing in...",
                showConfirmButton: false,
                allowOutsideClick: false, // Prevent clicking outside the alert
                didOpen: () => {
                    Swal.showLoading(); // Show the loading spinner
                }
            });

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            await delay(1500);

            const response = await EndPoint.Api.postRequest(EndPoint.Api.ApiPaths.account.login,{
                Email: email,
                Password: password
            }, {withCredentials: true});

            Swal.hideLoading();
            
            if(!response.error){
                if (response.status === 200) {
                    Swal.close();
                    console.log(response.data.accessToken);
                    setAccessToken(response.data.accessToken);
                    await login();
                }
            }
            else{
                swalInstance.update({
                    icon: "error",
                    title: response.error,
                    showConfirmButton: true
                });
            }
        } catch (error) {
            //alertMessage(error.response?.data?.error || "An error occurred during signup.");
        }
    };

    return (
        <div className={`signin-form`}>
            <h1>
                {"Where educators come together to share, inspire, and grow. Collaboration is the key to unlocking every student's potential." }
            </h1>
            <div className="signin-form-sub">
                <EndPoint.Components.SInput
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                />
                <EndPoint.Components.SInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                />
            </div>
            <div className="signin-form-sub-button">
                <EndPoint.Components.SButton
                    onClick={handleButtonSignInClick}
                >
                    Sign in
                </EndPoint.Components.SButton>
            </div>
        </div>
    );
}

export default Signin;
