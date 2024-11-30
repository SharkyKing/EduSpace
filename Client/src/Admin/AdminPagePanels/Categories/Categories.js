import React, { useEffect, useState } from 'react';
import './Categories.css';
import EndPoint from '../../../Utils/Endpoint';
import { useAuth } from '../../../Context/AuthContext';

const Categories = () => {
    const {accessToken, alertMessage} = useAuth();

    const [categories, setCategories] = useState(null);

    const getAllCategories = async () => {
    try {
        setCategories(null);
        const response = await EndPoint.Api.getRequest(
        EndPoint.Api.ApiPaths.categories.base,
        {
            withCredentials: true,
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        }
        );

        if (response.status === 200) {
            console.log(response.data);
            setCategories(response.data); // Store all categories in state
        } else {
        alertMessage('Failed to fetch categories', false);
        }
    } catch (error) {
        alertMessage('Error fetching categories', false);
    }
    };

    const headers = {
        CategoryName: 'Category name',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
    };

    useEffect(() => {
        if (accessToken) {
            getAllCategories(); 
        }
    }, [accessToken]);

    return (
        <>
            {
                categories &&
                <EndPoint.Components.Table data={categories} headers={headers} FormToOpen={<EndPoint.Panels.AdminEditForms.CategoryEditForm />} refreshFunction={getAllCategories}/>
            }
        </>
    );
};

export default Categories;
