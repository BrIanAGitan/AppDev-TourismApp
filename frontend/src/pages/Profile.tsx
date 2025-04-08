import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    location: "",
    bio: "",
  });
  
  // Check if user is logged in
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // Save to localStorage
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
  
  if (!profile) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditing ? "Update your personal information" : "Your personal information"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
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
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
