import React, {useEffect, useState} from 'react';
import './CategoryEditForm.css';
import EndPoint from '../../../Utils/Endpoint';
import { useAuth } from '../../../Context/AuthContext';

const CategoryEditForm = ({id, setSaveFunction, setDeleteFunction, setActiveId, setOpenForm}) => {
  const {alertMessage, accessToken} = useAuth();
  const [categoryName, setCategoryName] = useState('')
  const [dateCreated, setDateCreated] = useState('')
  const [dateModified, setDateModified] = useState('')

  const saveFunc = () => {
    if(!categoryName || categoryName === ''){
      alertMessage("Category name not set")
      return;
    }

    if(id <= 0){
      createCategory(categoryName, accessToken);
    }
    else{
      updateCategory(id, categoryName, accessToken);
    }
  };

    const deleteFunc = () => {
      if(id > 0){
        deleteCategory(id);
        setActiveId(0);
      }
    };

  const getCategoryById = async (id, accessToken) => {
    try {
      const response = await EndPoint.Api.getRequest(
        EndPoint.Api.ApiPaths.categories.base + `/${id}`, 
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Category retrieved:', response.data);
        setCategoryName(response.data.CategoryName) 
        setDateCreated(response.data.createdAt);
        setDateModified(response.data.updatedAt);
      } else {
        console.log('Category not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  };

  const updateCategory = async (id, CategoryName, accessToken) => {
    try {
      const response = await EndPoint.Api.patchRequest(
        EndPoint.Api.ApiPaths.categories.base + `/${id}`,  // Add the id to the URL path
        {
          CategoryName,  // Send the CategoryName in the request body
        },
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Include the JWT token
          },
        }
      );

      if (response.status === 200) {
        alertMessage("Category updated", true);
        return response.data;  // Return the updated category data
      } else {
        alertMessage(`Failed to update category: ${ response.error}`);
        return null;
      }
    } catch (error) {
      alertMessage(`Error updating category: ${error}`);
    }
  };

  const createCategory = async (CategoryName, accessToken) => {
    try {
        const response = await EndPoint.Api.postRequest(
            EndPoint.Api.ApiPaths.categories.base,
            {
                CategoryName,
            },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        alertMessage(`Category created successfully: ${response.data.CategoryName}`, true);
        setActiveId(response.data.id);
        return response;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
  };

  const deleteCategory = async (id) => {
        try {
            const response = await EndPoint.Api.deleteRequest(
                `${EndPoint.Api.ApiPaths.categories.base}/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alertMessage('Category deleted successfully', true);
            } else {
                alertMessage('Failed to delete category', false);
            }
        } catch (error) {
            alertMessage('Error deleting category', false);
        }
  };

  useEffect(() => {
    setSaveFunction(() => saveFunc); 
    setDeleteFunction(() => deleteFunc);
  }, [id, setSaveFunction, categoryName, accessToken]);

  useEffect(() => {
      
      getCategoryById(id, accessToken)
  }, [id])

  return (
    <>
        <div className='categoryeditform'>
          <h1>Category name</h1>
          <EndPoint.Components.SInput
              type="text"
              name="categoryName"
              placeholder=""
              value={categoryName}
              onChange={(e) => (setCategoryName(e.target.value))}
          />
           <h1>Updated at</h1>
          <EndPoint.Components.SInput
              type="text"
              name="updatedAt"
              placeholder=""
              readOnly={true}
              value={dateModified}
          />
           <h1>Created at</h1>
          <EndPoint.Components.SInput
              type="text"
              name="createdAt"
              placeholder=""
              readOnly={true}
              value={dateCreated}
          />
        </div>
    </>
  );
};

export default CategoryEditForm;
