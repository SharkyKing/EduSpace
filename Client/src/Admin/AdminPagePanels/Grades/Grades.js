import React, { useEffect, useState } from 'react';
import './Grades.css';
import EndPoint from '../../../Utils/Endpoint';
import { useAuth } from '../../../Context/AuthContext';

const Grades = () => {
    const {accessToken, alertMessage} = useAuth();

    const [grades, setGrades] = useState(null);

    const getAllGrades = async () => {
    try {
        setGrades(null);
        const response = await EndPoint.Api.getRequest(
        EndPoint.Api.ApiPaths.grades.base,
        {
            withCredentials: true,
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        }
        );

        if (response.status === 200) {
            console.log(response.data);
            setGrades(response.data); 
        } else {
        alertMessage('Failed to fetch grades', false);
        }
    } catch (error) {
        alertMessage('Error fetching grades', false);
    }
    };

    const headers = {
        GradeName: 'Grade name',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
    };

    useEffect(() => {
        if (accessToken) {
            getAllGrades(); 
        }
    }, [accessToken]);

    return (
        <>
            {
                grades &&
                <EndPoint.Components.Table data={grades} headers={headers} FormToOpen={<EndPoint.Panels.AdminEditForms.GradeEditForm />} refreshFunction={getAllGrades}/>
            }
        </>
    );
};

export default Grades;
