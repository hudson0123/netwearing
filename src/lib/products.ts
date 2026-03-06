export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in cents
  sizes: string[];
  skills: string[];
  requiresUpload: boolean;
}

export const products: Product[] = [
  {
    id: 'resume-shirt',
    name: 'The Résumé Shirt',
    tagline: 'Your name on the front. Your entire professional history on the back.',
    description:
      'Wear your qualifications to the grocery store, the gym, your ex\'s wedding. The world deserves to know.',
    price: 5200, // $52.00 — TBD
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    skills: [
      'Leadership',
      'Synergy',
      'Microsoft Excel',
      'Growth Mindset',
      'Pivot',
      'Cross-Functional',
      'Results-Driven',
    ],
    requiresUpload: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
