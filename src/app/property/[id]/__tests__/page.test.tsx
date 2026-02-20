import { render, screen, waitFor } from '@testing-library/react';
import PropertyDetailPage from '../page';
import { Property, Offer } from '@/data/mock';

const mockProperty: Property = {
  id: 'prop-1',
  address: '123 Test Street, Test City',
  price: 500000,
  status: 'Available',
  listedDate: '2024-01-15T10:00:00Z',
  imageUrl: '/test.jpg',
};

const mockOffers: Offer[] = [
  { id: 'offer-1', propertyId: 'prop-1', contactId: 'contact-1', amount: 480000, status: 'Pending' },
  { id: 'offer-2', propertyId: 'prop-1', contactId: 'contact-2', amount: 490000, status: 'Rejected' },
  { id: 'offer-3', propertyId: 'prop-1', contactId: 'contact-3', amount: 495000, status: 'Accepted' },
];

describe('PropertyDetailPage Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      expect(screen.getByText('Loading property...')).toBeInTheDocument();
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should have correct loading spinner classes', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      const spinner = document.querySelector('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-green-700');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch property and offers in parallel', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties/prop-1');
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/offers?propertyId=prop-1');
    });

    it('should use default API URL', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties/prop-1');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/offers?propertyId=prop-1');
      });
    });

    it('should fetch data with correct property ID from params', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-999' }} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties/prop-999');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/offers?propertyId=prop-999');
      });
    });
  });

  describe('Property Header Rendering', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });
    });

    it('should display property address', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
      });
    });

    it('should display property price', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText(mockProperty.price.toString())).toBeInTheDocument();
      });
    });

    it('should display listed date', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Listed:/)).toBeInTheDocument();
      });
    });

    it('should display property status', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('Available')).toBeInTheDocument();
      });
    });

    it('should render house emoji', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('🏠')).toBeInTheDocument();
      });
    });
  });

  describe('Status Styling', () => {
    it('should apply correct styling for "Available" status', async () => {
      const availableProperty = { ...mockProperty, status: 'Available' as const };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => availableProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const statusElement = screen.getByText('Available');
        expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
      });
    });

    it('should apply correct styling for "Sale Agreed" status', async () => {
      const saleAgreedProperty = { ...mockProperty, status: 'Sale Agreed' as const };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => saleAgreedProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const statusElement = screen.getByText('Sale Agreed');
        expect(statusElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
      });
    });

    it('should apply correct styling for "Sold" status', async () => {
      const soldProperty = { ...mockProperty, status: 'Sold' as const };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => soldProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const statusElement = screen.getByText('Sold');
        expect(statusElement).toHaveClass('bg-blue-100', 'text-blue-800');
      });
    });
  });

  describe('Offers Section', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });
    });

    it('should display "Offers" heading', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('Offers')).toBeInTheDocument();
      });
    });

    it('should render all offers in table', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('480000')).toBeInTheDocument();
        expect(screen.getByText('490000')).toBeInTheDocument();
        expect(screen.getByText('495000')).toBeInTheDocument();
      });
    });

    it('should display offer statuses', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Rejected')).toBeInTheDocument();
        expect(screen.getByText('Accepted')).toBeInTheDocument();
      });
    });

    it('should have correct table headers', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
      });
    });
  });

  describe('Offer Status Styling', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });
    });

    it('should apply correct styling for "Accepted" status', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const acceptedElement = screen.getByText('Accepted');
        expect(acceptedElement).toHaveClass('bg-green-100', 'text-green-800');
      });
    });

    it('should apply correct styling for "Rejected" status', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const rejectedElement = screen.getByText('Rejected');
        expect(rejectedElement).toHaveClass('bg-red-100', 'text-red-800');
      });
    });

    it('should apply correct styling for "Pending" status', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const pendingElement = screen.getByText('Pending');
        expect(pendingElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
      });
    });
  });

  describe('Empty Offers State', () => {
    it('should display message when no offers exist', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('No offers yet.')).toBeInTheDocument();
      });
    });

    it('should not render table when no offers', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });
    });

    it('should display back link', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const backLink = screen.getByText('← Back to Properties');
        expect(backLink).toBeInTheDocument();
      });
    });

    it('should have correct back link href', async () => {
      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        const backLink = screen.getByText('← Back to Properties');
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should refetch data when params.id changes', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      const { rerender } = render(<PropertyDetailPage params={{ id: 'prop-1' }} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      // Mock new data for different property
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ ...mockProperty, id: 'prop-2' }),
        })
        .mockResolvedValueOnce({
          json: async () => [],
        });

      rerender(<PropertyDetailPage params={{ id: 'prop-2' }} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/properties/prop-2');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle property with very high price', async () => {
      const expensiveProperty = { ...mockProperty, price: 99999999 };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => expensiveProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('99999999')).toBeInTheDocument();
      });
    });

    it('should handle property with long address', async () => {
      const longAddressProperty = { ...mockProperty, address: 'A'.repeat(200) };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => longAddressProperty,
        })
        .mockResolvedValueOnce({
          json: async () => mockOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
      });
    });

    it('should handle many offers', async () => {
      const manyOffers = Array.from({ length: 50 }, (_, i) => ({
        id: `offer-${i}`,
        propertyId: 'prop-1',
        contactId: `contact-${i}`,
        amount: 500000 + i * 1000,
        status: 'Pending' as const,
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockProperty,
        })
        .mockResolvedValueOnce({
          json: async () => manyOffers,
        });

      render(<PropertyDetailPage params={{ id: 'prop-1' }} />);
      
      await waitFor(() => {
        expect(screen.getByText('Offers')).toBeInTheDocument();
      });

      // Verify we can find offer amounts (may appear multiple times in the table)
      const firstOfferElements = screen.getAllByText('500000');
      expect(firstOfferElements.length).toBeGreaterThan(0);
    });
  });
});
