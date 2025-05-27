import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { featuredAttractions } from "@/components/FeaturedSection";
import { Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
// import Footer from "@/components/ui/Footer"; // Uncomment if you create this

const AttractionDetails = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [numTickets, setNumTickets] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const attraction = featuredAttractions.find((a) => a.id === id);

  if (!attraction) {
    return <div>Attraction not found</div>;
  }

  const handleBookingClick = () => {
    const userDataStr = localStorage.getItem("user");

    if (!userDataStr) {
      navigate("/login", {
        state: {
          from: `/attraction/${id}`,
          message: "Please log in or sign up to book this attraction.",
        },
      });
      return;
    }

    setDialogOpen(true);
  };

  const ensurePositiveNumber = (value: number) => Math.max(1, value);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const userDataStr = localStorage.getItem("user");
    const token = localStorage.getItem("access");

    if (!userDataStr || !token) {
      toast({
        title: "Login Required",
        description: "Please login to book this attraction",
      });
      navigate("/login", {
        state: {
          from: `/attraction/${id}`,
          message: "Please log in or sign up to book this attraction.",
        },
      });
      return;
    }

    const safeNumTickets = ensurePositiveNumber(numTickets);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination: attraction.title,
            date: selectedDate,
            guests: safeNumTickets,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      toast({
        title: "Booking Confirmed!",
        description: `You've booked ${safeNumTickets} ticket(s) for ${attraction.title} on ${selectedDate}`,
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Booking Error",
        description: "Something went wrong while booking. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={handleBookingClick}>
                    Book This Experience
                  </Button>
                </DialogTrigger>
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
                      <label className="block text-sm font-medium mb-1">
                        Number of Tickets
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={numTickets}
                        onChange={(e) =>
                          setNumTickets(ensurePositiveNumber(Number(e.target.value)))
                        }
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

      {/* <Footer /> */}
    </div>
  );
};

export default AttractionDetails;
