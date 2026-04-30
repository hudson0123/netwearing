export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in cents
  sizes: string[];
  skills: string[];
  requiresUpload: boolean;
  images: string[];
}

export const products: Product[] = [
  {
    id: 'resume-shirt',
    name: 'The resume Shirt',
    tagline: 'Your name on the front. Your entire professional history on the back.',
    description: '',
    price: 3500, // $35.00
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
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
    images: ['/netwearing-shirt.png', '/netwearing-shirt-back.png'],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
