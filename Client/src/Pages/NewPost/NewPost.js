import React, {useState, useEffect} from "react";
import EndPoint from "../../Utils/Endpoint";
import './NewPost.css'
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

function NewPost () {
    const {accessToken} = useAuth();

    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [postState, setPostState] = useState(0);
    const [grades, setGrades] = useState(null);
    const [categories, setCategories] = useState(null);

    const [selectedGrade, setSelectedGrade] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const fetchData = async (url, setData) => {
        try {
            const response = await EndPoint.Api.getRequest(url, { withCredentials: true })
            
            if(response.status === 200){
                setData(response.data);
                console.log(response.data);
            }
            else if(response.error){
                //alertMessage(response.error);
            }
        } catch (error) {
            const message = error.response?.data?.error;
            //alertMessage(message);
        }
    };

    useEffect(() => {
        fetchData(EndPoint.Api.ApiPaths.grades.base, setGrades);
        fetchData(EndPoint.Api.ApiPaths.categories.base, setCategories);
    }, [])

    const PostManage = async () => {
        if(postState === 0){
            setPostState(postState + 1)
        }
        if(postState === 1){
        try {
            Swal.showLoading();

            const ThreadName = subject;
            const ThreadText = text;
            const CategoryID = selectedCategory;
            const GradeID= selectedGrade;

            const response = await EndPoint.Api.postRequest(
                EndPoint.Api.ApiPaths.threads.base, 
                {
                    ThreadName,
                    ThreadText,
                    CategoryID,
                    GradeID,
                },
                { 
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                } 
            );

            Swal.hideLoading();

            if (!response.error) {
                if (response.status === 201) {
                    Swal.fire({
                        icon: "success",
                        title: "Thread created successfully!",
                        text: "Your thread has been posted.",
                        showConfirmButton: true,
                    });
                    console.log(response.data.thread);
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.error,
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            console.error("Error creating thread:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An unexpected error occurred. Please try again later.",
                showConfirmButton: true,
            });
        }
        }
    }

    return (
        <div className={`new-post`}>
            {postState === 0 &&
                <div className="new-post-text">
                    <EndPoint.Components.SInput
                        type='text'
                        name='subject' 
                        placeholder='Subject'
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                    />
                    <EndPoint.Components.SInput
                        type='text'
                        name='text' 
                        placeholder='Content'
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        multiline={true}
                    />
                </div>
            }
            {postState === 1 &&
                <div className="attribute-select-wrapper">
                    <h1>
                        Which attrbutes describe your post the best?
                    </h1>
                    <div className="attribute-select">
                        <EndPoint.Panels.FilterUnit header="Grades" data={grades} displayColumn={"GradeName"} setDataId={setSelectedGrade} showAll={false}/>
                        <EndPoint.Panels.FilterUnit header="Categories" data={categories} displayColumn={"CategoryName"} setDataId={setSelectedCategory} showAll={false}/>
                    </div>
                </div>
                
            }
            <div className="new-post-submit">
                <EndPoint.Components.SButton onClick={PostManage}>
                    {postState == 0 ? "Next" : "Post"}
                </EndPoint.Components.SButton>
            </div>

        </div>
    )
}

export default NewPost;