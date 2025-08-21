import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import HomePage from './components/homePage/homePage.jsx';
import StudentDashboard from './components/studentDashboard/StudentDashboard.jsx';
import CompanyDashboard from './components/companyDashboard/CompanyDashboard.jsx';
import Faq from './components/faq/FAQPage.jsx';
import Blog from './components/blog/BlogPage.jsx';
import AboutUs from './components/about/aboutPage.jsx';


function App() {
  return (
    <AuthProvider>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          
          body.modal-open {
            overflow: hidden;
          }
          
          body.modal-open .app-content {
            filter: blur(4px);
            pointer-events: none;
            transition: filter 0.3s ease;
          }
          
          .app-content {
            transition: filter 0.3s ease;
          }
        `}
      </style>
      <div style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        lineHeight: 1.6,
        color: '#333'
      }}>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/student-dashboard/*" element={<StudentDashboard/>} />
          <Route path="/company-dashboard/*" element={<CompanyDashboard/>} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;