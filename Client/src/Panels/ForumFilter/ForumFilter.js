import React, {useState ,useEffect, useRef } from "react";
import './ForumFilter.css'
import EndPoint from "../../Utils/Endpoint";
import { useNavigate } from "react-router-dom";

function ForumFilter ({setForumPostDataSource}) {
    const [filterOpen, setFilterOpen] = useState(true);
    const navigate = useNavigate();
    const filterRef = useRef(null);
    const [grades, setGrades] = useState(null);
    const [categories, setCategories] = useState(null);

    const [selectedGrade, setSelectedGrade] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const [forumPosts, setForumPosts] = useState([]);

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

    const fetchForumPosts = async () => {
       try {
            const response = await EndPoint.Api.getRequest(EndPoint.Api.ApiPaths.threads.filtered(selectedCategory, selectedGrade, ''));

            if (!response.error) {
                if (response.status === 200) {
                    console.log("Threads fetched successfully:", response.data);

                    if(setForumPostDataSource){
                        setForumPostDataSource(response.data)
                    }
                    setForumPosts(response.data);
                }
            } else {
                console.error("Error fetching threads:", response.error);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            setFilterOpen(!(filterRef.current && !filterRef.current.contains(event.target)));
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setFilterOpen(false);
        fetchForumPosts();
    },[navigate])

    return (
        <>
            <div className={`forum-filter ${filterOpen ? "filter-open" : "filter-close"}`} 
                ref={filterRef}
                onClick={
                    () => {
                        if(!filterOpen){
                            setFilterOpen(!filterOpen)
                        }
                    }
                }>
                <div className="filter-buttons">
                    <h3 onClick={() => {
                        if(!filterOpen){
                            setFilterOpen(!filterOpen);
                            fetchForumPosts();
                        }
                        else{
                            setFilterOpen(!filterOpen);
                            fetchForumPosts();
                        }
                    }
                    }>{filterOpen ? "Apply" : "Filters"}</h3>
                    {
                        filterOpen &&
                        <h3 className="filter-close-btn" onClick={() => setFilterOpen(!filterOpen)}>Close</h3>
                    }
                </div>
                {
                    filterOpen &&
                    <div className="filter-filters">
                        <EndPoint.Panels.FilterUnit header="Grades" data={grades} displayColumn={"GradeName"} setDataId={setSelectedGrade} defaultID={selectedGrade}/>
                        <EndPoint.Panels.FilterUnit header="Categories" data={categories} displayColumn={"CategoryName"} setDataId={setSelectedCategory} defaultID={selectedCategory}/>
                    </div>
                }
            </div>
        </>
    )
}

export default ForumFilter;