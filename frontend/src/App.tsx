import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AttractionsActivities from "./pages/AttractionsActivities";
import Profile from "./pages/Profile";
import AttractionDetails from "./pages/AttractionDetails";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

// Component to handle page refresh on navigation
const PageRefresher = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll position when navigating to a new page
    window.scrollTo(0, 0);

    // Force query client to refresh data on page change
    queryClient.invalidateQueries();
  }, [location.pathname]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            path="/attractions-activities"
            element={
              <PageRefresher>
                <AttractionsActivities />
              </PageRefresher>
            }
          />
          <Route
            path="/profile"
            element={
              <PageRefresher>
                <Profile />
              </PageRefresher>
            }
          />
          <Route
            path="/attraction/:id"
            element={
              <PageRefresher>
                <AttractionDetails />
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

export default App;
