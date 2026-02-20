# GreenHouse Property Portal

A modern property management portal built with Next.js 14, React, and TypeScript. This application provides a user-friendly interface for browsing properties, viewing detailed information, and managing offers.

## Project Overview

The GreenHouse Property Portal is a full-stack application designed to streamline property discovery and offer management. The frontend is built with Next.js 14 and styled with Tailwind CSS, while the backend API routes handle all data operations.

### Key Features

- **Property Listings** — Browse all available properties with key details (price, location, status)
- **Property Details** — View comprehensive information about individual properties
- **Offer Management** — Track and manage offers on properties
- **Contact Management** — Store and manage contact information for buyers and sellers
- **Responsive Design** — Works seamlessly on desktop and mobile devices

### Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Runtime:** Node.js 18+

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with property listings
│   ├── layout.tsx                  # Root layout wrapper
│   ├── globals.css                 # Global styles
│   ├── components/
│   │   └── PropertyCard.tsx         # Reusable property card component
│   ├── property/
│   │   └── [id]/page.tsx            # Individual property detail page
│   └── api/
│       ├── properties/route.ts      # GET /api/properties
│       ├── offers/route.ts          # GET /api/offers
│       ├── contacts/route.ts        # GET /api/contacts
│       └── [id]/route.ts            # Individual property endpoints
└── data/
    └── mock.ts                      # Mock data and TypeScript interfaces
```

## Setup

Install all dependencies:

```bash
npm install
```

### Environment Configuration

Copy the example environment file and configure for your environment:

```bash
cp .env.example .env.local
```

The `.env.local` file contains:
- `NEXT_PUBLIC_API_URL` - Base URL for API requests (defaults to `http://localhost:3000`)

For production deployment, set `NEXT_PUBLIC_API_URL` to your production domain.

**Note:** `.env.local` is gitignored and never committed. Only `.env.example` should be committed as a template.

## Running

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Commands

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build for production
- `npm run start` — Run production server
- `npm run lint` — Run ESLint code quality checks

## Notes

This is a prototype implementation. The data is currently mocked in `src/data/mock.ts` and served through API routes. The application is fully functional but may benefit from further optimization and refinement for production use.

## Activity Log
model used throughout test - Sonnet 4.5 in vscode copilot
### Initial 
I ran the commands to start the app - noting the 15 high vulnerabilities reported from the node packages installed. 
I have opened the network tab and noted what appears to be a separate fetch request for every property card retrieved on the landing page.

### Phase 1 
1. Asked copilot to read this README and understand the repo, and then generate an instructions.md to provide context to the chats. No changes made to instructions. 
With agent in planning mode: 
Started with this prompt "The app is sluggish. You'll find requests that could be parallelised. Identify the root cause and fix it."
To reduce API calls I've told it to use the offer count from the metadata in the API request that property card makes, instead of making a separate request and told it to parallelize all fetches.
We agreed on these steps to reduce unneeded API calls, and perform the remaining calls in parallel where possible:
    Steps

    Modify PropertyCard to accept offer count as prop

    In PropertyCard.tsx, remove the useEffect that fetches offers (lines ~93-101)
    Remove offerCount and isLoadingOffers state variables
    Add offerCount: number as a prop to the PropertyCard component
    Remove the "use client" directive (no longer needs client-side state)
    Display the prop value directly instead of loading state
    Update homepage to fetch all offers once

    In page.tsx, add a second fetch for all offers using Promise.all() to parallelize with properties fetch
    Create a Map/object to count offers per property ID
    Pass the calculated offer count to each PropertyCard via props
    Result: 2 parallel requests instead of 12 sequential requests
    Parallelize property detail page fetches

    In src/app/property/[id]/page.tsx, replace sequential fetches with Promise.all([fetch(...), fetch(...)])
    Destructure both responses simultaneously
    Handle both JSON parsing in parallel
    Result: Cuts detail page load time in half
    Remove unused API enrichment (optional cleanup)

    In route.ts:6-20, remove the enrichment loop that adds _metadata since it's no longer needed
    Return the raw properties array directly
    Simplifies API and reduces server CPU usage

I can now verify much fewer queries in the network tab and they are in parallel.

2. This prompt: 
API keys and configuration values are hardcoded in the source. Move these to environment
variables using standard Next.js conventions (NEXT_PUBLIC_ prefixes where appropriate).
Make sure nothing sensitive is committed to the repo.

It did not add any API keys to the env variables, nor could it find any, so I am assuming there are none.
It did add a local connection URL which makes sense so it can be swapped out in production

3. This prompt:
Please tighten the type declarations throughout this project and update the tsconfig with good standards to avoid things like using the 'any' type. Where applicable, define new types that accurately describe the structure of data passed

All initial changes seem reasonable - removes usage of the 'any' type and declare strict types, new interface types or union types where only specific string values are allowed to be even stricter than the 'String' type. Changes make to
ts.congif also seem reasonable.
