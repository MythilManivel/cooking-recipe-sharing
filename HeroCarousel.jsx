import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = ({ user }) => {
  const foodImages = [
    {
      url: "https://wallpapers.com/images/hd/food-4k-spdnpz7bhmx4kv2r.jpg",
      title: "Delicious Cuisines",
      subtitle: "Explore flavors from around the world"
    },
    {
      url: "https://wallpapers.com/images/hd/food-4k-m37wpodzrcbv5gvw.jpg",
      title: "Fresh Ingredients",
      subtitle: "Quality ingredients for perfect recipes"
    },
    {
      url: "https://www.tastingtable.com/img/gallery/the-ingredients-youre-unlikely-to-find-in-traditional-indian-food/l-intro-1663259170.jpg",
      title: "Traditional Spices",
      subtitle: "Authentic flavors and aromatic spices"
    },
    {
      url: "https://static.vecteezy.com/system/resources/previews/035/375/552/large_2x/ai-generated-chicken-biryani-kerala-style-chicken-dhum-biriyani-made-using-jeera-rice-and-spices-arranged-in-a-brass-serving-bowl-photo.jpg",
      title: "Signature Dishes",
      subtitle: "Master the art of cooking signature meals"
    },
    {
      url: "https://1.bp.blogspot.com/-dmr7TvaMJ7c/WRyLh1RZjlI/AAAAAAAAIF4/uPHo3WFtctE8ZS34-s0mkRyNRkU-2-SzgCLcB/s1600/0000000000000000000000A%2B%25281%2529.jpg",
      title: "Sweet Treats",
      subtitle: "Indulge in delightful desserts and sweets"
    },
    {
      url: "http://www.afarmgirlsdabbles.com/wp-content/uploads/2016/06/Layered-Chocolate-Pudding-Dessert-with-Salted-Pecan-Crust_AFarmgirlsDabbles_AFD-5-square2.jpg",
      title: "Decadent Desserts",
      subtitle: "Create memorable dessert experiences"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % foodImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, foodImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % foodImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + foodImages.length) % foodImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {foodImages.map((image, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={image.url} alt={image.title} />
            <div className="carousel-overlay">
              <div className="carousel-content">
                <h1>🍳 Recipe Share</h1>
                <h2>{image.title}</h2>
                <p>{image.subtitle}</p>
                {!user && (
                  <div className="hero-buttons">
                    <Link to="/login" className="btn btn-primary">Get Started</Link>
                    <Link to="/signup" className="btn btn-secondary">Join Community</Link>
                  </div>
                )}
                {user && (
                  <div className="hero-buttons">
                    <Link to="/dashboard" className="btn btn-primary">My Recipes</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-nav prev" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="carousel-nav next" onClick={nextSlide}>
        &#8250;
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {foodImages.map((_, index) => (
          <button 
            key={index} 
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="carousel-progress">
        <div 
          className="progress-bar"
          style={{ 
            width: `${((currentSlide + 1) / foodImages.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;
