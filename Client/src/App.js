import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,Route, Routes  } from 'react-router-dom';
import EndPoint from './Utils/Endpoint';
import { AuthProvider } from './Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

const AppContent = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingClass, setAnimatingClass] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
      setIsAnimating(true);
      setAnimatingClass("main-body-effect");
      setTimeout(() => {
          setIsAnimating(false);
          setAnimatingClass(""); 
      }, 500); 
  }, [navigate])

  return (
    <>
      <div className='main-logo-icon'>
        <EndPoint.Components.SIcon src={EndPoint.Icons.logoIcon}></EndPoint.Components.SIcon>
      </div>
      <div class="background-line background-line0"></div>
      <div class="background-line background-line1"></div>
      <div class="background-line background-line2"></div>
      <div class="background-line background-line3"></div>
      <div class="background-line background-line4"></div>
      <div class="background-line background-line5"></div>
      <div class="background-line background-line6"></div>
      <div class="background-line background-line7"></div>
      <div class="background-line background-line8"></div>
      <div class="background-line background-line9"></div>
      <div class="background-line background-line10"></div>
      <div class="background-line background-line11"></div>
      <div class="background-line background-line12"></div>
      <div class="background-line background-line13"></div>
      <div class="background-line background-line14"></div>
      <div class="background-line background-line15"></div>
      <div class="background-line background-line16"></div>
      <div class="background-line background-line17"></div>
      <div class="background-line background-line18"></div>

      <EndPoint.Panels.Navbar/>
      <div className={`main-body ${isAnimating ? animatingClass : ''}`}>
          <Routes>
            <Route path={EndPoint.Paths.Home} element={<EndPoint.Pages.Home/>} />
            <Route path={EndPoint.Paths.Signin} element={<EndPoint.Pages.Signin/>} />
            <Route path={EndPoint.Paths.Signup} element={<EndPoint.Pages.Signup/>} />
            <Route path={EndPoint.Paths.Forum} element={<EndPoint.Pages.Forum/>} />
            <Route path={EndPoint.Paths.NewPost} element={<EndPoint.Pages.NewPost/>} />
            <Route path={EndPoint.Paths.AdminDashboard} element={<EndPoint.Pages.AdminDashboard/>} />
          </Routes>
      </div>
    </>
  );
}

export default App;
