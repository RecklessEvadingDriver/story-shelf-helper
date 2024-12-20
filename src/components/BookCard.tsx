import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  cover_image: string;
}

export const BookCard = ({ id, title, author, price, cover_image }: BookCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ id, title, author, price, cover_image });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`,
      duration: 3000,
    });
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-accent/20 bg-card dark:bg-card/95 dark:border-accent/20">
      <CardContent className="p-0">
        <div 
          className="relative overflow-hidden aspect-[3/4]"
          role="img"
          aria-label={`Cover of ${title}`}
        >
          <img
            src={cover_image}
            alt={`Cover of ${title} by ${author}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 dark:bg-accent dark:text-accent-foreground"
              onClick={() => navigate(`/book/${id}`)}
              aria-label={`View details of ${title}`}
            >
              Quick View
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 
            className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer text-foreground dark:text-foreground/90"
            onClick={() => navigate(`/book/${id}`)}
          >
            {title}
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground/80">{author}</p>
          <p className="text-primary font-bold dark:text-primary/90">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors dark:border-accent/20"
          variant="outline"
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};