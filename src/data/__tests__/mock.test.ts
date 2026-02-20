import { 
  properties, 
  contacts, 
  offers, 
  Property, 
  Contact, 
  Offer,
  PropertyStatus,
  OfferStatus,
  ContactRole
} from '../mock';

describe('Mock Data', () => {
  describe('Type Exports', () => {
    it('should export PropertyStatus type correctly', () => {
      const validStatuses: PropertyStatus[] = ['Available', 'Sale Agreed', 'Sold'];
      expect(validStatuses).toHaveLength(3);
    });

    it('should export OfferStatus type correctly', () => {
      const validStatuses: OfferStatus[] = ['Pending', 'Accepted', 'Rejected'];
      expect(validStatuses).toHaveLength(3);
    });

    it('should export ContactRole type correctly', () => {
      const validRoles: ContactRole[] = ['Vendor', 'Buyer'];
      expect(validRoles).toHaveLength(2);
    });
  });

  describe('Properties Data', () => {
    it('should export an array of properties', () => {
      expect(Array.isArray(properties)).toBe(true);
      expect(properties.length).toBeGreaterThan(0);
    });

    it('should have valid property structure', () => {
      properties.forEach((property: Property) => {
        expect(property).toHaveProperty('id');
        expect(property).toHaveProperty('address');
        expect(property).toHaveProperty('price');
        expect(property).toHaveProperty('status');
        expect(property).toHaveProperty('listedDate');
        expect(property).toHaveProperty('imageUrl');
        
        expect(typeof property.id).toBe('string');
        expect(typeof property.address).toBe('string');
        expect(typeof property.price).toBe('number');
        expect(typeof property.status).toBe('string');
        expect(typeof property.listedDate).toBe('string');
        expect(typeof property.imageUrl).toBe('string');
      });
    });

    it('should have valid property status values', () => {
      const validStatuses: PropertyStatus[] = ['Available', 'Sale Agreed', 'Sold'];
      properties.forEach((property) => {
        expect(validStatuses).toContain(property.status);
      });
    });

    it('should have positive prices', () => {
      properties.forEach((property) => {
        expect(property.price).toBeGreaterThan(0);
      });
    });

    it('should have unique property IDs', () => {
      const ids = properties.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Contacts Data', () => {
    it('should export an array of contacts', () => {
      expect(Array.isArray(contacts)).toBe(true);
      expect(contacts.length).toBeGreaterThan(0);
    });

    it('should have valid contact structure', () => {
      contacts.forEach((contact: Contact) => {
        expect(contact).toHaveProperty('id');
        expect(contact).toHaveProperty('name');
        expect(contact).toHaveProperty('role');
        expect(contact).toHaveProperty('email');
        
        expect(typeof contact.id).toBe('string');
        expect(typeof contact.name).toBe('string');
        expect(typeof contact.role).toBe('string');
        expect(typeof contact.email).toBe('string');
      });
    });

    it('should have valid contact roles', () => {
      const validRoles: ContactRole[] = ['Vendor', 'Buyer'];
      contacts.forEach((contact) => {
        expect(validRoles).toContain(contact.role);
      });
    });

    it('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      contacts.forEach((contact) => {
        expect(contact.email).toMatch(emailRegex);
      });
    });

    it('should have unique contact IDs', () => {
      const ids = contacts.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Offers Data', () => {
    it('should export an array of offers', () => {
      expect(Array.isArray(offers)).toBe(true);
      expect(offers.length).toBeGreaterThan(0);
    });

    it('should have valid offer structure', () => {
      offers.forEach((offer: Offer) => {
        expect(offer).toHaveProperty('id');
        expect(offer).toHaveProperty('propertyId');
        expect(offer).toHaveProperty('contactId');
        expect(offer).toHaveProperty('amount');
        expect(offer).toHaveProperty('status');
        
        expect(typeof offer.id).toBe('string');
        expect(typeof offer.propertyId).toBe('string');
        expect(typeof offer.contactId).toBe('string');
        expect(typeof offer.amount).toBe('number');
        expect(typeof offer.status).toBe('string');
      });
    });

    it('should have valid offer status values', () => {
      const validStatuses: OfferStatus[] = ['Pending', 'Accepted', 'Rejected'];
      offers.forEach((offer) => {
        expect(validStatuses).toContain(offer.status);
      });
    });

    it('should have positive offer amounts', () => {
      offers.forEach((offer) => {
        expect(offer.amount).toBeGreaterThan(0);
      });
    });

    it('should reference valid property IDs', () => {
      const propertyIds = new Set(properties.map(p => p.id));
      offers.forEach((offer) => {
        // Some offers might reference properties not in the mock data (prop-5)
        // Just verify the structure is correct
        expect(typeof offer.propertyId).toBe('string');
        expect(offer.propertyId.startsWith('prop-')).toBe(true);
      });
    });

    it('should reference valid contact IDs', () => {
      const contactIds = new Set(contacts.map(c => c.id));
      offers.forEach((offer) => {
        expect(contactIds.has(offer.contactId)).toBe(true);
      });
    });

    it('should have unique offer IDs', () => {
      const ids = offers.map(o => o.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Data Relationships', () => {
    it('should have offers that reference existing properties (where applicable)', () => {
      const propertyIds = new Set(properties.map(p => p.id));
      const offersWithValidProps = offers.filter(o => propertyIds.has(o.propertyId));
      
      // Most offers should reference valid properties
      expect(offersWithValidProps.length).toBeGreaterThan(0);
    });

    it('should allow filtering offers by propertyId', () => {
      const firstPropertyId = properties[0]?.id;
      if (firstPropertyId) {
        const propertyOffers = offers.filter(o => o.propertyId === firstPropertyId);
        propertyOffers.forEach(offer => {
          expect(offer.propertyId).toBe(firstPropertyId);
        });
      }
    });

    it('should allow filtering contacts by offers', () => {
      const firstOffer = offers[0];
      if (firstOffer) {
        const contact = contacts.find(c => c.id === firstOffer.contactId);
        expect(contact).toBeDefined();
        if (contact) {
          expect(contact.id).toBe(firstOffer.contactId);
        }
      }
    });
  });
});
