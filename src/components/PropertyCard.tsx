import { Link } from 'react-router-dom';
import { urlForImage } from '../lib/imageUrl';
import type { Property } from '../types';

export default function PropertyCard({ property }: { property: Property }) {
    const coverImage = property.images?.[0];

    return (
        <Link
            to={`/opportunites/${property.slug.current}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
        >
            <div className="aspect-[4/3] bg-camvie-gray-100 overflow-hidden">
                {coverImage ? (
                    <img
                        src={urlForImage(coverImage).width(600).height(450).url()}
                        alt={coverImage.alt || property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-camvie-gray-800 text-sm">
                        Photo à venir
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-camvie-gray-800 uppercase tracking-wide">
                        {property.reference}
                    </span>
                    {property.is_featured && (
                        <span className="text-xs bg-camvie-red text-white px-2 py-1 rounded">
                            À la une
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-heading font-bold text-camvie-green mb-1 line-clamp-2">
                    {property.title}
                </h3>

                <p className="text-sm text-camvie-gray-800 mb-3">
                    {property.location || 'Localisation non précisée'}
                    {property.area ? ` • ${property.area} m²` : ''}
                </p>

                <div className="mt-auto pt-3 border-t border-camvie-gray-100">
                    <p className="text-base font-semibold text-camvie-green">
                        {property.price
                            ? `${property.price.toLocaleString('fr-FR')} FCFA`
                            : 'Prix sur demande'}
                    </p>
                </div>
            </div>
        </Link>
    );
}