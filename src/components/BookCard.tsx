import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardContent className="p-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-muted-foreground">{author}</p>
          <p className="text-primary font-bold mt-2">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => navigate(`/book/${id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};