import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../lib/authFetch";

interface Booking {
  id: number;
  date: string;
  user: {
    username: string;
  };
  attraction: {
    name: string;
    location: string;
    image: string;
  };
}

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await authFetch("/bookings/");
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username}</h1>
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded shadow p-4 flex flex-col items-center"
            >
              <img
                src={booking.attraction.image}
                alt={booking.attraction.name}
                className="h-48 w-full object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">
                {booking.attraction.name}
              </h3>
              <p className="text-gray-600">{booking.attraction.location}</p>
              <p className="text-sm text-gray-500 mt-2">
                Booking Date: {new Date(booking.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
