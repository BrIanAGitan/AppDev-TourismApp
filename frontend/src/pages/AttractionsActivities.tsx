import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredAttractions } from "@/components/FeaturedSection";
import AttractionCard from "@/components/AttractionCard";
import { Bed, Compass, Mountain, Landmark } from "lucide-react";

const AttractionsActivities = () => {
  const adventureAttractions = featuredAttractions.filter(
    (attraction) => attraction.category === "Adventure"
  );

  const natureAttractions = featuredAttractions.filter(
    (attraction) => attraction.category === "Nature"
  );

  const culturalAttractions = featuredAttractions.filter(
    (attraction) => attraction.category === "Religious"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Attractions & Activities in CDO</h1>

        {/* Adventure Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Adventure Activities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adventureAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} {...attraction} />
            ))}
          </div>
        </section>

        {/* Nature Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Mountain className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-semibold">Nature Attractions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {natureAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} {...attraction} />
            ))}
          </div>
        </section>

        {/* Cultural Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Landmark className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-semibold">Cultural & Religious Sites</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} {...attraction} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttractionsActivities;
