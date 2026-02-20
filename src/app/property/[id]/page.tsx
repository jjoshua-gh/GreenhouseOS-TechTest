"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function PriceDisplay({ price }: { price: any }) {
  return (
    <p className="text-3xl font-bold text-green-700 mt-2">
      {price}
    </p>
  );
}

function PropertyHeader({
  address,
  price,
  status,
  listedDate,
}: {
  address: any;
  price: any;
  status: any;
  listedDate: any;
}) {
  const getStatusColor = (s: any) => {
    if (s === "Available") return "bg-green-100 text-green-800";
    if (s === "Sale Agreed") return "bg-yellow-100 text-yellow-800";
    if (s === "Sold") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{address}</h1>
          <PriceDisplay price={price} />
          <p className="text-sm text-gray-400 mt-2">Listed: {listedDate}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function OfferRow({
  amount,
  status,
}: {
  amount: any;
  status: any;
}) {
  const getStatusColor = (s: any) => {
    if (s === "Accepted") return "bg-green-100 text-green-800";
    if (s === "Rejected") return "bg-red-100 text-red-800";
    if (s === "Pending") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900">{amount}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: any;
}) {
  const [property, setProperty] = useState<any>(null);
  const [offers, setOffers] = useState<any>([]);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch property and offers in parallel
      const [propertyRes, offersRes] = await Promise.all([
        fetch(`${API_URL}/api/properties/${params.id}`),
        fetch(`${API_URL}/api/offers?propertyId=${params.id}`)
      ]);
      
      const [propertyData, offersData] = await Promise.all([
        propertyRes.json(),
        offersRes.json()
      ]);
      
      setProperty(propertyData);
      setOffers(offersData);
      setLoadingProperty(false);
      setLoadingOffers(false);
    };

    fetchData();
  }, [params.id]);

  if (loadingProperty) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <a
        href="/"
        className="text-green-700 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to Properties
      </a>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-200 h-72 flex items-center justify-center">
          <span className="text-gray-400 text-6xl">🏠</span>
        </div>
        <PropertyHeader
          address={property.address}
          price={property.price}
          status={property.status}
          listedDate={property.listedDate}
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Offers</h2>
        {loadingOffers ? (
          <p className="text-gray-400 py-4">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-400 py-4">No offers yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer: any) => (
                <OfferRow
                  key={offer.id}
                  amount={offer.amount}
                  status={offer.status}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
