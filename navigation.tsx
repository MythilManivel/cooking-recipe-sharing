import { Link, useLocation } from "wouter";
import { Search, Plus, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export default function Navigation({ onSearch }: NavigationProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <h1 className="text-2xl font-bold text-recipe-orange cursor-pointer">
                🍳 RecipeShare
              </h1>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search recipes, ingredients, or chefs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" data-testid="link-browse">
              <span className={`cursor-pointer transition-colors ${
                location === "/" ? "text-recipe-orange" : "text-recipe-gray hover:text-recipe-orange"
              }`}>
                Browse
              </span>
            </Link>
            <span className="text-recipe-gray hover:text-recipe-orange transition-colors cursor-pointer">
              Categories
            </span>
            <span className="text-recipe-gray hover:text-recipe-orange transition-colors cursor-pointer">
              My Recipes
            </span>
            <Link href="/create" data-testid="button-create-recipe">
              <Button className="bg-recipe-orange text-white hover:bg-orange-600 rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Recipe
              </Button>
            </Link>
            <div className="w-8 h-8 bg-recipe-green rounded-full flex items-center justify-center cursor-pointer" data-testid="button-profile">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full"
                  data-testid="input-search-mobile"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
              
              <Link href="/" data-testid="link-browse-mobile">
                <span className="block py-2 text-recipe-gray">Browse</span>
              </Link>
              <span className="block py-2 text-recipe-gray">Categories</span>
              <span className="block py-2 text-recipe-gray">My Recipes</span>
              <Link href="/create" data-testid="button-create-recipe-mobile">
                <Button className="w-full bg-recipe-orange text-white hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Recipe
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
