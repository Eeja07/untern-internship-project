import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard.jsx';

const StudentDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="discover" replace />} />
      <Route path="/:section" element={<StudentDashboard />} />
    </Routes>
  );
};

export default StudentDashboardRoutes;