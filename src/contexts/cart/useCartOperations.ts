import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useCartOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const saveCartToDatabase = async (items: CartItem[]) => {
    if (!user) return;

    try {
      // Get or create pending order
      let { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      if (!order) {
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({ 
            user_id: user.id,
            total_amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          })
          .select()
          .single();

        if (orderError) throw orderError;
        order = newOrder;
      }

      if (order) {
        // Delete existing items
        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", order.id);

        // Insert new items
        if (items.length > 0) {
          const orderItems = items.map(item => ({
            order_id: order.id,
            book_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

          if (itemsError) throw itemsError;

          // Update order total
          await supabase
            .from("orders")
            .update({ 
              total_amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              updated_at: new Date().toISOString()
            })
            .eq("id", order.id);
        }
      }
    } catch (error) {
      console.error("Error saving cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save cart to database",
      });
    }
  };

  const loadCartFromDatabase = async () => {
    if (!user) return null;

    try {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      if (orderData) {
        const { data: items } = await supabase
          .from("order_items")
          .select(`
            quantity,
            price_at_time,
            books (
              id,
              title,
              author,
              price,
              cover_image
            )
          `)
          .eq("order_id", orderData.id);

        if (items) {
          return items.map(item => ({
            id: item.books.id,
            title: item.books.title,
            author: item.books.author,
            price: item.price_at_time,
            cover_image: item.books.cover_image,
            quantity: item.quantity,
          }));
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart from database",
      });
    }
    return null;
  };

  return { saveCartToDatabase, loadCartFromDatabase };
};