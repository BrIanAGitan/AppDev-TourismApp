
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredAttractions } from "@/components/FeaturedSection";
import AttractionCard from "@/components/AttractionCard";

const AttractionsActivities = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Attractions & Activities in CDO</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              {...attraction}
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttractionsActivities;
