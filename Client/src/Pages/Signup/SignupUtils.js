export const validateInputs = (currentSignupState, firstName, lastName, userName, email, password, repeatPassword) => {
    let validationErrors = {};

    if(currentSignupState === 0){
        if (!firstName) validationErrors.firstName = "First name is required";
        if (!lastName) validationErrors.lastName = "Last name is required";
    }
    else if(currentSignupState === 1){
        if (!userName) validationErrors.firstName = "Username is required";
        if (!email) validationErrors.email = "Email is required";
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailRegex.test(email)) validationErrors.email = "Please enter a valid email address";
    }
    else if(currentSignupState === 2) {
        if (!password) validationErrors.password = "Password is required";
        if (!repeatPassword) validationErrors.repeatPassword = "Please repeat your password";
        if (password && repeatPassword && password !== repeatPassword) {
            validationErrors.repeatPassword = "Passwords do not match";
        }

        if (password && password.length < 8) validationErrors.password = "Password must be at least 8 characters long";
    }

    return validationErrors;
};

export const handleFieldChange = (e, setUserName, setFirstName, setLastName, setEmail, setPassword, setRepeatPassword) => {
        const { name, value } = e.target;
        switch (name) {
            case 'userName':
                setUserName(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'repeatPassword':
                setRepeatPassword(value);
                break;
            default:
                break;
        }
    };