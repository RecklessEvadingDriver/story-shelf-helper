import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  cover_image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }
    case "REMOVE_ITEM": {
      const item = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item ? item.price * item.quantity : 0),
      };
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }
    case "CLEAR_CART":
      return { items: [], total: 0 };
    case "SET_CART":
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { toast } = useToast();
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user?.id)
        .eq("status", "pending")
        .single();

      if (orderData) {
        const { data: items } = await supabase
          .from("order_items")
          .select(`
            book_id,
            quantity,
            book:books (
              id,
              title,
              author,
              price,
              cover_image
            )
          `)
          .eq("order_id", orderData.id);

        if (items) {
          const cartItems = items.map(item => ({
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: item.book.price,
            cover_image: item.book.cover_image,
            quantity: item.quantity,
          }));
          dispatch({ type: "SET_CART", payload: cartItems });
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
    });

    if (user) {
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
          // Add item to order
          await supabase.from("order_items").upsert({
            order_id: order.id,
            book_id: item.id,
            quantity: 1,
            price_at_time: item.price,
          });
        }
      } catch (error) {
        console.error("Error saving to cart:", error);
      }
    }
  };

  const removeItem = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });

    if (user) {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .single();

        if (order) {
          await supabase
            .from("order_items")
            .delete()
            .eq("order_id", order.id)
            .eq("book_id", id);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

    if (user) {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .single();

        if (order) {
          await supabase
            .from("order_items")
            .update({ quantity })
            .eq("order_id", order.id)
            .eq("book_id", id);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};