import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";

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
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

const PageRefresher = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    queryClient.invalidateQueries();
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          {/* ✅ UserProvider wraps the app */}
          <BrowserRouter>
            <Navbar />
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
                    <Login />
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
              <Route
                path="/profile"
                element={
                  <PageRefresher>
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  </PageRefresher>
                }
              />
              <Route
                path="/attraction/:id"
                element={
                  <PageRefresher>
                    <PrivateRoute>
                      <AttractionDetails />
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
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
