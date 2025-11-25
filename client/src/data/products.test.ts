import { describe, it, expect } from 'vitest';
import { products, getProductById, getProductsByCategory } from './products';

describe('Product Data', () => {
  it('should have all 6 products', () => {
    expect(products).toHaveLength(6);
  });

  it('should have valid product structure', () => {
    products.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('features');
      expect(product).toHaveProperty('specifications');
      expect(product).toHaveProperty('applications');
      expect(product.features.length).toBeGreaterThan(0);
      expect(Object.keys(product.specifications).length).toBeGreaterThan(0);
    });
  });

  it('should get product by id', () => {
    const product = getProductById('machine-vision');
    expect(product).toBeDefined();
    expect(product?.name).toBe('Machine Vision Laser');
  });

  it('should return undefined for invalid id', () => {
    const product = getProductById('invalid-id');
    expect(product).toBeUndefined();
  });

  it('should get products by category', () => {
    const machineVisionProducts = getProductsByCategory('Machine Vision');
    expect(machineVisionProducts.length).toBeGreaterThan(0);
    machineVisionProducts.forEach(product => {
      expect(product.category).toBe('Machine Vision');
    });
  });

  it('should have MVpulse product', () => {
    const mvpulse = getProductById('mvpulse');
    expect(mvpulse).toBeDefined();
    expect(mvpulse?.name).toBe('MVpulse');
    expect(mvpulse?.category).toBe('Machine Vision');
  });

  it('should have all required product IDs', () => {
    const requiredIds = ['machine-vision', 'linienlaser', 'punktlaser', 'powelllinsen', 'oem-module', 'mvpulse'];
    requiredIds.forEach(id => {
      const product = getProductById(id);
      expect(product).toBeDefined();
    });
  });
});
