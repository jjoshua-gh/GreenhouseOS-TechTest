/**
 * @jest-environment node
 */
import { properties } from '@/data/mock';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: new Map([['content-type', 'application/json']]),
    }),
  },
}));

describe('GET /api/properties', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return all properties', async () => {
    const { GET } = await import('../route');
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(properties.length);
  });

  it('should return properties with correct structure', async () => {
    const { GET } = await import('../route');
    const response = await GET();
    const data = await response.json();
    
    data.forEach((property: any) => {
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('address');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('status');
      expect(property).toHaveProperty('listedDate');
      expect(property).toHaveProperty('imageUrl');
    });
  });

  it('should return properties with valid types', async () => {
    const { GET } = await import('../route');
    const response = await GET();
    const data = await response.json();
    
    data.forEach((property: any) => {
      expect(typeof property.id).toBe('string');
      expect(typeof property.address).toBe('string');
      expect(typeof property.price).toBe('number');
      expect(typeof property.status).toBe('string');
      expect(typeof property.listedDate).toBe('string');
      expect(typeof property.imageUrl).toBe('string');
    });
  });

  it('should have content-type header', async () => {
    const { GET } = await import('../route');
    const response = await GET();
    
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('should return all mock properties without modification', async () => {
    const { GET } = await import('../route');
    const response = await GET();
    const data = await response.json();
    
    expect(data).toEqual(properties);
  });

  it('should be callable multiple times', async () => {
    const { GET } = await import('../route');
    const response1 = await GET();
    const data1 = await response1.json();
    
    const response2 = await GET();
    const data2 = await response2.json();
    
    expect(data1).toEqual(data2);
  });
});
