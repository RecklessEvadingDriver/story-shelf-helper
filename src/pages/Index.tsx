import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import { useSearchBooks } from "@/services/bookApi";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: books, isLoading } = useSearchBooks("bestseller");

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Books</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.slice(0, 8).map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;