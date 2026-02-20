const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function PriceTag({ price }: { price: any }) {
  return (
    <p className="text-2xl font-bold text-green-700 mt-1">
      {price}
    </p>
  );
}

function PropertyInfo({
  address,
  price,
  listedDate,
}: {
  address: any;
  price: any;
  listedDate: any;
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-900 truncate">{address}</h3>
      <PriceTag price={price} />
      <p className="text-xs text-gray-400 mt-1">Listed: {listedDate}</p>
    </div>
  );
}

function PropertyCardContent({
  address,
  price,
  status,
  listedDate,
  offerCount,
  isLoadingOffers,
  propertyId,
}: {
  address: any;
  price: any;
  status: any;
  listedDate: any;
  offerCount: any;
  isLoadingOffers: any;
  propertyId: any;
}) {
  const getStatusColor = (s: any) => {
    if (s === "Available") return "bg-green-100 text-green-800";
    if (s === "Sale Agreed") return "bg-yellow-100 text-yellow-800";
    if (s === "Sold") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <a href={`/property/${propertyId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">🏠</span>
        </div>
        <div className="p-4">
          <PropertyInfo address={address} price={price} listedDate={listedDate} />
          <div className="flex justify-between items-center mt-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
              {status}
            </span>
            {isLoadingOffers ? (
              <span className="text-gray-400 text-sm">Loading offers...</span>
            ) : (
              <span className="text-sm text-gray-600">
                {offerCount} offer{offerCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function PropertyCard({
  property,
  offerCount,
}: {
  property: any;
  offerCount: number;
}) {
  return (
    <PropertyCardContent
      address={property.address}
      price={property.price}
      status={property.status}
      listedDate={property.listedDate}
      offerCount={offerCount}
      isLoadingOffers={false}
      propertyId={property.id}
    />
  );
}
