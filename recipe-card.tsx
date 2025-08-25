import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (recipeId: string) => void;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, onFavoriteToggle, isFavorite = false }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-recipe-orange";
      case "medium":
        return "bg-recipe-yellow";
      case "hard":
        return "bg-recipe-red";
      default:
        return "bg-gray-500";
    }
  };

  const getAuthorInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAuthorColor = (name: string) => {
    const colors = ["bg-recipe-green", "bg-recipe-orange", "bg-recipe-red", "bg-pink-500"];
    return colors[name.length % colors.length];
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer" data-testid={`card-recipe-${recipe.id}`}>
      <div className="relative">
        <img 
          src={recipe.image || "https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"} 
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-recipe-${recipe.id}`}
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full shadow-md transition-colors ${
            isFavorite ? "bg-recipe-red text-white hover:bg-red-600" : "bg-white hover:bg-recipe-red hover:text-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onFavoriteToggle?.(recipe.id);
          }}
          data-testid={`button-favorite-${recipe.id}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <div className={`absolute bottom-3 left-3 ${getDifficultyColor(recipe.difficulty)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
          {recipe.difficulty}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-lg mb-2 text-recipe-gray" data-testid={`text-recipe-title-${recipe.id}`}>
          {recipe.title}
        </h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid={`text-recipe-description-${recipe.id}`}>
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="text-recipe-yellow text-sm w-4 h-4 fill-current" />
            <span className="text-sm font-medium" data-testid={`text-recipe-rating-${recipe.id}`}>
              {recipe.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs text-gray-500" data-testid={`text-recipe-reviews-${recipe.id}`}>
              ({recipe.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span data-testid={`text-recipe-cook-time-${recipe.id}`}>
              <Clock className="w-3 h-3 mr-1 inline" />
              {recipe.cookTime}
            </span>
            <span data-testid={`text-recipe-servings-${recipe.id}`}>
              <Users className="w-3 h-3 mr-1 inline" />
              {recipe.servings}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 ${getAuthorColor(recipe.authorName)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">
                {getAuthorInitial(recipe.authorName)}
              </span>
            </div>
            <span className="text-sm text-gray-600" data-testid={`text-recipe-author-${recipe.id}`}>
              {recipe.authorName}
            </span>
          </div>
          <Link href={`/recipe/${recipe.id}`} data-testid={`link-view-recipe-${recipe.id}`}>
            <Button variant="ghost" className="text-recipe-orange hover:text-orange-600 text-sm font-medium p-0">
              View Recipe
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
