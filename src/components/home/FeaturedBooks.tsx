import { useSearchBooks } from "@/services/bookApi";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedBooks = () => {
  const { data: books, isLoading } = useSearchBooks("bestseller");
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Button
            variant="ghost"
            className="group"
            onClick={() => navigate("/books")}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.slice(0, 4).map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};