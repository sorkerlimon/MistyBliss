import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'tactile-silence-raw-earth',
    title: 'The Tactile Silence of Raw Earth: Inside our Cascadia Stoneware Kilns',
    subtitle: 'How grogged clay, open flame, and matte mineral washes ground our living spaces.',
    excerpt: 'Explore how hand-thrown clay and earthen vessels establish visual calm and tactile texture in modern living sanctuaries.',
    content: [
      'There is an unhurried cadence to working with unprocessed stoneware. Long before a vessel reaches the drying shelf, the potter must negotiate with the natural tension of grog—tiny fragments of pre-fired clay that impart grain, resistance, and permanence.',
      'In our Bend studio, each vessel undergoes a slow 48-hour bisque firing followed by a high-temperature reduction soak. We deliberately leave the exterior wall unglazed, celebrating the raw iron flecks and natural ochre blush that only emerge in proximity to open kiln flame.',
      'When brought into a modern home, these pieces do more than hold seasonal botanicals; they absorb ambient harshness, offering a grounding visual focal point that invites slow contemplation.'
    ],
    category: 'Studio Craft',
    author: {
      name: 'Elena Rostova',
      role: 'Master Ceramist & Studio Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: 'Oct 18, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Ceramics', 'Slow Living', 'Stoneware', 'Craftsmanship'],
    featured: true,
    relatedProductSlugs: ['earthen-terracotta-vessel', 'ridged-ceramic-table-lamp'],
  },
  {
    id: 'post-2',
    slug: 'styling-unfilled-travertine',
    title: 'How to Style Honed Travertine & Embrace Organic Negative Space',
    subtitle: 'The porous elegance of Italian limestone and why architectural restraint matters.',
    excerpt: 'Honed travertine brings ancient geological history into contemporary minimalist rooms without feeling cold or austere.',
    content: [
      'Unlike polished marble with its reflective gloss, unfilled Roman travertine is defined by porous cavities and honeyed earthen striations. Its natural voids are not flaws—they are centuries of mineral springs etching their journey into stone.',
      'To style a travertine plinth or catchall bowl, resist the temptation to crowd its surface. Allow at least forty percent of the stone face to remain completely bare.',
      'Pairing stone with contrasting tactile textures—a single sprig of dried eucalyptus, a matte beeswax taper, or a woven Belgian linen throw—enhances the depth of each material exponentially.'
    ],
    category: 'Interior Styling',
    author: {
      name: 'Marcus Sterling',
      role: 'Interior Architecture Stylist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: 'Oct 12, 2026',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    tags: ['Travertine', 'Styling', 'Minimalism', 'Sculptural Furniture'],
    featured: false,
    relatedProductSlugs: ['honed-travertine-plinth'],
  },
  {
    id: 'post-3',
    slug: 'eternal-botanicals-foliage',
    title: 'The Art of Eternal Botanicals: Bringing Foliage into Sunless Spaces',
    subtitle: 'From preserved meadow grasses to hand-assembled silk stems that defy seasons.',
    excerpt: 'Discover thoughtful curation tips for styling hyper-realistic botanical branches in bedrooms, bathrooms, and low-light hallways.',
    content: [
      'Low-light areas like entryways, guest suites, and shaded library nooks often make live plant maintenance stressful. Preserved botanicals and botanical silks offer a deliberate architectural alternative.',
      'Our approach centers on botanical realism: subtle stem variations, delicate vein details, and natural asymmetry. We never recommend symmetrical groupings; instead, let stems arch naturally as they would toward autumn sunlight.',
      'Pairing dark olive branches with our rough earthenware vases creates an instantaneous seasonal transition that requires zero watering or pruning.'
    ],
    category: 'Botanical Notes',
    author: {
      name: 'Aiko Tanaka',
      role: 'Botanical Designer & Florist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: 'Oct 08, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
    tags: ['Botanicals', 'Floral Styling', 'Preserved Stems', 'Home Wellness'],
    featured: false,
    relatedProductSlugs: ['earthen-terracotta-vessel'],
  },
  {
    id: 'post-4',
    slug: 'woven-in-flanders-belgian-flax',
    title: 'Woven in Flanders: The Thermo-Regulating Secrets of Pure Flax Linen',
    subtitle: 'Why stone-washed linen remains the ultimate tactile textile for all four seasons.',
    excerpt: 'From flax fields in Kortrijk to our finished throws and cushion covers, understand why Belgian linen only grows softer with every wash.',
    content: [
      'Flax is one of humanity’s oldest cultivated fibers, and European flax grown in the coastal climate of Flanders produces long, durable staple fibers that synthetic yarns simply cannot mimic.',
      'Its hollow cellular structure naturally draws moisture away in warmer months while trapping body heat when the evening chill sets in.',
      'Our stone-washing process tames the initial crispness of raw flax, leaving a billowy drape that wrinkles with effortless elegance on a sofa or linen-dressed bed.'
    ],
    category: 'Material Studies',
    author: {
      name: 'Claire Dupont',
      role: 'Textile Curator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: 'Sep 29, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    tags: ['Belgian Linen', 'Textiles', 'Bedding', 'Sustainable Craft'],
    featured: false,
    relatedProductSlugs: ['washed-belgian-linen-throw'],
  },
];

