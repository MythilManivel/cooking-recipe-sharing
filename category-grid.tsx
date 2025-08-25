import { Coffee, Leaf, UtensilsCrossed, IceCream } from "lucide-react";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const categories = [
    {
      name: "Breakfast",
      icon: Coffee,
      count: 245,
      gradient: "from-recipe-yellow to-orange-400",
      category: "breakfast"
    },
    {
      name: "Lunch",
      icon: Leaf,
      count: 312,
      gradient: "from-recipe-green to-green-600",
      category: "lunch"
    },
    {
      name: "Dinner",
      icon: UtensilsCrossed,
      count: 428,
      gradient: "from-recipe-orange to-red-500",
      category: "dinner"
    },
    {
      name: "Dessert",
      icon: IceCream,
      count: 189,
      gradient: "from-pink-400 to-recipe-red",
      category: "dessert"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-8 text-recipe-gray">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="text-center group cursor-pointer"
              onClick={() => onCategoryClick?.(category.category)}
              data-testid={`category-${category.category}`}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <category.icon className="text-white text-2xl w-8 h-8" />
              </div>
              <h4 className="font-semibold text-recipe-gray group-hover:text-recipe-orange transition-colors">
                {category.name}
              </h4>
              <p className="text-sm text-gray-500" data-testid={`text-recipe-count-${category.category}`}>
                {category.count} recipes
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
