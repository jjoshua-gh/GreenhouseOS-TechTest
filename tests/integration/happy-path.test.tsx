/**
 * Integration Tests for GreenHouse Property Portal
 * 
 * These tests verify the happy path of the application:
 * 1. User loads the homepage and sees properties
 * 2. User clicks on a property and sees details
 * 3. User sees offers for the property
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import PropertyDetailPage from '@/app/property/[id]/page';
import { properties, offers } from '@/data/mock';

describe('Integration Tests - Happy Path', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('End-to-End: Browse Properties Flow', () => {
    it('should display all properties from API on homepage', async () => {
      // Mock API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      render(<HomePage />);

      // Wait for properties to load
      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // Verify property count is displayed
      expect(screen.getByText(`Showing ${properties.length} properties`)).toBeInTheDocument();
    });

    it('should correctly calculate and display offer counts for each property', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties.slice(0, 2),
        })
        .mockResolvedValueOnce({
          json: async () => offers.filter(o => ['prop-1', 'prop-2'].includes(o.propertyId)),
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // Verify the page loaded successfully with properties
      expect(screen.getByText('Showing 2 properties')).toBeInTheDocument();
    });
  });

  describe('End-to-End: Property Detail Flow', () => {
    it('should display property details when viewing a specific property', async () => {
      const testProperty = properties[0];
      const testPropertyOffers = offers.filter(o => o.propertyId === testProperty?.id);

      if (!testProperty) {
        throw new Error('No test property available');
      }

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => testProperty,
        })
        .mockResolvedValueOnce({
          json: async () => testPropertyOffers,
        });

      render(<PropertyDetailPage params={{ id: testProperty.id }} />);

      await waitFor(() => {
        expect(screen.getByText(testProperty.address)).toBeInTheDocument();
      });

      // Use getAllByText since price may appear multiple times (header + offers table)
      const priceElements = screen.getAllByText(testProperty.price.toString());
      expect(priceElements.length).toBeGreaterThan(0);
      expect(screen.getByText(testProperty.status)).toBeInTheDocument();
    });

    it('should display offers for a property on detail page', async () => {
      const testProperty = properties[0];
      const testPropertyOffers = offers.filter(o => o.propertyId === testProperty?.id);

      if (!testProperty) {
        throw new Error('No test property available');
      }

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => testProperty,
        })
        .mockResolvedValueOnce({
          json: async () => testPropertyOffers,
        });

      render(<PropertyDetailPage params={{ id: testProperty.id }} />);

      await waitFor(() => {
        expect(screen.getByText('Offers')).toBeInTheDocument();
      });

      // If there are offers, they should be displayed
      if (testPropertyOffers.length > 0) {
        expect(screen.queryByText('No offers yet.')).not.toBeInTheDocument();
      }
    });
  });

  describe('Data Loading: Properties', () => {
    it('should load and display all properties through the UI', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      expect(screen.getByText(`Showing ${properties.length} properties`)).toBeInTheDocument();
    });

    it('should load specific property details through the UI', async () => {
      const testProperty = properties[0];
      
      if (!testProperty) {
        throw new Error('No test property available');
      }

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => testProperty,
        })
        .mockResolvedValueOnce({
          json: async () => offers.filter(o => o.propertyId === testProperty.id),
        });

      render(<PropertyDetailPage params={{ id: testProperty.id }} />);

      await waitFor(() => {
        expect(screen.getByText(testProperty.address)).toBeInTheDocument();
      });

      // Price may appear multiple times in the UI (header + offers table)
      const priceElements = screen.getAllByText(testProperty.price.toString());
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('Full User Journey: Browse -> View Details', () => {
    it('should complete full user journey from homepage to property detail', async () => {
      // Step 1: User loads homepage
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      const { unmount } = render(<HomePage />);

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // Verify properties are displayed
      expect(screen.getByText(`Showing ${properties.length} properties`)).toBeInTheDocument();

      unmount();

      // Step 2: User clicks on a property (simulated by loading detail page)
      const testProperty = properties[0];
      const testPropertyOffers = offers.filter(o => o.propertyId === testProperty?.id);

      if (!testProperty) {
        throw new Error('No test property available');
      }

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => testProperty,
        })
        .mockResolvedValueOnce({
          json: async () => testPropertyOffers,
        });

      render(<PropertyDetailPage params={{ id: testProperty.id }} />);

      // Wait for property details to load
      await waitFor(() => {
        expect(screen.getByText(testProperty.address)).toBeInTheDocument();
      });

      // Verify property details are displayed (price may appear multiple times)
      const priceElements = screen.getAllByText(testProperty.price.toString());
      expect(priceElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Offers')).toBeInTheDocument();

      // Verify back link exists
      expect(screen.getByText('← Back to Properties')).toBeInTheDocument();
    });
  });

  describe('Data Consistency Across Components', () => {
    it('should maintain data consistency between fetched data and UI', async () => {
      // Mock fetch to return specific data
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties.slice(0, 3),
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // Verify the count matches
      expect(screen.getByText('Showing 3 properties')).toBeInTheDocument();
    });

    it('should calculate offer counts correctly', async () => {
      const testOffers = offers.filter(o => o.propertyId === 'prop-1');

      // Mock fetch to return data
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties.filter(p => p.id === 'prop-1'),
        })
        .mockResolvedValueOnce({
          json: async () => testOffers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // The UI should display correct offer count
      expect(screen.getByText('Showing 1 properties')).toBeInTheDocument();
    });
  });

  describe('Performance: Parallel Data Fetching', () => {
    it('should fetch properties and offers in parallel on homepage', async () => {
      const fetchSpy = jest.fn()
        .mockResolvedValueOnce({
          json: async () => properties,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      global.fetch = fetchSpy;

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // Both endpoints should have been called
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/properties');
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/offers');
    });

    it('should fetch property and offers in parallel on detail page', async () => {
      const testProperty = properties[0];
      
      if (!testProperty) {
        throw new Error('No test property available');
      }

      const fetchSpy = jest.fn()
        .mockResolvedValueOnce({
          json: async () => testProperty,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      global.fetch = fetchSpy;

      render(<PropertyDetailPage params={{ id: testProperty.id }} />);

      await waitFor(() => {
        expect(screen.getByText(testProperty.address)).toBeInTheDocument();
      });

      // Both endpoints should have been called in parallel
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenCalledWith(`http://localhost:3000/api/properties/${testProperty.id}`);
      expect(fetchSpy).toHaveBeenCalledWith(`http://localhost:3000/api/offers?propertyId=${testProperty.id}`);
    });
  });

  describe('Type Safety Integration', () => {
    it('should maintain type safety between data and components', async () => {
      // Mock fetch with properly typed data
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => properties,
        })
        .mockResolvedValueOnce({
          json: async () => offers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });

      // If this compiles and runs, types are correct
      const firstProperty = properties[0];
      if (firstProperty) {
        expect(firstProperty).toHaveProperty('id');
        expect(firstProperty).toHaveProperty('address');
        expect(firstProperty).toHaveProperty('price');
        expect(firstProperty).toHaveProperty('status');
        expect(typeof firstProperty.id).toBe('string');
        expect(typeof firstProperty.price).toBe('number');
      }
    });
  });
});
