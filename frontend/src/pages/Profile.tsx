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
  first_name?: string;
  last_name?: string;
  location?: string;
  bio?: string;
}

type Booking = {
  id: number;
  destination: string;
  date: string;
  guests: number;
}

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
    numTickets: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ensurePositiveNumber = (value: number) => Math.max(1, value);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

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
    fetchBookings();
  }, []);

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
      numTickets: booking.guests,
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
      fetchBookings();
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

  const getAttractionDetailsByDestination = (destination: string) => {
    return (
      featuredAttractions.find((a) =>
        a.title.toLowerCase() === destination.toLowerCase()
      ) || {
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
                      {profile.first_name && profile.last_name
                        ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {(profile.first_name || profile.username) + (profile.last_name ? ` ${profile.last_name}` : "")}
                  </h2>
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
                          <p className="text-lg font-medium">Full Name</p>
                          <p>{profile.first_name} {profile.last_name}</p>
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
                      {Array.isArray(bookings) && bookings.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Attraction</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Tickets</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings.map((booking) => {
                              const attraction = getAttractionDetailsByDestination(booking.destination);
                              return (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">
                                    {booking.destination || attraction.title}
                                  </TableCell>
                                  <TableCell>{booking.date}</TableCell>
                                  <TableCell>{booking.guests}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Dialog open={editingId === booking.id} onOpenChange={(open) => {
                                        if (!open) setEditingId(null);
                                      }}>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="icon" onClick={() => handleEditBooking(booking)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Edit Booking</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-date">Date</Label>
                                              <Input
                                                id="edit-date"
                                                type="date"
                                                value={editBookingForm.date}
                                                onChange={(e) => setEditBookingForm({ ...editBookingForm, date: e.target.value })}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-tickets">Guests</Label>
                                              <Input
                                                id="edit-tickets"
                                                type="number"
                                                min="1"
                                                value={editBookingForm.numTickets}
                                                onChange={(e) =>
                                                  setEditBookingForm({
                                                    ...editBookingForm,
                                                    numTickets: ensurePositiveNumber(Number(e.target.value)),
                                                  })
                                                }
                                              />
                                            </div>
                                            <Button
                                              className="w-full mt-4"
                                              onClick={handleSaveBookingEdit}
                                            >
                                              Save Changes
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleDeleteBooking(booking.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-gray-500">No bookings found.</p>
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
