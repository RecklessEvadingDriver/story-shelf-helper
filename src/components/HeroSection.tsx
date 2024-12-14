import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-primary"> Favorite Book</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Explore our vast collection of books across all genres. From bestsellers to rare finds,
            we have something for every reader.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/books")}
              className="text-lg"
            >
              Browse Books
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=New")}
              className="text-lg"
            >
              New Arrivals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};