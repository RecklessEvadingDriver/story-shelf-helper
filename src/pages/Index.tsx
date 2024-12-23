import { HeroSection } from "@/components/HeroSection";
import { Categories } from "@/components/home/Categories";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Newsletter } from "@/components/home/Newsletter";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { PopularBooks } from "@/components/home/PopularBooks";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <HeroSection />
      <div className="space-y-0">
        <Categories />
        <FeaturedBooks />
        <PopularBooks />
        <RecentlyViewed />
        <Newsletter />
      </div>
    </motion.div>
  );
};

export default Index;