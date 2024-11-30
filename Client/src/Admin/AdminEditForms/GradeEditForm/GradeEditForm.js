import React, {useEffect, useState} from 'react';
import './GradeEditForm.css';
import EndPoint from '../../../Utils/Endpoint';
import { useAuth } from '../../../Context/AuthContext';

const GradeEditForm = ({id, setSaveFunction, setDeleteFunction, setActiveId, setOpenForm}) => {
  const {alertMessage, accessToken} = useAuth();
  const [gradeName, setGradeName] = useState('')
  const [dateCreated, setDateCreated] = useState('')
  const [dateModified, setDateModified] = useState('')

  const saveFunc = () => {
    if(!gradeName || gradeName === ''){
      alertMessage("Grade name not set")
      return;
    }

    if(id <= 0){
      createGrade(gradeName, accessToken);
    }
    else{
      updateGrade(id, gradeName, accessToken);
    }
  };

    const deleteFunc = () => {
      if(id > 0){
        deleteGrade(id);
        setActiveId(0);
      }
    };

  const getGradeById = async (id, accessToken) => {
    try {
      const response = await EndPoint.Api.getRequest(
        EndPoint.Api.ApiPaths.grades.base + `/${id}`, 
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Grade retrieved:', response.data);
        setGradeName(response.data.GradeName) 
        setDateCreated(response.data.createdAt);
        setDateModified(response.data.updatedAt);
      } else {
        console.log('Grade not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching grade:', error);
      throw new Error('Failed to fetch grade');
    }
  };

  const updateGrade = async (id, GradeName, accessToken) => {
    try {
      const response = await EndPoint.Api.patchRequest(
        EndPoint.Api.ApiPaths.grades.base + `/${id}`,
        {
          GradeName,  
        },
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,  
          },
        }
      );

      if (response.status === 200) {
        alertMessage("Grade updated", true);
        return response.data; 
        alertMessage(`Failed to update grade: ${ response.error}`);
        return null;
      }
    } catch (error) {
      alertMessage(`Error updating grade: ${error}`);
    }
  };

  const createGrade = async (GradeName, accessToken) => {
    try {
        const response = await EndPoint.Api.postRequest(
            EndPoint.Api.ApiPaths.grades.base,
            {
                GradeName,
            },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        alertMessage(`Grade created successfully: ${response.data.GradeName}`, true);
        setActiveId(response.data.id);
        return response;
    } catch (error) {
        console.error('Error creating grade:', error);
        throw error;
    }
  };

  const deleteGrade = async (id) => {
        try {
            const response = await EndPoint.Api.deleteRequest(
                `${EndPoint.Api.ApiPaths.grades.base}/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alertMessage('Grade deleted successfully', true);
            } else {
                alertMessage('Failed to delete grade', false);
            }
        } catch (error) {
            alertMessage('Error deleting grade', false);
        }
  };

  useEffect(() => {
    setSaveFunction(() => saveFunc); 
    setDeleteFunction(() => deleteFunc);
  }, [id, setSaveFunction, gradeName, accessToken]);

  useEffect(() => {
      
      getGradeById(id, accessToken)
  }, [id])

  return (
    <>
        <div className='gradeeditform'>
          <h1>Grade name</h1>
          <EndPoint.Components.SInput
              type="text"
              name="gradeName"
              placeholder=""
              value={gradeName}
              onChange={(e) => (setGradeName(e.target.value))}
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

export default GradeEditForm;
