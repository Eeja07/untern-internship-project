import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext.jsx';
import HomePage from './components/homePage.jsx';
import SearchPage from './components/searchPage.jsx';

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
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;