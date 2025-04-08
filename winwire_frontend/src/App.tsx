import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AppLayout } from "./components/global/layout";
import { LoginWidget } from "./components/global/loginWidget";
import { AdminDashboard } from "./components/routes/admins/adminDashboard";
import { useAuth, AuthProvider } from "./components/contexts/userContext";
import { LearnerDashboard } from "./components/routes/learners/learnerDashboard";
import { ManagerDashboard } from "./components/routes/managers/managerDashboard";
import { LoadingIndicator } from "./components/global/loadingIndicator";
import { AddLearningPaths } from "./components/routes/admins/addLearningPaths";
import { AssignCourses } from "./components/routes/admins/assignCourses";
import { LearningPaths } from "./components/routes/admins/learningPaths";
import { LearningPathReports } from "./components/routes/admins/learningPathsReports";
import { Reports } from "./components/routes/managers/reports";
import { Reportees } from "./components/routes/managers/reportees";
import { LearnerLearningPaths } from "./components/routes/learners/learnerLearningPaths";
import { Assessment } from "./components/routes/learners/assessment";
import { CompletedCourses } from "./components/routes/learners/completedLearningpaths";
import { LearnerReports } from "./components/routes/learners/learnerReports";
import { ErrorPage } from "./components/global/errorPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingIndicator type="fullScreen" />;
  if (!token) return <LoginWidget />;

  return <>{children || <Outlet />}</>;
};

export const App: React.FC = () => (
  <AuthProvider>
    <AppLayout>
      <Routes>
        <Route path="/" element={<LoginWidget />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="learning-paths" />} />
          <Route path="learning-paths" element={<LearningPaths />} />
          <Route path="assign-courses" element={<AssignCourses />} />
          <Route path="reports" element={<LearningPathReports />} />
          <Route path="add-learning-paths" element={<AddLearningPaths />} />
        </Route>
        <Route path="/manager/dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>}> 
          <Route index element={<Navigate to="reportees" />} />
          <Route path="reportees" element={<Reportees />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/learner/dashboard" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>}> 
          <Route index element={<Navigate to="learning-paths" />} />
          <Route path="learning-paths" element={<LearnerLearningPaths />} />
          <Route path="assessment/:courseId" element={<Assessment />} />
          <Route path="completed-paths" element={<CompletedCourses />} />
          <Route path="reports" element={<LearnerReports />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AppLayout>
  </AuthProvider>
);
