import { NextResponse } from "next/server";
import { offers, Offer } from "@/data/mock";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (propertyId) {
    const filtered = offers.filter((o: Offer) => o.propertyId === propertyId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(offers);
}
