import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Cagayan de Oro</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">The City of Golden Friendship</h2>
            <p className="text-gray-700 mb-4">
              Cagayan de Oro, affectionately known as CDO, is a highly urbanized city located in the Northern Mindanao region of the Philippines. The city earned its nickname "City of Golden Friendship" due to the warmth and hospitality of its people.
            </p>
            <p className="text-gray-700 mb-4">
              With a rich history dating back to pre-colonial times, CDO has evolved from a small settlement to a thriving metropolis while maintaining its cultural heritage and natural beauty.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Adventure Capital</h2>
            <p className="text-gray-700 mb-4">
              CDO is renowned as the Adventure Capital of the Philippines, featuring world-class white water rafting on the Cagayan de Oro River. The city's unique geography provides perfect conditions for various outdoor activities, from rafting and kayaking to hiking and zip-lining.
            </p>
            <img 
              src="/images/rafting.jpg" 
              alt="Adventure activities in CDO" 
              className="w-full rounded-lg mb-4"
            />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Natural Wonders</h2>
            <p className="text-gray-700 mb-4">
              The city is blessed with numerous natural attractions, including the Macahambus Cave and Gorge, offering spectacular views and unique geological formations. The surrounding areas feature lush forests, pristine waterfalls, and diverse wildlife.
            </p>
            <img 
              src="/images/cave.jpg" 
              alt="Natural attractions in CDO" 
              className="w-full rounded-lg mb-4"
            />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cultural Heritage</h2>
            <p className="text-gray-700 mb-4">
              CDO's cultural landscape is enriched by historical landmarks like the Divine Mercy Shrine and St. Augustine Cathedral. The city celebrates various festivals throughout the year, showcasing local traditions, music, and cuisine.
            </p>
            <img 
              src="/images/shrine.jpg" 
              alt="Cultural sites in CDO" 
              className="w-full rounded-lg mb-4"
            />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Modern Development</h2>
            <p className="text-gray-700 mb-4">
              Today, CDO stands as a major economic hub in Mindanao, with modern shopping malls, educational institutions, and business centers. Despite rapid urbanization, the city maintains a perfect balance between development and preservation of its natural and cultural heritage.
            </p>
          </div>

          {/* Cityscape Map Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cityscape Map</h2>
            <p className="text-gray-700 mb-4">
              Explore the vibrant cityscape of Cagayan de Oro. The city's layout showcases a blend of modern infrastructure and natural beauty, making it a unique destination for visitors and locals alike.
            </p>
            <img 
              src="/images/cityscape.jpg" 
              alt="Cityscape of Cagayan de Oro" 
              className="w-full rounded-lg mb-4"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;