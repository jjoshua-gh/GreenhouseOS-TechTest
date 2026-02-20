import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';
import { Property, Offer } from '@/data/mock';

// Mock PropertyCard component
jest.mock('../components/PropertyCard', () => {
  return function MockPropertyCard({ property, offerCount }: { property: Property; offerCount: number }) {
    return (
      <div data-testid={`property-card-${property.id}`}>
        <span>{property.address}</span>
        <span>{offerCount} offers</span>
      </div>
    );
  };
});

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    address: '123 Main St',
    price: 500000,
    status: 'Available',
    listedDate: '2024-01-01T10:00:00Z',
    imageUrl: '/test1.jpg',
  },
  {
    id: 'prop-2',
    address: '456 Oak Ave',
    price: 750000,
    status: 'Sale Agreed',
    listedDate: '2024-01-02T10:00:00Z',
    imageUrl: '/test2.jpg',
  },
];

const mockOffers: Offer[] = [
  { id: 'offer-1', propertyId: 'prop-1', contactId: 'contact-1', amount: 480000, status: 'Pending' },
  { id: 'offer-2', propertyId: 'prop-1', contactId: 'contact-2', amount: 490000, status: 'Rejected' },
  { id: 'offer-3', propertyId: 'prop-2', contactId: 'contact-3', amount: 740000, status: 'Accepted' },
];

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner initially', () => {
      // Mock fetch to never resolve
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<HomePage />);
      
      expect(screen.getByText('Loading properties...')).toBeInTheDocument();
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should have correct loading spinner classes', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<HomePage />);
      
      const spinner = document.querySelector('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-green-700');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch properties and offers in parallel', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties');
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/offers');
    });

    it('should use default API URL when environment variable not set', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/offers');
      });
    });
  });

  describe('Content Rendering', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });
    });

    it('should display page title', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });
    });

    it('should display property count', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 2 properties')).toBeInTheDocument();
      });
    });

    it('should render all properties', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('property-card-prop-1')).toBeInTheDocument();
        expect(screen.getByTestId('property-card-prop-2')).toBeInTheDocument();
      });
    });

    it('should pass correct offer counts to PropertyCard components', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        // prop-1 has 2 offers
        const prop1Card = screen.getByTestId('property-card-prop-1');
        expect(prop1Card).toHaveTextContent('2 offers');
        
        // prop-2 has 1 offer
        const prop2Card = screen.getByTestId('property-card-prop-2');
        expect(prop2Card).toHaveTextContent('1 offers');
      });
    });
  });

  describe('Offer Count Calculation', () => {
    it('should correctly count offers per property', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('property-card-prop-1')).toHaveTextContent('2 offers');
        expect(screen.getByTestId('property-card-prop-2')).toHaveTextContent('1 offers');
      });
    });

    it('should handle properties with no offers', async () => {
      const propertiesWithNoOffers: Property[] = [
        ...mockProperties,
        {
          id: 'prop-3',
          address: '789 Pine St',
          price: 600000,
          status: 'Available',
          listedDate: '2024-01-03T10:00:00Z',
          imageUrl: '/test3.jpg',
        },
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => propertiesWithNoOffers,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('property-card-prop-3')).toHaveTextContent('0 offers');
      });
    });

    it('should handle empty offers array', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('property-card-prop-1')).toHaveTextContent('0 offers');
        expect(screen.getByTestId('property-card-prop-2')).toHaveTextContent('0 offers');
      });
    });
  });

  describe('Empty State', () => {
    it('should handle empty properties array', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => [],
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 0 properties')).toBeInTheDocument();
      });
    });

    it('should render grid even when empty', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => [],
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      const { container } = render(<HomePage />);
      
      await waitFor(() => {
        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Grid Layout', () => {
    it('should have responsive grid classes', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      const { container } = render(<HomePage />);
      
      await waitFor(() => {
        const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        expect(grid).toBeInTheDocument();
      });
    });

    it('should have gap between grid items', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      const { container } = render(<HomePage />);
      
      await waitFor(() => {
        const grid = container.querySelector('.gap-6');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should fetch data on mount', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should transition from loading to content', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperties,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<HomePage />);
      
      // Should show loading initially
      expect(screen.getByText('Loading properties...')).toBeInTheDocument();
      
      // Should show content after loading
      await waitFor(() => {
        expect(screen.queryByText('Loading properties...')).not.toBeInTheDocument();
        expect(screen.getByText('Properties')).toBeInTheDocument();
      });
    });
  });
});
