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
import { contacts } from '@/data/mock';

describe('GET /api/contacts', () => {
  describe('Without Query Parameters', () => {
    it('should return all contacts when no propertyId is provided', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(contacts.length);
    });

    it('should return contacts with correct structure', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((contact: any) => {
        expect(contact).toHaveProperty('id');
        expect(contact).toHaveProperty('name');
        expect(contact).toHaveProperty('role');
        expect(contact).toHaveProperty('email');
      });
    });

    it('should return all mock contacts without modification', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      expect(data).toEqual(contacts);
    });
  });

  describe('With Property ID Filter', () => {
    it('should return empty array when filtering by propertyId', async () => {
      // Note: Current implementation filters by propertyId, but contacts don't have propertyId field
      const request = new Request('http://localhost:3000/api/contacts?propertyId=prop-1');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      // Since contacts don't have propertyId field, filtering returns empty array
      expect(data.length).toBe(0);
    });

    it('should handle non-existent propertyId', async () => {
      const request = new Request('http://localhost:3000/api/contacts?propertyId=non-existent');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });

  describe('Response Format', () => {
    it('should return valid JSON structure', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should return contacts with valid types', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      data.forEach((contact: any) => {
        expect(typeof contact.id).toBe('string');
        expect(typeof contact.name).toBe('string');
        expect(typeof contact.role).toBe('string');
        expect(typeof contact.email).toBe('string');
      });
    });

    it('should return contacts with valid role values', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      const validRoles = ['Vendor', 'Buyer'];
      
      data.forEach((contact: any) => {
        expect(validRoles).toContain(contact.role);
      });
    });

    it('should return contacts with valid email formats', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      data.forEach((contact: any) => {
        expect(contact.email).toMatch(emailRegex);
      });
    });

    it('should return contacts with unique IDs', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      const ids = data.map((contact: any) => contact.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Query Parameter Handling', () => {
    it('should handle multiple query parameters', async () => {
      const request = new Request('http://localhost:3000/api/contacts?propertyId=prop-1&other=value');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should ignore non-propertyId parameters', async () => {
      const request1 = new Request('http://localhost:3000/api/contacts');
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      const request2 = new Request('http://localhost:3000/api/contacts?random=param');
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      expect(data1).toEqual(data2);
    });
  });

  describe('Multiple Requests', () => {
    it('should handle multiple sequential requests', async () => {
      const request1 = new Request('http://localhost:3000/api/contacts');
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      const request2 = new Request('http://localhost:3000/api/contacts');
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(data1).toEqual(data2);
    });

    it('should be callable multiple times without side effects', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      
      const response1 = await GET(request);
      const data1 = await response1.json();
      
      const response2 = await GET(request);
      const data2 = await response2.json();
      
      const response3 = await GET(request);
      const data3 = await response3.json();
      
      expect(data1).toEqual(data2);
      expect(data2).toEqual(data3);
      expect(data1.length).toBe(contacts.length);
    });
  });

  describe('Contact Roles Distribution', () => {
    it('should have both Vendor and Buyer roles in data', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      const roles = data.map((contact: any) => contact.role);
      
      expect(roles).toContain('Vendor');
      expect(roles).toContain('Buyer');
    });

    it('should allow filtering contacts by role manually', async () => {
      const request = new Request('http://localhost:3000/api/contacts');
      const response = await GET(request);
      const data = await response.json();
      
      const vendors = data.filter((contact: any) => contact.role === 'Vendor');
      const buyers = data.filter((contact: any) => contact.role === 'Buyer');
      
      expect(vendors.length).toBeGreaterThan(0);
      expect(buyers.length).toBeGreaterThan(0);
      expect(vendors.length + buyers.length).toBe(data.length);
    });
  });
});
