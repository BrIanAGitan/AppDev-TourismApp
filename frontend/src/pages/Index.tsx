import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Info, MapPin } from "lucide-react";

// Sample categories data
const categories = [
  {
    id: "adventure",
    title: "Adventure",
    description: "Experience thrilling activities like white water rafting and ziplining",
    icon: <Calendar className="h-8 w-8" />,
    color: "bg-cdo-blue text-white",
  },
  {
    id: "nature",
    title: "Nature",
    description: "Explore the natural wonders and scenic spots around CDO",
    icon: <MapPin className="h-8 w-8" />,
    color: "bg-cdo-green text-white",
  },
  {
    id: "culture",
    title: "Culture",
    description: "Discover the rich cultural heritage and historical sites of the city",
    icon: <Info className="h-8 w-8" />,
    color: "bg-cdo-gold text-black",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Discover CDO by Category</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex flex-col items-center text-center p-6 rounded-lg shadow-md border border-gray-100 card-hover"
                >
                  <div className={`${category.color} p-4 rounded-full mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Button asChild variant="outline" className="mt-auto">
                    <Link to={`/category/${category.id}`}>Explore {category.title}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Attractions */}
        <FeaturedSection />

        {/* About CDO Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">About Cagayan de Oro</h2>
                <p className="text-gray-700 mb-4">
                  Known as the "City of Golden Friendship," Cagayan de Oro is a vibrant urban center on Mindanao island in the Philippines. It's a hub of commerce, education, and culture in the region.
                </p>
                <p className="text-gray-700 mb-4">
                  The city is famous for its white water rafting adventures on the Cagayan de Oro River, making it the adventure capital of the Philippines. Beyond thrilling activities, CDO offers natural wonders, cultural landmarks.
                </p>
                <p className="text-gray-700 mb-6">
                  Whether you're seeking adventure, relaxation, cultural experiences, Cagayan de Oro has something for everyone.
                </p>
                <Button asChild>
                  <Link to="/about">Learn More About CDO</Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/cityscape.jpg" 
                  alt="Cagayan de Oro Cityscape" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-cdo-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Explore Cagayan de Oro?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Create an account to save your favorite spots, get personalized recommendations, and plan your perfect CDO adventure!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-cdo-gold text-black hover:bg-cdo-gold/90">
                <Link to="/signup">Create an Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                <Link to="/attractions-activities">Start Exploring</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
