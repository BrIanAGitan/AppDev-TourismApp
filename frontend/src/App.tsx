import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import AttractionsActivities from "@/pages/AttractionsActivities";
import Profile from "@/pages/Profile";
import AttractionDetails from "@/pages/AttractionDetails";
import About from "@/pages/About";
import ForgotPassword from "@/pages/ForgotPassword";

// Components
import PrivateRoute from "@/components/PrivateRoute";
import Navbar from "@/components/Navbar"; // ✅ from ui

const queryClient = new QueryClient();

// Refreshes data and scroll on route change
const PageRefresher = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    queryClient.invalidateQueries(); // Refresh cached data
  }, [location.pathname]);

  return <>{children}</>;
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Sync state if user logs in from another tab
    const handleStorage = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar user={user} setUser={setUser} />
          <Routes>
            <Route
              path="/"
              element={
                <PageRefresher>
                  <Index />
                </PageRefresher>
              }
            />
            <Route
              path="/login"
              element={
                <PageRefresher>
                  <Login setUser={setUser} />
                </PageRefresher>
              }
            />
            <Route
              path="/signup"
              element={
                <PageRefresher>
                  <Signup />
                </PageRefresher>
              }
            />
            <Route
              path="/contact"
              element={
                <PageRefresher>
                  <Contact />
                </PageRefresher>
              }
            />
            <Route
              path="/about"
              element={
                <PageRefresher>
                  <About />
                </PageRefresher>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageRefresher>
                  <ForgotPassword />
                </PageRefresher>
              }
            />
            {/* ✅ Protected Routes */}
            <Route
              path="/profile"
              element={
                <PageRefresher>
                  <RequireAuth>
                    <Profile user={user} setUser={setUser} />
                  </RequireAuth>
                </PageRefresher>
              }
            />
            <Route
              path="/attraction/:id"
              element={
                <PageRefresher>
                  <PrivateRoute>
                    <AttractionDetails user={user} setUser={setUser} />
                  </PrivateRoute>
                </PageRefresher>
              }
            />
            <Route
              path="/attractions-activities"
              element={
                <PageRefresher>
                  <AttractionsActivities />
                </PageRefresher>
              }
            />
            <Route
              path="*"
              element={
                <PageRefresher>
                  <NotFound />
                </PageRefresher>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
