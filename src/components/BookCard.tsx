import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
}

export const BookCard = ({ id, title, author, price, imageUrl }: BookCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group animate-fadeIn bg-card dark:bg-card/95 dark:border-accent/20">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 dark:bg-accent dark:text-accent-foreground"
              onClick={() => navigate(`/book/${id}`)}
            >
              Quick View
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors cursor-pointer text-foreground dark:text-foreground/90" onClick={() => navigate(`/book/${id}`)}>
            {title}
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground/80">{author}</p>
          <p className="text-primary font-bold mt-2 dark:text-primary/90">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors dark:border-accent/20"
          variant="outline"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};