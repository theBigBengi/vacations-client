import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
//
import AppLayout from "./pages/app-layout/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Vacations from "./pages/vacations/Vacations";
import Reports from "./pages/reports/Reports";
import Homepage from "./pages/homepage/Homepage";
//
import { VacationsProvider } from "./contexts/VacationsContext";
import { AuthProvider } from "./contexts/AuthContext";
//
import "./App.css";
import "react-notifications/lib/notifications.css";
import PageNotFound from "./pages/page-not-found/PageNotFound";
import ProtectedRoute from "./pages/protected-route/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <NotificationContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='signup' element={<Signup />} />
          <Route path='signin' element={<Login />} />
          <Route
            path='app'
            element={
              <ProtectedRoute>
                <VacationsProvider>
                  <AppLayout />
                </VacationsProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to='vacations' />} />
            <Route index element={<Vacations />} />
            <Route path='vacations' element={<Vacations />} />
            <Route
              path='reports'
              element={
                <ProtectedRoute admin={true}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
