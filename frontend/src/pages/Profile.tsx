import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Calendar, Edit, Trash } from "lucide-react";
import { featuredAttractions } from "@/components/FeaturedSection";
import { authFetch } from "@/lib/authFetch";

interface User {
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface UserProfile extends User {
  location?: string;
  bio?: string;
}

type Booking = {
  id: number;
  destination: string;
  date: string;
  guests: number;
};

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBookingForm, setEditBookingForm] = useState({
    date: "",
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ensurePositiveNumber = (value: number) => Math.max(1, value);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setProfile(parsedUser);
      setFormData(parsedUser);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          "https://cagayan-de-oro-tour.onrender.com/api/bookings/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setUser({ ...formData, username: user?.username || "" }); // Ensures context gets a valid User object
    localStorage.setItem(
      "user",
      JSON.stringify({ ...formData, username: user?.username || "" })
    );
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved.",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    navigate("/");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id);
    setEditBookingForm({
      date: booking.date,
      guests: booking.guests,
    });
  };

  const handleSaveBookingEdit = async () => {
    if (editingId === null) return;
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/${editingId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editBookingForm),
        }
      );

      if (!response.ok) throw new Error("Failed to update booking");

      toast({ title: "Booking updated!" });
      setEditingId(null);
      // re-fetch bookings after update
      const refreshed = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/`);
      if (refreshed.ok) {
        setBookings(await refreshed.json());
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete booking");

      toast({ title: "Booking deleted." });
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const getAttractionDetails = (id: string) => {
    return (
      featuredAttractions.find((attraction) => attraction.id === id) || {
        title: "Unknown Attraction",
        image: "https://placehold.co/600x400?text=Not+Found",
        location: "Unknown",
      }
    );
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback>
                      {typeof profile.name === "string" && profile.name
                        ? profile.name.slice(0, 2).toUpperCase()
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {profile.location && (
                    <p className="text-sm mt-2">{profile.location}</p>
                  )}
                  <div className="mt-6 w-full">
                    <Button
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:w-2/3">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location || ""}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio || ""}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="button" onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFormData(profile);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-sm">Full Name</h3>
                          <p>{profile.name}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Email</h3>
                          <p>{profile.email}</p>
                        </div>
                        {profile.location && (
                          <div>
                            <h3 className="font-medium text-sm">Location</h3>
                            <p>{profile.location}</p>
                          </div>
                        )}
                        {profile.bio && (
                          <div>
                            <h3 className="font-medium text-sm">Bio</h3>
                            <p>{profile.bio}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bookings</CardTitle>
                      <CardDescription>Manage your attraction bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {bookings.length === 0 ? (
                        <p className="text-gray-500">You have no bookings.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-2 border">Destination</th>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Guests</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking) => (
                                <tr key={booking.id} className="text-center">
                                  <td className="border px-4 py-2">
                                    {booking.destination}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {booking.date}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {booking.guests}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
