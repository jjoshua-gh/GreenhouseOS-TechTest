import { NextResponse } from "next/server";
import { properties, contacts, offers } from "@/data/mock";

export async function GET() {
  // Return properties directly without enrichment
  // Clients can fetch offers separately and calculate counts as needed
  return NextResponse.json(properties);
}
