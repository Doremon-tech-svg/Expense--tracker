import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/groups"
          element={
            <Layout>
              <Groups />
            </Layout>
          }
        />

        <Route
          path="/groups/:id"
          element={
            <Layout>
              <GroupDetail />
            </Layout>
          }
        />

        {/* DEFAULT — go to groups instead of dashboard */}
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
