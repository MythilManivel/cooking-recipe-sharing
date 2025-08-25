import { Button } from "@/components/ui/button";
import { Flame, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing Recipes
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Share your culinary creations with food lovers worldwide
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {/* Explore Recipes Button */}
            <Button 
              className="bg-white text-black hover:bg-orange-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
              data-testid="button-explore-recipes"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Explore Recipes</span>
            </Button>

            {/* Join Community Button */}
            <Button 
              variant="outline"
              className="bg-white text-black hover:bg-orange-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
              data-testid="button-join-community"
            >
              <Users className="w-5 h-5" />
              <span>Join Community</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
