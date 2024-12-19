import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  rating: number | null;
  review_text: string | null;
}

interface ReviewsListProps {
  reviews: Review[] | null;
  isLoading: boolean;
}

export const ReviewsList = ({ reviews, isLoading }: ReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!reviews?.length) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
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
  );
};