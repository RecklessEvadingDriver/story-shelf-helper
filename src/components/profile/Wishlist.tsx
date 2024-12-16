import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type WishlistItem = Database['public']['Tables']['wishlists']['Row'] & {
  books: Database['public']['Tables']['books']['Row']
};

export const Wishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          books:books (*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user?.id,
  });

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user?.id)
        .eq('book_id', bookId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading wishlist...</div>;
  }

  if (!wishlistItems?.length) {
    return (
      <Card className="p-8 text-center">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground mb-4">
          Start adding books you'd like to read in the future!
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Browse Books
        </Button>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={item.books.cover_image || '/placeholder.svg'}
                alt={item.books.title}
                className="h-16 w-12 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.books.title}</h3>
                <p className="text-sm text-muted-foreground">
                  ${item.books.price}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="text-destructive"
                onClick={() => handleRemoveFromWishlist(item.books.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};