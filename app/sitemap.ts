import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superdeal.com';

  const products = [
    'wireless-noise-canceling-headphones',
    'rgb-mechanical-gaming-keyboard',
    'ultra-fast-ergonomic-gaming-mouse',
    'pro-gaming-headset',
    'rgb-extended-mouse-pad'
  ];

  const productUrls: MetadataRoute.Sitemap = products.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const routes: MetadataRoute.Sitemap = [
    '',
    '/products',
    '/categories',
    '/cart',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...routes, ...productUrls];
}
