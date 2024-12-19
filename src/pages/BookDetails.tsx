import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["book-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (
            id
          )
        `)
        .eq("book_id", id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedBooks, isLoading: relatedLoading } = useQuery({
    queryKey: ["related-books", book?.category],
    enabled: !!book,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("category", book.category)
        .neq("id", id)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const { error } = await supabase
        .from("wishlists")
        .insert([{ user_id: user.id, book_id: id }]);

      if (error) throw error;

      toast({
        title: "Added to wishlist",
        description: "The book has been added to your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book to wishlist",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
      </div>
    );
  }

  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <img
            src={book.cover_image || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-muted-foreground">
              ({reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-primary">${book.price.toFixed(2)}</p>

          <p className="text-lg leading-relaxed">
            {book.description || "No description available."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="flex-1 sm:flex-none">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className="flex-1 sm:flex-none"
            >
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Customer Reviews</h2>
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24 w-full" />
            ))}
          </div>
        ) : reviews?.length ? (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card p-6 rounded-lg shadow-sm space-y-3"
              >
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (review.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg">{review.review_text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </section>

      {/* Related Books Section */}
      {!relatedLoading && relatedBooks?.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Related Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetails;