
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[85vh] md:h-[80vh] hero-pattern flex items-center">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Discover the Beauty of 
            <span className="text-cdo-gold"> Cagayan de Oro</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            Explore the City of Golden Friendship with our comprehensive guide to the best attractions, activities, and accommodations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <Button asChild size="lg" className="bg-cdo-gold text-black hover:bg-cdo-gold/90">
              <Link to="/attractions-activities">Explore Attractions & Activities</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/hotels">Find Accommodations</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30"></div>
    </section>
  );
};

export default Hero;
