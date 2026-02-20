"use client";

import { useState, useEffect } from "react";
import PropertyCard from "./components/PropertyCard";

const API_URL = "http://localhost:3000";

export default function HomePage() {
  const [properties, setProperties] = useState<any>([]);
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch properties and offers in parallel
      const [propertiesRes, offersRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`),
        fetch(`${API_URL}/api/offers`)
      ]);
      
      const [propertiesData, offersData] = await Promise.all([
        propertiesRes.json(),
        offersRes.json()
      ]);
      
      // Calculate offer counts per property
      const counts: Record<string, number> = {};
      offersData.forEach((offer: any) => {
        counts[offer.propertyId] = (counts[offer.propertyId] || 0) + 1;
      });
      
      setProperties(propertiesData);
      setOfferCounts(counts);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 mt-1">
          Showing {properties.length} properties
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: any) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            offerCount={offerCounts[property.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
