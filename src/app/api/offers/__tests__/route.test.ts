/**
 * @jest-environment node
 */

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: new Map([['content-type', 'application/json']]),
    }),
  },
}));

import { GET } from '../route';
import { offers } from '@/data/mock';

describe('GET /api/offers', () => {
  describe('Without Query Parameters', () => {
    it('should return all offers when no propertyId is provided', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(offers.length);
    });

    it('should return offers with correct structure', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((offer: any) => {
        expect(offer).toHaveProperty('id');
        expect(offer).toHaveProperty('propertyId');
        expect(offer).toHaveProperty('contactId');
        expect(offer).toHaveProperty('amount');
        expect(offer).toHaveProperty('status');
      });
    });

    it('should return all mock offers without modification', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      expect(data).toEqual(offers);
    });
  });

  describe('With Property ID Filter', () => {
    it('should return filtered offers when propertyId is provided', async () => {
      const request = new Request('http://localhost:3000/api/offers?propertyId=prop-1');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      data.forEach((offer: any) => {
        expect(offer.propertyId).toBe('prop-1');
      });
    });

    it('should return empty array when propertyId has no offers', async () => {
      const request = new Request('http://localhost:3000/api/offers?propertyId=non-existent');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('should correctly filter offers for different property IDs', async () => {
      // Get offers for prop-1
      const request1 = new Request('http://localhost:3000/api/offers?propertyId=prop-1');
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      // Get offers for prop-2
      const request2 = new Request('http://localhost:3000/api/offers?propertyId=prop-2');
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      // Ensure they return different results
      data1.forEach((offer: any) => {
        expect(offer.propertyId).toBe('prop-1');
      });
      
      data2.forEach((offer: any) => {
        expect(offer.propertyId).toBe('prop-2');
      });
    });

    it('should handle property IDs with no offers gracefully', async () => {
      const request = new Request('http://localhost:3000/api/offers?propertyId=prop-999');
      const response = await GET(request);
      const data = await response.json();
      
      expect(data).toEqual([]);
    });
  });

  describe('Response Format', () => {
    it('should return valid JSON structure', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should return offers with valid types', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((offer: any) => {
        expect(typeof offer.id).toBe('string');
        expect(typeof offer.propertyId).toBe('string');
        expect(typeof offer.contactId).toBe('string');
        expect(typeof offer.amount).toBe('number');
        expect(typeof offer.status).toBe('string');
      });
    });

    it('should return offers with valid status values', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      const validStatuses = ['Pending', 'Accepted', 'Rejected'];
      
      data.forEach((offer: any) => {
        expect(validStatuses).toContain(offer.status);
      });
    });

    it('should return offers with positive amounts', async () => {
      const request = new Request('http://localhost:3000/api/offers');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((offer: any) => {
        expect(offer.amount).toBeGreaterThan(0);
      });
    });
  });

  describe('Query Parameter Handling', () => {
    it('should ignore other query parameters', async () => {
      const request = new Request('http://localhost:3000/api/offers?other=value&propertyId=prop-1');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((offer: any) => {
        expect(offer.propertyId).toBe('prop-1');
      });
    });

    it('should handle encoded property IDs', async () => {
      const request = new Request('http://localhost:3000/api/offers?propertyId=prop%2D1');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should be case-sensitive for propertyId', async () => {
      const request = new Request('http://localhost:3000/api/offers?propertyId=PROP-1');
      const response = await GET(request);
      const data = await response.json();
      
      // Should not match 'prop-1' (case sensitive)
      expect(data.length).toBe(0);
    });
  });

  describe('Multiple Requests', () => {
    it('should handle multiple sequential requests', async () => {
      const request1 = new Request('http://localhost:3000/api/offers?propertyId=prop-1');
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      const request2 = new Request('http://localhost:3000/api/offers?propertyId=prop-2');
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(Array.isArray(data1)).toBe(true);
      expect(Array.isArray(data2)).toBe(true);
    });
  });
});
