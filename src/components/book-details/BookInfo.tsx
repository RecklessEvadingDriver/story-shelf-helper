import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookApiResponse } from "@/services/bookApi";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookInfoProps {
  book: BookApiResponse;
  averageRating: number;
  reviewCount: number;
}

export const BookInfo = ({ book, averageRating, reviewCount }: BookInfoProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

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
        .insert([{ user_id: user.id, book_id: book.id }]);

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

  return (
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
          ({reviewCount} reviews)
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
  );
};