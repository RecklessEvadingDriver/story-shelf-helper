import { HeroSection } from "@/components/HeroSection";
import { Categories } from "@/components/home/Categories";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Newsletter } from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Categories />
      <FeaturedBooks />
      <Newsletter />
    </div>
  );
};

export default Index;