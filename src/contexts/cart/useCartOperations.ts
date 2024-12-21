import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./types";

export const useCartOperations = () => {
  const { user } = useAuth();

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
        const { data: newOrder } = await supabase
          .from("orders")
          .insert({ user_id: user.id })
          .select()
          .single();
        order = newOrder;
      }

      if (order) {
        // Update order items
        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", order.id);

        const orderItems = items.map(item => ({
          order_id: order.id,
          book_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price,
        }));

        await supabase.from("order_items").insert(orderItems);
      }
    } catch (error) {
      console.error("Error saving cart:", error);
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
            book_id,
            quantity,
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
            price: item.books.price,
            cover_image: item.books.cover_image,
            quantity: item.quantity,
          }));
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
    return null;
  };

  return { saveCartToDatabase, loadCartFromDatabase };
};