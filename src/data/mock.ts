// Property status types
export type PropertyStatus = "Available" | "Sale Agreed" | "Sold";

// Offer status types
export type OfferStatus = "Pending" | "Accepted" | "Rejected";

// Contact role types
export type ContactRole = "Vendor" | "Buyer";

export interface Property {
  id: string;
  address: string;
  price: number;
  status: PropertyStatus;
  listedDate: string;
  imageUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  email: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  contactId: string;
  amount: number;
  status: OfferStatus;
}

export const properties: Property[] = [
  {
    id: "prop-1",
    address: "12 Kensington Gardens, London W8 4PE",
    price: 1250000,
    status: "Available",
    listedDate: "2023-10-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-2",
    address: "45 Victoria Road, Manchester M20 3FH",
    price: 385000,
    status: "Sale Agreed",
    listedDate: "2023-11-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-3",
    address: "8 Castle Street, Edinburgh EH2 3AH",
    price: 475000,
    status: "Available",
    listedDate: "2023-09-15T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-4",
    address: "27 Queen's Parade, Bath BA1 2NJ",
    price: 695000,
    status: "Sold",
    listedDate: "2023-07-20T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-6",
    address: "91 Park Lane, Leeds LS1 5HD",
    price: 215000,
    status: "Available",
    listedDate: "2024-02-14T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-7",
    address: "14 The Crescent, Brighton BN1 3FN",
    price: 550000,
    status: "Sale Agreed",
    listedDate: "2023-12-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-8",
    address: "56 Riverside Walk, Cambridge CB5 8AQ",
    price: 890000,
    status: "Available",
    listedDate: "2024-03-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-9",
    address: "22 Oak Avenue, Oxford OX2 7DG",
    price: 725000,
    status: "Sold",
    listedDate: "2023-06-18T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-10",
    address: "7 Waterfront Place, Liverpool L3 1BY",
    price: 195000,
    status: "Available",
    listedDate: "2024-01-22T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-11",
    address: "33 Cathedral Close, York YO1 7HH",
    price: 430000,
    status: "Available",
    listedDate: "2023-08-30T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-12",
    address: "18 Marine Terrace, Whitby YO21 3PR",
    price: 280000,
    status: "Sale Agreed",
    listedDate: "2023-10-25T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
];

export const contacts: Contact[] = [
  { id: "contact-1", name: "James Whitfield", role: "Vendor", email: "j.whitfield@email.com" },
  { id: "contact-2", name: "Sarah Chen", role: "Buyer", email: "sarah.chen@email.com" },
  { id: "contact-3", name: "Michael Torres", role: "Buyer", email: "m.torres@email.com" },
  { id: "contact-4", name: "Emma Richardson", role: "Vendor", email: "emma.r@email.com" },
  { id: "contact-5", name: "David Okonkwo", role: "Buyer", email: "d.okonkwo@email.com" },
  { id: "contact-6", name: "Helen Murray", role: "Vendor", email: "helen.murray@email.com" },
  { id: "contact-7", name: "Raj Patel", role: "Buyer", email: "raj.patel@email.com" },
  { id: "contact-8", name: "Fiona Gallagher", role: "Vendor", email: "fiona.g@email.com" },
  { id: "contact-9", name: "Tom Bradley", role: "Buyer", email: "tom.b@email.com" },
  { id: "contact-10", name: "Lucy Watts", role: "Buyer", email: "lucy.watts@email.com" },
  { id: "contact-11", name: "Andrew Fletcher", role: "Vendor", email: "a.fletcher@email.com" },
  { id: "contact-12", name: "Nina Rossi", role: "Buyer", email: "nina.rossi@email.com" },
  { id: "contact-13", name: "George Palmer", role: "Vendor", email: "g.palmer@email.com" },
  { id: "contact-14", name: "Charlotte Dunn", role: "Buyer", email: "c.dunn@email.com" },
  { id: "contact-15", name: "Oliver Marsh", role: "Vendor", email: "o.marsh@email.com" },
  { id: "contact-16", name: "Priya Sharma", role: "Buyer", email: "priya.s@email.com" },
  { id: "contact-17", name: "William Grant", role: "Vendor", email: "w.grant@email.com" },
  { id: "contact-18", name: "Amy Liang", role: "Buyer", email: "amy.liang@email.com" },
  { id: "contact-19", name: "Catherine Bell", role: "Vendor", email: "c.bell@email.com" },
  { id: "contact-20", name: "Marcus Huang", role: "Buyer", email: "m.huang@email.com" },
  { id: "contact-21", name: "Diane Foster", role: "Vendor", email: "d.foster@email.com" },
  { id: "contact-22", name: "Ryan Doyle", role: "Buyer", email: "r.doyle@email.com" },
  { id: "contact-23", name: "Sandra Kowalski", role: "Vendor", email: "s.kowalski@email.com" },
  { id: "contact-24", name: "Ben Archer", role: "Buyer", email: "b.archer@email.com" },
  { id: "contact-25", name: "Peter Rowland", role: "Vendor", email: "p.rowland@email.com" },
  { id: "contact-26", name: "Lisa Jennings", role: "Buyer", email: "l.jennings@email.com" },
];

export const offers: Offer[] = [
  { id: "offer-1", propertyId: "prop-1", contactId: "contact-2", amount: 1200000, status: "Rejected" },
  { id: "offer-2", propertyId: "prop-1", contactId: "contact-2", amount: 1230000, status: "Pending" },
  { id: "offer-3", propertyId: "prop-1", contactId: "contact-3", amount: 1250000, status: "Pending" },
  { id: "offer-4", propertyId: "prop-2", contactId: "contact-5", amount: 370000, status: "Rejected" },
  { id: "offer-5", propertyId: "prop-2", contactId: "contact-5", amount: 382000, status: "Accepted" },
  { id: "offer-6", propertyId: "prop-3", contactId: "contact-7", amount: 450000, status: "Pending" },
  { id: "offer-7", propertyId: "prop-4", contactId: "contact-9", amount: 660000, status: "Rejected" },
  { id: "offer-8", propertyId: "prop-4", contactId: "contact-10", amount: 690000, status: "Accepted" },
  { id: "offer-9", propertyId: "prop-4", contactId: "contact-9", amount: 685000, status: "Rejected" },
  { id: "offer-10", propertyId: "prop-5", contactId: "contact-12", amount: 310000, status: "Pending" },
  { id: "offer-11", propertyId: "prop-6", contactId: "contact-14", amount: 200000, status: "Rejected" },
  { id: "offer-12", propertyId: "prop-6", contactId: "contact-14", amount: 210000, status: "Pending" },
  { id: "offer-13", propertyId: "prop-7", contactId: "contact-16", amount: 530000, status: "Rejected" },
  { id: "offer-14", propertyId: "prop-7", contactId: "contact-16", amount: 545000, status: "Accepted" },
  { id: "offer-15", propertyId: "prop-8", contactId: "contact-18", amount: 850000, status: "Pending" },
  { id: "offer-16", propertyId: "prop-9", contactId: "contact-20", amount: 700000, status: "Rejected" },
  { id: "offer-17", propertyId: "prop-9", contactId: "contact-20", amount: 720000, status: "Accepted" },
  { id: "offer-18", propertyId: "prop-10", contactId: "contact-22", amount: 185000, status: "Pending" },
  { id: "offer-19", propertyId: "prop-11", contactId: "contact-24", amount: 415000, status: "Pending" },
  { id: "offer-20", propertyId: "prop-12", contactId: "contact-26", amount: 270000, status: "Accepted" },
];
