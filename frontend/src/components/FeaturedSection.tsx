import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AttractionCard from "./AttractionCard";

// Move the featuredAttractions out so it can be imported elsewhere
export const featuredAttractions = [
  {
    id: "1",
    title: "White Water Rafting",
    description: "Experience thrilling rapids on the Cagayan de Oro River with professional guides. Perfect for adventure seekers of all levels!",
    image: "/images/rafting.jpg", // Updated path
    location: "Cagayan de Oro River",
    rating: 4.8,
    category: "Adventure"
  },
  {
    id: "2",
    title: "Macahambus Adventure Park",
    description: "Explore caves, canyons, and take in breathtaking views of the Cagayan de Oro River from suspension bridges and platforms.",
    image: "/images/cave.jpg", // Updated path
    location: "Macahambus, Cagayan de Oro",
    rating: 4.6,
    category: "Nature"
  },
  {
    id: "3",
    title: "Divine Mercy Shrine",
    description: "Visit this spiritual landmark featuring a 50-foot statue of Jesus Christ, offering panoramic views of the city and Macajalar Bay.",
    image: "/images/shrine.jpg", // Updated path
    location: "El Salvador City",
    rating: 4.7,
    category: "Religious"
  },
  {
    id: "4",
    title: "Dahilayan Adventure Park",
    description: "Experience Asia's longest dual zipline and other exciting attractions surrounded by the cool climate of Bukidnon highlands.",
    image: "/images/zipline.jpg", // Updated path
    location: "Manolo Fortich, Bukidnon",
    rating: 4.9,
    category: "Adventure"
  }
];

const FeaturedSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Attractions</h2>
            <p className="text-gray-600 max-w-2xl">
              Explore the most exciting destinations and experiences that Cagayan de Oro has to offer
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/attractions">View All Attractions</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              {...attraction}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
