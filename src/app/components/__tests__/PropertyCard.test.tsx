import { render, screen } from '@testing-library/react';
import PropertyCard from '../PropertyCard';
import { Property } from '@/data/mock';

// Mock property data
const mockProperty: Property = {
  id: 'prop-test-1',
  address: '123 Test Street, Test City',
  price: 500000,
  status: 'Available',
  listedDate: '2024-01-15T10:00:00Z',
  imageUrl: '/test-image.jpg',
};

describe('PropertyCard Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      expect(screen.getByText('123 Test Street, Test City')).toBeInTheDocument();
    });

    it('should display property address', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
    });

    it('should display property price', () => {
      render(<PropertyCard property={mockProperty} offerCount={5} />);
      expect(screen.getByText(mockProperty.price.toString())).toBeInTheDocument();
    });

    it('should display listed date', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      expect(screen.getByText(/Listed:/)).toBeInTheDocument();
    });

    it('should display offer count', () => {
      render(<PropertyCard property={mockProperty} offerCount={3} />);
      expect(screen.getByText('3 offers')).toBeInTheDocument();
    });

    it('should display singular "offer" when count is 1', () => {
      render(<PropertyCard property={mockProperty} offerCount={1} />);
      expect(screen.getByText('1 offer')).toBeInTheDocument();
    });

    it('should display "0 offers" when count is 0', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      expect(screen.getByText('0 offers')).toBeInTheDocument();
    });

    it('should render house emoji', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should display "Available" status with correct styling', () => {
      const availableProperty = { ...mockProperty, status: 'Available' as const };
      render(<PropertyCard property={availableProperty} offerCount={0} />);
      const statusElement = screen.getByText('Available');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should display "Sale Agreed" status with correct styling', () => {
      const saleAgreedProperty = { ...mockProperty, status: 'Sale Agreed' as const };
      render(<PropertyCard property={saleAgreedProperty} offerCount={0} />);
      const statusElement = screen.getByText('Sale Agreed');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should display "Sold" status with correct styling', () => {
      const soldProperty = { ...mockProperty, status: 'Sold' as const };
      render(<PropertyCard property={soldProperty} offerCount={0} />);
      const statusElement = screen.getByText('Sold');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('bg-blue-100', 'text-blue-800');
    });
  });

  describe('Link Behavior', () => {
    it('should render a link to the property detail page', () => {
      render(<PropertyCard property={mockProperty} offerCount={0} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/property/${mockProperty.id}`);
    });

    it('should have correct link structure for different property IDs', () => {
      const differentProperty = { ...mockProperty, id: 'prop-999' };
      render(<PropertyCard property={differentProperty} offerCount={0} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/property/prop-999');
    });
  });

  describe('Styling Classes', () => {
    it('should have correct card container classes', () => {
      const { container } = render(<PropertyCard property={mockProperty} offerCount={0} />);
      const card = container.querySelector('.bg-white.rounded-lg.shadow-md');
      expect(card).toBeInTheDocument();
    });

    it('should have hover effect classes', () => {
      const { container } = render(<PropertyCard property={mockProperty} offerCount={0} />);
      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('should have transition classes', () => {
      const { container } = render(<PropertyCard property={mockProperty} offerCount={0} />);
      const card = container.querySelector('.transition-shadow');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long addresses', () => {
      const longAddressProperty: Property = {
        ...mockProperty,
        address: 'A'.repeat(200),
      };
      render(<PropertyCard property={longAddressProperty} offerCount={0} />);
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });

    it('should handle very high prices', () => {
      const expensiveProperty: Property = {
        ...mockProperty,
        price: 99999999,
      };
      render(<PropertyCard property={expensiveProperty} offerCount={0} />);
      expect(screen.getByText('99999999')).toBeInTheDocument();
    });

    it('should handle large offer counts', () => {
      render(<PropertyCard property={mockProperty} offerCount={999} />);
      expect(screen.getByText('999 offers')).toBeInTheDocument();
    });

    it('should handle property with minimum required fields', () => {
      const minimalProperty: Property = {
        id: 'min-1',
        address: 'A',
        price: 1,
        status: 'Available',
        listedDate: '2024-01-01T00:00:00Z',
        imageUrl: '',
      };
      render(<PropertyCard property={minimalProperty} offerCount={0} />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  describe('Offer Count Display', () => {
    it('should not show loading state when offerCount is provided', () => {
      render(<PropertyCard property={mockProperty} offerCount={5} />);
      expect(screen.queryByText('Loading offers...')).not.toBeInTheDocument();
    });

    it('should display offer count immediately', () => {
      render(<PropertyCard property={mockProperty} offerCount={10} />);
      expect(screen.getByText('10 offers')).toBeInTheDocument();
    });
  });

  describe('Price Display', () => {
    it('should format price as text', () => {
      const { container } = render(<PropertyCard property={mockProperty} offerCount={0} />);
      const priceElement = container.querySelector('.text-2xl.font-bold.text-green-700');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement?.textContent).toBe(mockProperty.price.toString());
    });

    it('should handle zero price', () => {
      const freeProperty: Property = { ...mockProperty, price: 0 };
      render(<PropertyCard property={freeProperty} offerCount={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
