import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CompanyDashboard from './CompanyDashboard.jsx';

const CompanyDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="overview" replace />} />
      <Route path="/:section" element={<CompanyDashboard />} />
    </Routes>
  );
};

export default CompanyDashboardRoutes;