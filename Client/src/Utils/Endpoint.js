//Panels
import Navbar from "../Panels/Navbar/Navbar";
import ForumFilter from "../Panels/ForumFilter/ForumFilter";
import FilterUnit from "../Panels/ForumFilter/FilterUnit/FilterUnit";
import Grades from "../Admin/AdminPagePanels/Grades/Grades";
import Categories from "../Admin/AdminPagePanels/Categories/Categories";
import UserEditForm from "../Admin/AdminEditForms/UserEditForm/UserEditForm";
import CategoryEditForm from "../Admin/AdminEditForms/CategoryEditForm/CategoryEditForm";
import GradeEditForm from "../Admin/AdminEditForms/GradeEditForm/GradeEditForm";
//Components
import NavItem from "../Components/NavItem/NavItem";
import SButton from "../Components/Button/SButton";
import SInput from "../Components/Input/SInput";
import PostComponent from "../Components/PostComponent/PostComponent";
import Comment from "../Components/PostComponent/Comment/Comment";
import Table from "../Components/Table/Table";
import SIcon from "../Components/SIcon/SIcon";
//Pages
import Home from "../Pages/Home/Home";
import Signin from "../Pages/Signin/Signin";
import Signup from "../Pages/Signup/Signup";
import Forum from "../Pages/Forum/Forum";
import NewPost from "../Pages/NewPost/NewPost";
import AdminDashboard from "../Admin/AdminDashboard/AdminDashboard";
//Section
import ReadSection from "../Pages/Home/Sections/ReadSection";
import PostSection from "../Pages/Home/Sections/PostSection";
import WriteSection from "../Pages/Home/Sections/WriteSection";
import RepeatSection from "../Pages/Home/Sections/RepeatSection";
//API
import ApiPaths from '../Api/ApiPaths';
import {getRequest, putRequest, deleteRequest, postRequest, patchRequest} from '../Api/ApiResp'
//Icons
const addIcon = '/img/icons/add.png';
const editIcon = '/img/icons/edit.png';
const logoIcon = '/img/icons/logo.png';
const exitIcon = '/img/icons/exit.png';

const EndPoint = {
  "Paths":{
    "Home": "/",
    "About": "/About",
    "Forum": "/Forum",
    "Signin": "/Signin",
    "Signup": "/Signup",
    "NewPost": "/NewPost",
    "AdminDashboard": "/AdminDashboard"
  },  
  "Panels": {
    Navbar, ForumFilter, FilterUnit,
    "AdminDashboardPanels": {
      Grades, Categories
    },
    "AdminEditForms": {
      UserEditForm, CategoryEditForm, GradeEditForm
    }
  },
  "Pages": {
    Home, Signup, Signin,Forum,NewPost,AdminDashboard, 
    "HomeSections":{
      ReadSection, PostSection, WriteSection, RepeatSection
    }
  },
  "Components": {
    NavItem, SButton, SInput, PostComponent, Comment, Table, SIcon
  },
  "Api": {
    getRequest, putRequest, deleteRequest, postRequest, ApiPaths, patchRequest
  },
  "Icons":{
    addIcon, editIcon, logoIcon, exitIcon
  }
};

export default EndPoint;