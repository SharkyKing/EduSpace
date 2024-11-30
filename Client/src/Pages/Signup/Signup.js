import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import EndPoint from "../../Utils/Endpoint";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs"
import { validateInputs, handleFieldChange } from "./SignupUtils";

function Signup() {
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [currentSignupState, setCurrentSignupState] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatingClass, setAnimatingClass] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstErrorMessage = Object.values(errors)[0];  // Get the first error message
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: firstErrorMessage,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }, [errors]);

    const handleChange = (e) => {
        handleFieldChange(e, setUserName, setFirstName, setLastName, setEmail, setPassword, setRepeatPassword);
    };

    useEffect(() => {
        if (isAnimating) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto"; 
        }

        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, [isAnimating]);

    const handleButtonContinueClick = async () => {
        const validationErrors = validateInputs(currentSignupState, firstName, lastName, userName, email, password, repeatPassword);
        
        if (Object.keys(validationErrors).length === 0) {
            
            if(currentSignupState < 2){
                setIsAnimating(true);
                setAnimatingClass("button-click-effect");
                setTimeout(() => {
                    setIsAnimating(false);
                    setAnimatingClass(""); 
                }, 500); 
                setCurrentSignupState(currentSignupState + 1);
            }
            else {

            try {
                const swalInstance = Swal.fire({
                    position: "top",
                    title: "Creating...",
                    showConfirmButton: false,
                    allowOutsideClick: false, // Prevent clicking outside the alert
                    didOpen: () => {
                        Swal.showLoading(); // Show the loading spinner
                    }
                });

                const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                await delay(1500);

                const response = await EndPoint.Api.postRequest(EndPoint.Api.ApiPaths.user.base,{
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Password: hashedPassword,
                    Username: userName
                });

                Swal.hideLoading();

                if(!response.error){
                    if (response.status === 201) {
                         swalInstance.update({
                            icon: "success",
                            title: "Account created successfully! Now you can sign in.",
                            timer: 1500, 
                            showConfirmButton: true
                        });
                        await delay(1500);
                        navigate(EndPoint.Paths.Signin);
                    }
                }
                else{
                    swalInstance.update({
                        icon: "error",
                        title: response.error,
                        timer: 1500,
                        showConfirmButton: true
                    });
                    //alertMessage(response.error)
                }
            } catch (error) {
                //alertMessage(error.response?.data?.error || "An error occurred during signup.");
            }
        }
        } else {
            setErrors(validationErrors);  
        }
    };

    const handleButtonBackClick = () => {
        setIsAnimating(true);
        setAnimatingClass("button-click-effect-back");
        setTimeout(() => {
            setIsAnimating(false);
            setAnimatingClass("");  
        }, 500);  
        setCurrentSignupState(currentSignupState - 1);
    };

   

    return (
        <div className={`signup-form ${isAnimating ? animatingClass : ''}`}>
            {currentSignupState == 0 &&  <h1>What is you full name?</h1> }

            {currentSignupState == 1 &&  <h1>Hey, {firstName} {lastName}. We love your name!</h1>}
            {currentSignupState == 1 && <h1>Now we need to know, how should we call you.</h1>}

            {currentSignupState == 2 &&  <h1>"{userName}" sounds awesome!</h1>}
            {currentSignupState == 2 &&  <h1>Now make sure to type in strong password, so nobody knows your secrets!</h1>}

            {currentSignupState == 0 && <div className="signup-form-sub">
                <EndPoint.Components.SInput
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleChange}
                />
                <EndPoint.Components.SInput
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleButtonContinueClick();
                        }
                    }}
                />
            </div>}
            {currentSignupState == 1 && <div className="signup-form-sub">
                <EndPoint.Components.SInput
                    type="text"
                    name="userName"
                    placeholder="Username"
                    value={userName}
                    onChange={handleChange}
                />
                <EndPoint.Components.SInput
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleButtonContinueClick();
                        }
                    }}
                />
            </div>}
            {currentSignupState == 2 && <div className="signup-form-sub">
                <EndPoint.Components.SInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                />
                <EndPoint.Components.SInput
                    type="password"
                    name="repeatPassword"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleButtonContinueClick();
                        }
                    }}
                />
            </div>}
            <div className="signup-form-sub-button">
                {currentSignupState > 0 && 
                    <EndPoint.Components.SButton className={"signup-form-sub-backbtn"} onClick={handleButtonBackClick}>
                        Go back
                    </EndPoint.Components.SButton>
                }
                <EndPoint.Components.SButton
                    onClick={handleButtonContinueClick}
                >
                    Continue
                </EndPoint.Components.SButton>
            </div>
        </div>
    );
}

export default Signup;
