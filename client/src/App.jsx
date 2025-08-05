import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext.jsx';
import HomePage from './components/homePage.jsx';
import SearchPage from './components/searchPage.jsx';
import InternshipsPage from './components/InternshipsPage.jsx';

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
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          {/* Student routes */}
          <Route path="/discover-internships" element={<SearchPage />} />
          <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
          <Route path="/applications" element={<div>Applications Page - Coming Soon</div>} />
          <Route path="/success-stories" element={<div>Success Stories Page - Coming Soon</div>} />
          <Route path="/company-reviews" element={<div>Company Reviews Page - Coming Soon</div>} />
          <Route path="/certifications" element={<div>Certifications Page - Coming Soon</div>} />
          {/* Company routes */}
          <Route path="/post-internship" element={<div>Post Internship Page - Coming Soon</div>} />
          <Route path="/manage-applications" element={<div>Manage Applications Page - Coming Soon</div>} />
          <Route path="/pricing" element={<div>Pricing Page - Coming Soon</div>} />
          <Route path="/partnerships" element={<div>Partnerships Page - Coming Soon</div>} />
          <Route path="/analytics" element={<div>Analytics Page - Coming Soon</div>} />
          <Route path="/post-certifications" element={<div>Post Certifications Page - Coming Soon</div>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;