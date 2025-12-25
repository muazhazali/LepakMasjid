import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Mosque } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAmenities } from '@/hooks/use-amenities';
import { useLanguageStore } from '@/stores/language';

interface MosqueCardProps {
  mosque: Mosque;
  onClick?: () => void;
}

const MosqueCard = ({ mosque, onClick }: MosqueCardProps) => {
  const { language } = useLanguageStore();
  const { data: allAmenities } = useAmenities();
  
  // For now, we'll show a simplified version
  // In the full implementation, we'd fetch mosque_amenities relation
  const displayName = language === 'bm' && mosque.name_bm ? mosque.name_bm : mosque.name;
  const displayDescription = language === 'bm' && mosque.description_bm 
    ? mosque.description_bm 
    : mosque.description;

  return (
    <Link to={`/mosque/${mosque.id}`} onClick={onClick}>
      <article
        className="card-elevated p-5 cursor-pointer group transition-all duration-300 hover:-translate-y-1"
        role="button"
        tabIndex={0}
        aria-label={`View details for ${displayName}`}
      >
        {/* Image placeholder with gradient */}
        <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
          {/* State badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
          >
            {mosque.state.replace('Wilayah Persekutuan ', 'WP ')}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {displayName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {mosque.address}
            </p>
          </div>

          {/* Description */}
          {displayDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {displayDescription}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default MosqueCard;
