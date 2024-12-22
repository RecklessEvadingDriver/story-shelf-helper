import { HeroSection } from "@/components/HeroSection";
import { Categories } from "@/components/home/Categories";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Newsletter } from "@/components/home/Newsletter";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { PopularBooks } from "@/components/home/PopularBooks";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 space-y-16 py-8">
        <Categories />
        <FeaturedBooks />
        <PopularBooks />
        <RecentlyViewed />
        <Newsletter />
      </div>
    </div>
  );
};

export default Index;