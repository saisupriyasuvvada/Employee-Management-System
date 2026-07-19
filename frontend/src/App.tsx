import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";
import Organization from "./pages/Organization";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Layout from "./components/layouts/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* All logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Employee directory */}
            <Route
              path="/employees"
              element={<Employees />}
            />

            {/* Employee details */}
            <Route
              path="/employees/:id"
              element={<EmployeeDetails />}
            />

            {/* Super Admin + HR Manager only */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "SUPER_ADMIN",
                    "HR_MANAGER",
                  ]}
                />
              }
            >
              <Route
                path="/employees/add"
                element={<AddEmployee />}
              />

              <Route
                path="/employees/:id/edit"
                element={<EditEmployee />}
              />
            </Route>

            {/* Organization hierarchy */}
            <Route
              path="/organization"
              element={<Organization />}
            />

            {/* My profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/profile/edit"
              element={<EditProfile />}
            />
          </Route>
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;