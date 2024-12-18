import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
  id: string;
  book_id: string;
  quantity: number;
  book: {
    title: string;
    price: number;
    cover_image: string;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'pending')
        .single();

      if (orderError && orderError.code !== 'PGRST116') {
        throw orderError;
      }

      if (orderData) {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            book_id,
            quantity,
            book:books (
              title,
              price,
              cover_image
            )
          `)
          .eq('order_id', orderData.id);

        if (itemsError) throw itemsError;
        setCartItems(items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const { error } = await supabase
        .from('order_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const checkout = async () => {
    try {
      // In a real application, you would:
      // 1. Integrate with a payment processor
      // 2. Create an order record
      // 3. Clear the cart
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Checkout failed');
    }
  };

  if (loading) {
    return <div className="text-center">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Button onClick={() => navigate('/books')}>Browse Books</Button>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-card rounded-lg shadow"
          >
            <img
              src={item.book.cover_image || '/placeholder.svg'}
              alt={item.book.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.book.title}</h3>
              <p className="text-muted-foreground">
                ${item.book.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-card rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-bold">${total.toFixed(2)}</span>
        </div>
        <Button onClick={checkout} className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;