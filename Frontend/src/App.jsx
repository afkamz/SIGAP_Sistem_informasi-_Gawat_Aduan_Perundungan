import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';

// Student Pages
import { Landing } from './pages/student/Landing';
import { Register } from './pages/student/Register';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CreateReportWizard } from './pages/student/CreateReportWizard';
import { TrackReport } from './pages/student/TrackReport';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ReportList } from './pages/admin/ReportList';
import { ReportDetail } from './pages/admin/ReportDetail';
import { AuditTrail } from './pages/admin/AuditTrail';
import { AdminSettings } from './pages/admin/AdminSettings';

export const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Portal Siswa */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/buat-laporan" element={<CreateReportWizard />} />
          <Route path="/lacak" element={<TrackReport />} />

          {/* Portal Admin / Guru BK */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/laporan" element={<ReportList />} />
          <Route path="/admin/laporan-detail" element={<ReportDetail />} />
          <Route path="/admin/audit" element={<AuditTrail />} />
          <Route path="/admin/pengaturan" element={<AdminSettings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;

