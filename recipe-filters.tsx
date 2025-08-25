import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecipeFiltersProps {
  onFilterChange?: (filters: {
    difficulty?: string;
    cookTime?: string;
    diet?: string;
    sortBy?: string;
  }) => void;
}

export default function RecipeFilters({ onFilterChange }: RecipeFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  return (
    <section className="py-6 bg-gray-50 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-recipe-gray font-medium">Filter:</span>
            
            <Select onValueChange={(value) => handleFilterChange('difficulty', value)} data-testid="select-difficulty">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange('cookTime', value)} data-testid="select-cook-time">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Cook Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-30">Under 30 min</SelectItem>
                <SelectItem value="30-60">30-60 min</SelectItem>
                <SelectItem value="over-60">1+ hours</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange('diet', value)} data-testid="select-diet">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select onValueChange={(value) => handleFilterChange('sortBy', value)} data-testid="select-sort">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Most Popular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="quick">Quick & Easy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
