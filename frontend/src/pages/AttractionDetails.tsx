import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { featuredAttractions } from "@/components/FeaturedSection";
import { Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AttractionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [numTickets, setNumTickets] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const attraction = featuredAttractions.find(a => a.id === id);

  // Effect to refresh the component when location changes
  useEffect(() => {
    // Update the refresh key to force a re-render
    setRefreshKey(prevKey => prevKey + 1);

    // Reset state when navigating to a new attraction
    setSelectedDate("");
    setNumTickets(1);
    setDialogOpen(false);
  }, [location.pathname]);

  if (!attraction) {
    return <div>Attraction not found</div>;
  }

  // Helper function to ensure number is not below 1
  const ensurePositiveNumber = (value: number) => Math.max(1, value);

  const handleBookingClick = () => {
    const userDataStr = localStorage.getItem("user");

    if (!userDataStr) {
      // If user is not logged in, redirect to login
      navigate('/login', { 
        state: { 
          from: `/attraction/${id}`,
          message: "Please log in or sign up to book this attraction."
        }
      });
      return;
    }

    // If logged in, open booking dialog
    setDialogOpen(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access"); // Make sure you save JWT after login

    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to book this attraction",
        variant: "destructive",
      });
      navigate("/login", {
        state: {
          from: `/attraction/${id}`,
          message: "Please log in or sign up to book this attraction.",
        },
      });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          destination: attraction.title, // Use .title as in your featuredAttractions
          date: selectedDate,
          guests: numTickets,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to book.");
      }

      toast({
        title: "Booking Confirmed!",
        description: `You've booked ${numTickets} ticket(s) for ${attraction.title} on ${selectedDate}`,
      });

      setDialogOpen(false);

      setTimeout(() => {
        toast({
          title: "View Your Bookings",
          description: "Go to your profile to see all your bookings",
          action: (
            <Button variant="outline" onClick={() => navigate("/profile")}>
              View Profile
            </Button>
          ),
        });
      }, 1000);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Could not complete booking.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" key={refreshKey}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <img
              src={attraction.image}
              alt={attraction.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
              {attraction.category}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{attraction.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="h-5 w-5" />
                <span>{attraction.location}</span>
              </div>
              <p className="text-lg text-gray-700">{attraction.description}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold">Book Now</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">⭐</span>
                  <span>{attraction.rating.toFixed(1)}</span>
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Button className="w-full" onClick={handleBookingClick}>
                  Book This Experience
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book {attraction.title}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBooking} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Tickets</label>
                      <Input
                        type="number"
                        min="1"
                        value={numTickets}
                        onChange={(e) => setNumTickets(ensurePositiveNumber(Number(e.target.value)))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Confirm Booking
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttractionDetails;
