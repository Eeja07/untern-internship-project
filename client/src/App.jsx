import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/homePage.jsx';
import SearchPage from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/components/searchPage.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;