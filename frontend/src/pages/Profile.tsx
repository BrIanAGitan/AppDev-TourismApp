import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Calendar, Edit, Trash } from "lucide-react";
import { featuredAttractions } from "@/components/FeaturedSection";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
}

type Booking = {
  id: number;
  attractionId: string;
  date: string;
  numTickets: number;
  created_at?: string;
};

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    location: "",
    bio: "",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBookingForm, setEditBookingForm] = useState({
    date: "",
    numTickets: 1,
  });
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

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://cagayan-de-oro-tour.onrender.com/api";

  const fetchBookings = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    setProfile(formData);
    setIsEditing(false);

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
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
      numTickets: booking.numTickets,
    });
  };

  const handleSaveBookingEdit = async () => {
    if (editingId === null) return;
    try {
      const access = localStorage.getItem("access");
      const response = await fetch(`https://cagayan-de-oro-tour.onrender.com/api/bookings/${editingId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(editBookingForm),
      });

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
      const access = localStorage.getItem("access");
      const response = await fetch(`https://cagayan-de-oro-tour.onrender.com/api/bookings/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

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
                    <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                        <Button type="button" onClick={handleSaveProfile}>Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setFormData(profile);
                          setIsEditing(false);
                        }}>Cancel</Button>
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
                      {bookings.length > 0 ? (
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
                              const attraction = getAttractionDetails(booking.attractionId);
                              return (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">{attraction.title}</TableCell>
                                  <TableCell>{booking.date}</TableCell>
                                  <TableCell>{booking.numTickets}</TableCell>
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
                                              <Label htmlFor="edit-tickets">Number of Tickets</Label>
                                              <Input
                                                id="edit-tickets"
                                                type="number"
                                                min="1"
                                                value={editBookingForm.numTickets}
                                                onChange={(e) => setEditBookingForm({
                                                  ...editBookingForm,
                                                  numTickets: ensurePositiveNumber(Number(e.target.value))
                                                })}
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
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-medium mb-1">No Bookings Yet</h3>
                          <p className="text-gray-500">You haven't made any bookings yet.</p>
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
