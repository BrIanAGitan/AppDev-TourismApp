
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

interface AttractionCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  category: string;
}

const AttractionCard = ({
  id,
  title,
  description,
  image,
  location,
  rating,
  category,
}: AttractionCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-cdo-gold text-cdo-gold mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location}</span>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link to={`/attraction/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttractionCard;
