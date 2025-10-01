export const websiteTemplates = [
  {
    id: 'business-1',
    name: 'Modern Business',
    category: 'Business',
    description: 'Professional business website with all essential sections',
    thumbnail: '/templates/business-1.svg',
    isPremium: false,
    tags: ['corporate', 'professional', 'services'],
    pages: ['home', 'about', 'services', 'contact'],
    features: ['responsive', 'seo-friendly', 'contact-form'],
    elements: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          logo: 'Your Business',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
            { label: 'Services', link: '/services' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'modern'
        }
      },
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'Welcome to Your Business',
          subtitle: 'Professional solutions for modern challenges',
          buttonText: 'Get Started',
          buttonLink: '/contact',
          backgroundImage: '/templates/hero-business.jpg'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        props: {
          title: 'Why Choose Us',
          features: [
            {
              icon: 'zap',
              title: 'Fast & Reliable',
              description: 'Quick turnaround times with consistent quality'
            },
            {
              icon: 'shield',
              title: 'Secure & Safe',
              description: 'Your data is protected with industry-standard security'
            },
            {
              icon: 'users',
              title: 'Expert Team',
              description: 'Experienced professionals dedicated to your success'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'ecommerce-1',
    name: 'Fashion Store',
    category: 'E-commerce',
    description: 'Beautiful online store for fashion and clothing',
    thumbnail: '/templates/ecommerce-1.svg',
    isPremium: true,
    tags: ['shop', 'fashion', 'retail'],
    pages: ['home', 'shop', 'product', 'cart', 'checkout'],
    features: ['shopping-cart', 'payment-integration', 'inventory'],
    elements: [
      {
        id: 'navbar-2',
        type: 'navbar',
        props: {
          logo: 'Fashion Store',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Shop', link: '/shop' },
            { label: 'New Arrivals', link: '/new' },
            { label: 'Sale', link: '/sale' }
          ],
          showCart: true,
          showSearch: true
        }
      }
    ]
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant Deluxe',
    category: 'Restaurant',
    description: 'Elegant restaurant website with menu and reservations',
    thumbnail: '/templates/restaurant-1.svg',
    isPremium: false,
    tags: ['food', 'dining', 'hospitality'],
    pages: ['home', 'menu', 'about', 'reservations', 'contact'],
    features: ['menu-display', 'reservation-system', 'gallery'],
    localizedFor: 'pk'
  },
  {
    id: 'portfolio-1',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work with this stunning portfolio',
    thumbnail: '/templates/portfolio-1.svg',
    isPremium: false,
    tags: ['creative', 'portfolio', 'gallery'],
    pages: ['home', 'portfolio', 'about', 'contact'],
    features: ['image-gallery', 'project-showcase', 'contact-form']
  },
  {
    id: 'education-1',
    name: 'Online Academy',
    category: 'Education',
    description: 'Modern education platform for online learning',
    thumbnail: '/templates/education-1.svg',
    isPremium: true,
    tags: ['education', 'courses', 'learning'],
    pages: ['home', 'courses', 'instructors', 'about', 'enroll'],
    features: ['course-catalog', 'instructor-profiles', 'enrollment-system'],
    localizedFor: 'pk'
  },
  {
    id: 'medical-1',
    name: 'Healthcare Plus',
    category: 'Medical',
    description: 'Professional medical and healthcare website',
    thumbnail: '/templates/medical-1.svg',
    isPremium: true,
    tags: ['medical', 'healthcare', 'clinic'],
    pages: ['home', 'services', 'doctors', 'appointments', 'contact'],
    features: ['appointment-booking', 'doctor-profiles', 'service-listing'],
    localizedFor: 'pk'
  },
  {
    id: 'realestate-1',
    name: 'Property Pro',
    category: 'Real Estate',
    description: 'Real estate listings and property management',
    thumbnail: '/templates/realestate-1.svg',
    isPremium: true,
    tags: ['property', 'real-estate', 'listings'],
    pages: ['home', 'properties', 'agents', 'about', 'contact'],
    features: ['property-search', 'agent-profiles', 'virtual-tours'],
    localizedFor: 'pk'
  },
  {
    id: 'wedding-1',
    name: 'Wedding Bells',
    category: 'Events',
    description: 'Beautiful wedding and event planning website',
    thumbnail: '/templates/wedding-1.svg',
    isPremium: false,
    tags: ['wedding', 'events', 'celebration'],
    pages: ['home', 'gallery', 'services', 'testimonials', 'contact'],
    features: ['photo-gallery', 'rsvp-system', 'countdown-timer'],
    localizedFor: 'pk'
  },
  {
    id: 'blog-1',
    name: 'Modern Blog',
    category: 'Blog',
    description: 'Clean and modern blog template',
    thumbnail: '/templates/blog-1.svg',
    isPremium: false,
    tags: ['blog', 'content', 'writing'],
    pages: ['home', 'posts', 'categories', 'about', 'contact'],
    features: ['blog-posts', 'categories', 'comments', 'search']
  },
  {
    id: 'nonprofit-1',
    name: 'Charity Hope',
    category: 'Non-Profit',
    description: 'Non-profit organization and charity website',
    thumbnail: '/templates/nonprofit-1.svg',
    isPremium: false,
    tags: ['charity', 'nonprofit', 'donation'],
    pages: ['home', 'about', 'causes', 'donate', 'contact'],
    features: ['donation-system', 'cause-showcase', 'volunteer-signup'],
    localizedFor: 'pk'
  },
  {
    id: 'fitness-1',
    name: 'FitLife Gym',
    category: 'Fitness',
    description: 'Gym and fitness center website',
    thumbnail: '/templates/fitness-1.svg',
    isPremium: true,
    tags: ['gym', 'fitness', 'health'],
    pages: ['home', 'classes', 'trainers', 'membership', 'contact'],
    features: ['class-schedule', 'trainer-profiles', 'membership-plans']
  },
  {
    id: 'travel-1',
    name: 'Travel Explorer',
    category: 'Travel',
    description: 'Travel agency and tour booking website',
    thumbnail: '/templates/travel-1.svg',
    isPremium: true,
    tags: ['travel', 'tourism', 'booking'],
    pages: ['home', 'destinations', 'packages', 'about', 'book'],
    features: ['destination-gallery', 'package-listing', 'booking-system'],
    localizedFor: 'pk'
  },
  
  // === NEW ECOMMERCE TEMPLATES ===
  {
    id: 'porto-ecommerce',
    name: 'Porto Ecommerce',
    category: 'E-commerce',
    description: 'Versatile ecommerce template with 20+ homepage layouts',
    thumbnail: '/templates/porto-ecommerce.svg',
    isPremium: true,
    tags: ['ecommerce', 'shop', 'responsive', 'woocommerce'],
    pages: ['home', 'shop', 'product', 'cart', 'checkout', 'about', 'contact'],
    features: ['shopping-cart', 'payment-integration', 'inventory', 'seo-friendly'],
    elements: [
      {
        id: 'porto-navbar',
        type: 'navbar',
        props: {
          logo: 'Porto Store',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Shop', link: '/shop' },
            { label: 'Categories', link: '/categories' },
            { label: 'Sale', link: '/sale' },
            { label: 'About', link: '/about' }
          ],
          showCart: true,
          showSearch: true,
          showWishlist: true,
          style: 'modern'
        }
      }
    ]
  },
  {
    id: 'canvas-multipurpose',
    name: 'Canvas Multipurpose',
    category: 'Business',
    description: 'Multipurpose template with 800+ unique designs',
    thumbnail: '/templates/canvas-multipurpose.svg',
    isPremium: true,
    tags: ['multipurpose', 'business', 'responsive', 'bootstrap'],
    pages: ['home', 'about', 'services', 'portfolio', 'blog', 'contact'],
    features: ['responsive', 'seo-friendly', 'contact-form', 'blog'],
    elements: [
      {
        id: 'canvas-hero',
        type: 'hero',
        props: {
          title: 'Build Your Dream Website',
          subtitle: 'Create stunning websites with our multipurpose template',
          buttonText: 'Get Started',
          buttonLink: '/contact',
          backgroundImage: '/templates/canvas-hero.jpg',
          style: 'modern'
        }
      }
    ]
  },
  {
    id: 'mueble-furniture',
    name: 'Mueble Furniture',
    category: 'E-commerce',
    description: 'Modern furniture and interior design store template',
    thumbnail: '/templates/mueble-furniture.svg',
    isPremium: true,
    tags: ['furniture', 'interior-design', 'ecommerce', 'modern'],
    pages: ['home', 'products', 'categories', 'about', 'contact'],
    features: ['product-gallery', '3d-viewer', 'room-planner', 'shopping-cart'],
    localizedFor: 'pk'
  },
  {
    id: 'bella-fashion',
    name: 'Bella Fashion',
    category: 'E-commerce',
    description: 'Minimalist fashion and lifestyle brand template',
    thumbnail: '/templates/bella-fashion.svg',
    isPremium: true,
    tags: ['fashion', 'lifestyle', 'minimalist', 'ecommerce'],
    pages: ['home', 'shop', 'lookbook', 'about', 'contact'],
    features: ['lookbook-gallery', 'size-guide', 'wishlist', 'quick-view'],
    elements: [
      {
        id: 'bella-hero',
        type: 'hero',
        props: {
          title: 'Discover Your Style',
          subtitle: 'Curated fashion for the modern lifestyle',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          backgroundImage: '/templates/bella-hero.jpg',
          style: 'minimalist'
        }
      }
    ]
  },
  {
    id: 'quadra-footwear',
    name: 'Quadra Footwear',
    category: 'E-commerce',
    description: 'Specialized template for footwear and shoe stores',
    thumbnail: '/templates/quadra-footwear.svg',
    isPremium: true,
    tags: ['footwear', 'shoes', 'sports', 'ecommerce'],
    pages: ['home', 'shoes', 'brands', 'sizing', 'contact'],
    features: ['size-calculator', 'color-variants', '360-view', 'reviews'],
    elements: [
      {
        id: 'quadra-product-grid',
        type: 'product-grid',
        props: {
          layout: 'grid',
          columns: 4,
          showFilters: true,
          showSorting: true,
          products: []
        }
      }
    ]
  },
  {
    id: 'snoop-urban',
    name: 'Snoop Urban',
    category: 'E-commerce',
    description: 'Hip urban template for fashion and lifestyle brands',
    thumbnail: '/templates/snoop-urban.svg',
    isPremium: true,
    tags: ['urban', 'streetwear', 'fashion', 'lifestyle'],
    pages: ['home', 'streetwear', 'accessories', 'about', 'contact'],
    features: ['street-style-gallery', 'social-integration', 'limited-editions'],
    elements: [
      {
        id: 'snoop-hero',
        type: 'hero',
        props: {
          title: 'Urban Lifestyle',
          subtitle: 'Streetwear that defines your style',
          buttonText: 'Explore Collection',
          buttonLink: '/streetwear',
          backgroundImage: '/templates/snoop-hero.jpg',
          style: 'urban'
        }
      }
    ]
  },
  
  // === NEW BUSINESS TEMPLATES ===
  {
    id: 'hyperion-startup',
    name: 'Hyperion Startup',
    category: 'Business',
    description: 'Stunning template for startups and tech businesses',
    thumbnail: '/templates/hyperion-startup.svg',
    isPremium: true,
    tags: ['startup', 'tech', 'saas', 'modern'],
    pages: ['home', 'features', 'pricing', 'about', 'contact'],
    features: ['animated-elements', 'pricing-tables', 'testimonials', 'cta'],
    elements: [
      {
        id: 'hyperion-hero',
        type: 'hero',
        props: {
          title: 'Revolutionary Technology',
          subtitle: 'Transform your business with our innovative solutions',
          buttonText: 'Start Free Trial',
          buttonLink: '/signup',
          backgroundImage: '/templates/hyperion-hero.jpg',
          style: 'tech'
        }
      }
    ]
  },
  {
    id: 'callisto-consulting',
    name: 'Callisto Consulting',
    category: 'Business',
    description: 'Professional template for consulting companies and agencies',
    thumbnail: '/templates/callisto-consulting.svg',
    isPremium: true,
    tags: ['consulting', 'agency', 'professional', 'services'],
    pages: ['home', 'services', 'case-studies', 'team', 'contact'],
    features: ['case-studies', 'team-profiles', 'service-packages', 'testimonials'],
    elements: [
      {
        id: 'callisto-services',
        type: 'services',
        props: {
          title: 'Our Services',
          services: [
            {
              title: 'Strategy Consulting',
              description: 'Strategic planning and business development',
              icon: 'target'
            },
            {
              title: 'Digital Transformation',
              description: 'Modernize your business processes',
              icon: 'zap'
            },
            {
              title: 'Growth Marketing',
              description: 'Scale your business with proven strategies',
              icon: 'trending-up'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'ideapro-saas',
    name: 'IdeaPro SaaS',
    category: 'Business',
    description: 'User-friendly template for SaaS startups and tech companies',
    thumbnail: '/templates/ideapro-saas.svg',
    isPremium: true,
    tags: ['saas', 'startup', 'tech', 'ui-kit'],
    pages: ['home', 'features', 'pricing', 'blog', 'contact'],
    features: ['interactive-elements', 'pricing-calculator', 'demo-videos', 'api-docs'],
    elements: [
      {
        id: 'ideapro-features',
        type: 'features',
        props: {
          title: 'Powerful Features',
          layout: 'grid',
          columns: 3,
          features: [
            {
              icon: 'shield',
              title: 'Enterprise Security',
              description: 'Bank-level security for your data'
            },
            {
              icon: 'zap',
              title: 'Lightning Fast',
              description: 'Optimized for speed and performance'
            },
            {
              icon: 'users',
              title: 'Team Collaboration',
              description: 'Work together seamlessly'
            }
          ]
        }
      }
    ]
  },
  
  // === NEW RESTAURANT TEMPLATES ===
  {
    id: 'fruitkha-food',
    name: 'Fruitkha Food',
    category: 'Restaurant',
    description: 'Eye-catching template for food businesses and restaurants',
    thumbnail: '/templates/fruitkha-food.svg',
    isPremium: false,
    tags: ['food', 'restaurant', 'delivery', 'bootstrap'],
    pages: ['home', 'menu', 'about', 'delivery', 'contact'],
    features: ['menu-display', 'online-ordering', 'delivery-tracking', 'reviews'],
    localizedFor: 'pk',
    elements: [
      {
        id: 'fruitkha-hero',
        type: 'hero',
        props: {
          title: 'Fresh & Delicious',
          subtitle: 'Authentic Pakistani cuisine delivered to your door',
          buttonText: 'Order Now',
          buttonLink: '/menu',
          backgroundImage: '/templates/fruitkha-hero.jpg',
          style: 'food'
        }
      }
    ]
  },
  {
    id: 'yogart-studio',
    name: 'Yogart Studio',
    category: 'Fitness',
    description: 'Perfect template for yoga studios and wellness centers',
    thumbnail: '/templates/yogart-studio.svg',
    isPremium: true,
    tags: ['yoga', 'wellness', 'fitness', 'studio'],
    pages: ['home', 'classes', 'instructors', 'schedule', 'contact'],
    features: ['class-schedule', 'instructor-profiles', 'booking-system', 'meditation-timer'],
    elements: [
      {
        id: 'yogart-hero',
        type: 'hero',
        props: {
          title: 'Find Your Inner Peace',
          subtitle: 'Transform your mind and body through yoga',
          buttonText: 'Book Class',
          buttonLink: '/schedule',
          backgroundImage: '/templates/yogart-hero.jpg',
          style: 'wellness'
        }
      }
    ]
  },
  
  // === NEW MEDICAL TEMPLATES ===
  {
    id: 'medcare-clinic',
    name: 'MedCare Clinic',
    category: 'Medical',
    description: 'Professional medical clinic and healthcare template',
    thumbnail: '/templates/medcare-clinic.svg',
    isPremium: true,
    tags: ['medical', 'clinic', 'healthcare', 'appointment'],
    pages: ['home', 'services', 'doctors', 'appointments', 'contact'],
    features: ['appointment-booking', 'doctor-profiles', 'patient-portal', 'telemedicine'],
    localizedFor: 'pk',
    elements: [
      {
        id: 'medcare-hero',
        type: 'hero',
        props: {
          title: 'Your Health, Our Priority',
          subtitle: 'Professional healthcare services in Pakistan',
          buttonText: 'Book Appointment',
          buttonLink: '/appointments',
          backgroundImage: '/templates/medcare-hero.jpg',
          style: 'medical'
        }
      }
    ]
  },
  
  // === NEW SPECIALIZED TEMPLATES ===
  {
    id: 'toystore-kids',
    name: 'ToyStore Kids',
    category: 'E-commerce',
    description: 'Clean and minimalistic template for toy stores',
    thumbnail: '/templates/toystore-kids.svg',
    isPremium: false,
    tags: ['toys', 'kids', 'children', 'ecommerce'],
    pages: ['home', 'toys', 'age-groups', 'about', 'contact'],
    features: ['age-filtering', 'safety-info', 'gift-wrapping', 'wishlist'],
    elements: [
      {
        id: 'toystore-hero',
        type: 'hero',
        props: {
          title: 'Fun for Every Child',
          subtitle: 'Quality toys that spark imagination and creativity',
          buttonText: 'Shop Toys',
          buttonLink: '/toys',
          backgroundImage: '/templates/toystore-hero.jpg',
          style: 'playful'
        }
      }
    ]
  },
  {
    id: 'electro-electronics',
    name: 'Electro Electronics',
    category: 'E-commerce',
    description: 'Modern template for electronics and home appliances',
    thumbnail: '/templates/electro-electronics.svg',
    isPremium: true,
    tags: ['electronics', 'appliances', 'tech', 'ecommerce'],
    pages: ['home', 'products', 'categories', 'compare', 'contact'],
    features: ['product-comparison', 'specifications', 'warranty-info', 'tech-support'],
    elements: [
      {
        id: 'electro-product-grid',
        type: 'product-grid',
        props: {
          layout: 'grid',
          columns: 4,
          showFilters: true,
          showComparison: true,
          products: []
        }
      }
    ]
  },
  {
    id: 'carvilla-automotive',
    name: 'Carvilla Automotive',
    category: 'E-commerce',
    description: 'Clean template for automotive and car-related stores',
    thumbnail: '/templates/carvilla-automotive.svg',
    isPremium: true,
    tags: ['automotive', 'cars', 'parts', 'ecommerce'],
    pages: ['home', 'vehicles', 'parts', 'services', 'contact'],
    features: ['vehicle-search', 'part-finder', 'service-booking', 'financing'],
    elements: [
      {
        id: 'carvilla-hero',
        type: 'hero',
        props: {
          title: 'Your Dream Car Awaits',
          subtitle: 'Find the perfect vehicle for your needs',
          buttonText: 'Browse Cars',
          buttonLink: '/vehicles',
          backgroundImage: '/templates/carvilla-hero.jpg',
          style: 'automotive'
        }
      }
    ]
  },
  
  // === NEW CREATIVE TEMPLATES ===
  {
    id: 'bermuda-interior',
    name: 'Bermuda Interior',
    category: 'E-commerce',
    description: 'Versatile template for furniture and interior design',
    thumbnail: '/templates/bermuda-interior.svg',
    isPremium: true,
    tags: ['furniture', 'interior-design', 'home-decor', 'ecommerce'],
    pages: ['home', 'furniture', 'rooms', 'designer', 'contact'],
    features: ['room-planner', '3d-visualization', 'designer-profiles', 'style-quiz'],
    elements: [
      {
        id: 'bermuda-room-showcase',
        type: 'gallery',
        props: {
          title: 'Inspired Living Spaces',
          layout: 'masonry',
          images: [],
          showCategories: true
        }
      }
    ]
  },
  {
    id: 'saasy-tech',
    name: 'Saasy Tech',
    category: 'Business',
    description: 'Premium template for tech startups and SaaS companies',
    thumbnail: '/templates/saasy-tech.svg',
    isPremium: true,
    tags: ['saas', 'tech', 'startup', 'isometric'],
    pages: ['home', 'features', 'pricing', 'blog', 'contact'],
    features: ['isometric-graphics', 'interactive-demos', 'api-documentation', 'status-page'],
    elements: [
      {
        id: 'saasy-pricing',
        type: 'pricing',
        props: {
          title: 'Choose Your Plan',
          currency: 'USD',
          plans: [
            {
              name: 'Starter',
              price: 29,
              features: ['5 Projects', 'Basic Support', '1GB Storage'],
              highlighted: false
            },
            {
              name: 'Professional',
              price: 99,
              features: ['Unlimited Projects', 'Priority Support', '10GB Storage'],
              highlighted: true
            },
            {
              name: 'Enterprise',
              price: 299,
              features: ['Everything', '24/7 Support', 'Unlimited Storage'],
              highlighted: false
            }
          ]
        }
      }
    ]
  },
  
  // === ADDITIONAL 100+ TEMPLATES - BATCH 1 ===
  
  // === BUSINESS & CORPORATE TEMPLATES ===
  {
    id: 'technoxit-it',
    name: 'Technoxit IT',
    category: 'Business',
    description: 'IT solutions and business services multipurpose template',
    thumbnail: '/templates/technoxit-it.svg',
    isPremium: true,
    tags: ['it', 'technology', 'services', 'corporate'],
    pages: ['home', 'services', 'about', 'portfolio', 'contact'],
    features: ['service-showcase', 'team-profiles', 'testimonials', 'contact-form']
  },
  {
    id: 'lead-planner-coaching',
    name: 'Lead Planner Coaching',
    category: 'Business',
    description: 'Business coach template for mentoring and course sales',
    thumbnail: '/templates/lead-planner-coaching.svg',
    isPremium: true,
    tags: ['coaching', 'mentoring', 'courses', 'business'],
    pages: ['home', 'courses', 'about', 'testimonials', 'contact'],
    features: ['course-catalog', 'booking-system', 'testimonials', 'pricing']
  },
  {
    id: 'fward-corporate',
    name: 'Fward Corporate',
    category: 'Business',
    description: 'Corporate website template for businesses and entrepreneurs',
    thumbnail: '/templates/fward-corporate.svg',
    isPremium: false,
    tags: ['corporate', 'business', 'professional', 'entrepreneur'],
    pages: ['home', 'about', 'services', 'portfolio', 'contact'],
    features: ['service-packages', 'portfolio-showcase', 'team-section', 'contact-form']
  },
  {
    id: 'crafter-multipurpose',
    name: 'Crafter Multipurpose',
    category: 'Business',
    description: 'Modern Bootstrap 4 multipurpose template',
    thumbnail: '/templates/crafter-multipurpose.svg',
    isPremium: false,
    tags: ['multipurpose', 'bootstrap', 'modern', 'responsive'],
    pages: ['home', 'about', 'services', 'portfolio', 'blog', 'contact'],
    features: ['responsive', 'blog', 'portfolio', 'contact-form']
  },
  {
    id: 'brave-theme-interior',
    name: 'Brave Theme Interior',
    category: 'Business',
    description: 'Multipurpose template for interior, furniture, and fashion',
    thumbnail: '/templates/brave-theme-interior.svg',
    isPremium: true,
    tags: ['interior', 'furniture', 'fashion', 'multipurpose'],
    pages: ['home', 'products', 'gallery', 'about', 'contact'],
    features: ['product-gallery', 'interior-showcase', 'contact-form']
  },
  
  // === ECOMMERCE TEMPLATES ===
  {
    id: 'jordan-electronics',
    name: 'Jordan Electronics',
    category: 'E-commerce',
    description: 'Clean ecommerce template for digital and electronic stores',
    thumbnail: '/templates/jordan-electronics.svg',
    isPremium: true,
    tags: ['electronics', 'digital', 'ecommerce', 'clean'],
    pages: ['home', 'products', 'categories', 'cart', 'checkout'],
    features: ['product-comparison', 'specifications', 'reviews', 'wishlist']
  },
  {
    id: 'oregon-organic',
    name: 'Oregon Organic',
    category: 'E-commerce',
    description: 'Modern template for organic food shops and farms',
    thumbnail: '/templates/oregon-organic.svg',
    isPremium: true,
    tags: ['organic', 'food', 'farm', 'natural'],
    pages: ['home', 'products', 'farm-story', 'recipes', 'contact'],
    features: ['organic-certification', 'farm-story', 'recipe-blog', 'subscription']
  },
  {
    id: 'handy-tools',
    name: 'Handy Tools',
    category: 'E-commerce',
    description: 'Stylish template for tools and equipment stores',
    thumbnail: '/templates/handy-tools.svg',
    isPremium: true,
    tags: ['tools', 'equipment', 'hardware', 'industrial'],
    pages: ['home', 'tools', 'categories', 'brands', 'contact'],
    features: ['tool-search', 'compatibility-checker', 'installation-guides', 'warranty']
  },
  {
    id: 'phamaci-pharmacy',
    name: 'Phamaci Pharmacy',
    category: 'E-commerce',
    description: 'Template for pharmacy shops and healthcare stores',
    thumbnail: '/templates/phamaci-pharmacy.svg',
    isPremium: true,
    tags: ['pharmacy', 'healthcare', 'medicine', 'medical'],
    pages: ['home', 'medicines', 'prescriptions', 'health-tips', 'contact'],
    features: ['prescription-upload', 'medicine-search', 'health-tips', 'delivery-tracking'],
    localizedFor: 'pk'
  },
  
  // === CREATIVE & PORTFOLIO TEMPLATES ===
  {
    id: 'wink-portfolio',
    name: 'Wink Portfolio',
    category: 'Portfolio',
    description: 'Multipurpose portfolio template with creative minimal design',
    thumbnail: '/templates/wink-portfolio.svg',
    isPremium: true,
    tags: ['portfolio', 'creative', 'minimal', 'multipurpose'],
    pages: ['home', 'portfolio', 'about', 'services', 'contact'],
    features: ['portfolio-gallery', 'project-showcase', 'skills-section', 'contact-form']
  },
  {
    id: 'photography-studio',
    name: 'Photography Studio',
    category: 'Portfolio',
    description: 'Responsive template for photographers to showcase work',
    thumbnail: '/templates/photography-studio.svg',
    isPremium: true,
    tags: ['photography', 'portfolio', 'gallery', 'visual'],
    pages: ['home', 'gallery', 'about', 'services', 'contact'],
    features: ['photo-gallery', 'lightbox', 'booking-system', 'testimonials']
  },
  {
    id: 'davis-photographer',
    name: 'Davis Photographer',
    category: 'Portfolio',
    description: 'Free template for photographers seeking stylish portfolio',
    thumbnail: '/templates/davis-photographer.svg',
    isPremium: false,
    tags: ['photography', 'portfolio', 'free', 'stylish'],
    pages: ['home', 'portfolio', 'about', 'contact'],
    features: ['photo-gallery', 'about-section', 'contact-form']
  },
  {
    id: 'multiverse-gallery',
    name: 'Multiverse Gallery',
    category: 'Portfolio',
    description: 'Gallery-style template for visual portfolios',
    thumbnail: '/templates/multiverse-gallery.svg',
    isPremium: false,
    tags: ['gallery', 'visual', 'portfolio', 'grid'],
    pages: ['home', 'gallery', 'about', 'contact'],
    features: ['masonry-gallery', 'filtering', 'lightbox', 'responsive']
  },
  {
    id: 'editorial-magazine',
    name: 'Editorial Magazine',
    category: 'Blog',
    description: 'Magazine-style layout for blogs and publications',
    thumbnail: '/templates/editorial-magazine.svg',
    isPremium: false,
    tags: ['magazine', 'blog', 'editorial', 'news'],
    pages: ['home', 'articles', 'categories', 'about', 'contact'],
    features: ['article-layout', 'categories', 'search', 'newsletter']
  },
  {
    id: 'photon-minimal',
    name: 'Photon Minimal',
    category: 'Portfolio',
    description: 'Minimalist design for photographers and creatives',
    thumbnail: '/templates/photon-minimal.svg',
    isPremium: false,
    tags: ['minimalist', 'photography', 'clean', 'simple'],
    pages: ['home', 'work', 'about', 'contact'],
    features: ['minimal-gallery', 'clean-layout', 'contact-form']
  },
  {
    id: 'spectral-startup',
    name: 'Spectral Startup',
    category: 'Business',
    description: 'One-page template for startups and tech companies',
    thumbnail: '/templates/spectral-startup.svg',
    isPremium: false,
    tags: ['startup', 'one-page', 'tech', 'modern'],
    pages: ['home'],
    features: ['one-page', 'animated-sections', 'contact-form', 'cta']
  },
  {
    id: 'strata-personal',
    name: 'Strata Personal',
    category: 'Portfolio',
    description: 'Personal website template with clean design',
    thumbnail: '/templates/strata-personal.svg',
    isPremium: false,
    tags: ['personal', 'portfolio', 'clean', 'resume'],
    pages: ['home', 'about', 'portfolio', 'contact'],
    features: ['personal-info', 'portfolio-showcase', 'skills', 'contact-form']
  },
  
  // === RESTAURANT & FOOD TEMPLATES ===
  {
    id: 'forkista-restaurant',
    name: 'Forkista Restaurant',
    category: 'Restaurant',
    description: 'Food and restaurant HTML5 template with modern design',
    thumbnail: '/templates/forkista-restaurant.svg',
    isPremium: true,
    tags: ['restaurant', 'food', 'modern', 'html5'],
    pages: ['home', 'menu', 'about', 'reservations', 'contact'],
    features: ['menu-display', 'reservation-system', 'gallery', 'reviews'],
    localizedFor: 'pk'
  },
  {
    id: 'pizzahous-pizza',
    name: 'PizzaHous Pizza',
    category: 'Restaurant',
    description: 'E-commerce template specifically for pizza restaurants',
    thumbnail: '/templates/pizzahous-pizza.svg',
    isPremium: true,
    tags: ['pizza', 'restaurant', 'ecommerce', 'delivery'],
    pages: ['home', 'menu', 'order', 'about', 'contact'],
    features: ['online-ordering', 'pizza-customizer', 'delivery-tracking', 'reviews'],
    localizedFor: 'pk'
  },
  {
    id: 'cafe-restaurant-free',
    name: 'Cafe Restaurant Free',
    category: 'Restaurant',
    description: 'Free template for cafes and restaurants',
    thumbnail: '/templates/cafe-restaurant-free.svg',
    isPremium: false,
    tags: ['cafe', 'restaurant', 'free', 'hospitality'],
    pages: ['home', 'menu', 'about', 'contact'],
    features: ['menu-display', 'gallery', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === HEALTH & MEDICAL TEMPLATES ===
  {
    id: 'solutech-security',
    name: 'Solutech Security',
    category: 'Business',
    description: 'CCTV and security responsive HTML5 template',
    thumbnail: '/templates/solutech-security.svg',
    isPremium: false,
    tags: ['security', 'cctv', 'surveillance', 'technology'],
    pages: ['home', 'services', 'products', 'about', 'contact'],
    features: ['service-showcase', 'product-catalog', 'security-tips', 'contact-form']
  },
  {
    id: 'beautyrel-salon',
    name: 'Beautyrel Salon',
    category: 'Business',
    description: 'Responsive template for beauty salons',
    thumbnail: '/templates/beautyrel-salon.svg',
    isPremium: false,
    tags: ['beauty', 'salon', 'spa', 'wellness'],
    pages: ['home', 'services', 'gallery', 'about', 'contact'],
    features: ['service-menu', 'booking-system', 'gallery', 'testimonials'],
    localizedFor: 'pk'
  },
  {
    id: 'medilab-healthcare',
    name: 'Medilab Healthcare',
    category: 'Medical',
    description: 'Healthcare and medical template',
    thumbnail: '/templates/medilab-healthcare.svg',
    isPremium: false,
    tags: ['healthcare', 'medical', 'clinic', 'hospital'],
    pages: ['home', 'services', 'doctors', 'appointments', 'contact'],
    features: ['appointment-booking', 'doctor-profiles', 'services', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === REAL ESTATE TEMPLATES ===
  {
    id: 'house-kraft-realestate',
    name: 'House Kraft Real Estate',
    category: 'Real Estate',
    description: 'Multipage template for real estate websites',
    thumbnail: '/templates/house-kraft-realestate.svg',
    isPremium: true,
    tags: ['real-estate', 'property', 'multipage', 'listings'],
    pages: ['home', 'properties', 'agents', 'about', 'contact'],
    features: ['property-search', 'agent-profiles', 'virtual-tours', 'mortgage-calculator'],
    localizedFor: 'pk'
  },
  {
    id: 'real-estate-free',
    name: 'Real Estate Free',
    category: 'Real Estate',
    description: 'Free template for real estate companies',
    thumbnail: '/templates/real-estate-free.svg',
    isPremium: false,
    tags: ['real-estate', 'property', 'free', 'listings'],
    pages: ['home', 'properties', 'about', 'contact'],
    features: ['property-listings', 'search-filter', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === TRAVEL & TOURISM TEMPLATES ===
  {
    id: 'travelum-tours',
    name: 'Travelum Tours',
    category: 'Travel',
    description: 'Responsive tour and travel template',
    thumbnail: '/templates/travelum-tours.svg',
    isPremium: true,
    tags: ['travel', 'tours', 'tourism', 'vacation'],
    pages: ['home', 'destinations', 'packages', 'about', 'book'],
    features: ['destination-gallery', 'package-booking', 'testimonials', 'travel-tips'],
    localizedFor: 'pk'
  },
  {
    id: 'travel-agency-free',
    name: 'Travel Agency Free',
    category: 'Travel',
    description: 'Free multipage HTML5 template for travel agencies',
    thumbnail: '/templates/travel-agency-free.svg',
    isPremium: false,
    tags: ['travel', 'agency', 'free', 'tourism'],
    pages: ['home', 'destinations', 'packages', 'about', 'contact'],
    features: ['destination-showcase', 'package-listing', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === EDUCATION TEMPLATES ===
  {
    id: 'learning-center-education',
    name: 'Learning Center Education',
    category: 'Education',
    description: 'Responsive HTML5 template for language centers and educational institutions',
    thumbnail: '/templates/learning-center-education.svg',
    isPremium: false,
    tags: ['education', 'learning', 'language', 'institution'],
    pages: ['home', 'courses', 'instructors', 'about', 'enroll'],
    features: ['course-catalog', 'instructor-profiles', 'enrollment-system', 'testimonials'],
    localizedFor: 'pk'
  },
  
  // === NON-PROFIT TEMPLATES ===
  {
    id: 'social-organization-charity',
    name: 'Social Organization Charity',
    category: 'Non-Profit',
    description: 'Template for social organizations and charities',
    thumbnail: '/templates/social-organization-charity.svg',
    isPremium: false,
    tags: ['charity', 'nonprofit', 'social', 'organization'],
    pages: ['home', 'about', 'causes', 'donate', 'volunteer', 'contact'],
    features: ['donation-system', 'cause-showcase', 'volunteer-signup', 'impact-stories'],
    localizedFor: 'pk'
  },
  
  // === TECHNOLOGY & SOFTWARE TEMPLATES ===
  {
    id: 'saaspricing-pro',
    name: 'SaaS Pricing Pro',
    category: 'Business',
    description: 'Advanced pricing table template for SaaS companies',
    thumbnail: '/templates/saaspricing-pro.svg',
    isPremium: true,
    tags: ['saas', 'pricing', 'software', 'subscription'],
    pages: ['home', 'features', 'pricing', 'about', 'contact'],
    features: ['pricing-calculator', 'feature-comparison', 'testimonials', 'cta']
  },
  {
    id: 'bizpage-corporate',
    name: 'BizPage Corporate',
    category: 'Business',
    description: 'Corporate business template',
    thumbnail: '/templates/bizpage-corporate.svg',
    isPremium: false,
    tags: ['corporate', 'business', 'professional', 'company'],
    pages: ['home', 'about', 'services', 'portfolio', 'contact'],
    features: ['service-showcase', 'team-profiles', 'testimonials', 'contact-form']
  },
  {
    id: 'estartup-startup',
    name: 'EStartup Startup',
    category: 'Business',
    description: 'Startup-focused design template',
    thumbnail: '/templates/estartup-startup.svg',
    isPremium: false,
    tags: ['startup', 'tech', 'modern', 'innovative'],
    pages: ['home', 'features', 'about', 'team', 'contact'],
    features: ['feature-showcase', 'team-section', 'testimonials', 'cta']
  },
  {
    id: 'regna-agency',
    name: 'Regna Agency',
    category: 'Business',
    description: 'Agency and company template',
    thumbnail: '/templates/regna-agency.svg',
    isPremium: false,
    tags: ['agency', 'company', 'services', 'professional'],
    pages: ['home', 'about', 'services', 'portfolio', 'contact'],
    features: ['service-packages', 'portfolio-showcase', 'team-profiles', 'testimonials']
  },
  {
    id: 'reveal-creative',
    name: 'Reveal Creative',
    category: 'Portfolio',
    description: 'Creative portfolio template',
    thumbnail: '/templates/reveal-creative.svg',
    isPremium: false,
    tags: ['creative', 'portfolio', 'artistic', 'showcase'],
    pages: ['home', 'portfolio', 'about', 'contact'],
    features: ['portfolio-gallery', 'project-showcase', 'skills-section', 'contact-form']
  },
  
  // === MUSIC & ENTERTAINMENT TEMPLATES ===
  {
    id: 'music-band-template',
    name: 'Music Band Template',
    category: 'Entertainment',
    description: 'Template for musicians and bands',
    thumbnail: '/templates/music-band-template.svg',
    isPremium: false,
    tags: ['music', 'band', 'musician', 'entertainment'],
    pages: ['home', 'music', 'tour', 'about', 'contact'],
    features: ['music-player', 'tour-dates', 'gallery', 'newsletter']
  },
  
  // === WEDDING & EVENTS TEMPLATES ===
  {
    id: 'wedding-template',
    name: 'Wedding Template',
    category: 'Events',
    description: 'Template for wedding events',
    thumbnail: '/templates/wedding-template.svg',
    isPremium: false,
    tags: ['wedding', 'events', 'celebration', 'romantic'],
    pages: ['home', 'story', 'gallery', 'rsvp', 'contact'],
    features: ['photo-gallery', 'rsvp-system', 'countdown-timer', 'gift-registry']
  },
  {
    id: 'unite-wedding',
    name: 'Unite Wedding',
    category: 'Events',
    description: 'Wedding theme with clean design',
    thumbnail: '/templates/unite-wedding.svg',
    isPremium: false,
    tags: ['wedding', 'clean', 'romantic', 'elegant'],
    pages: ['home', 'story', 'gallery', 'rsvp', 'contact'],
    features: ['story-section', 'photo-gallery', 'rsvp-form', 'countdown']
  },
  
  // === HOTEL & HOSPITALITY TEMPLATES ===
  {
    id: 'hotel-hospitality',
    name: 'Hotel Hospitality',
    category: 'Business',
    description: 'Template for hospitality businesses',
    thumbnail: '/templates/hotel-hospitality.svg',
    isPremium: false,
    tags: ['hotel', 'hospitality', 'accommodation', 'booking'],
    pages: ['home', 'rooms', 'amenities', 'booking', 'contact'],
    features: ['room-booking', 'amenities-showcase', 'gallery', 'reviews'],
    localizedFor: 'pk'
  },
  
  // === FITNESS & SPORTS TEMPLATES ===
  {
    id: 'fitness-gym-template',
    name: 'Fitness Gym Template',
    category: 'Fitness',
    description: 'Template for gyms and fitness centers',
    thumbnail: '/templates/fitness-gym-template.svg',
    isPremium: false,
    tags: ['fitness', 'gym', 'sports', 'health'],
    pages: ['home', 'classes', 'trainers', 'membership', 'contact'],
    features: ['class-schedule', 'trainer-profiles', 'membership-plans', 'booking']
  },
  
  // === CONSULTING TEMPLATES ===
  {
    id: 'consulting-professional',
    name: 'Consulting Professional',
    category: 'Business',
    description: 'Professional services layout template',
    thumbnail: '/templates/consulting-professional.svg',
    isPremium: false,
    tags: ['consulting', 'professional', 'services', 'business'],
    pages: ['home', 'services', 'about', 'testimonials', 'contact'],
    features: ['service-packages', 'case-studies', 'testimonials', 'contact-form']
  },
  
  // === NON-PROFIT ADDITIONAL TEMPLATES ===
  {
    id: 'nonprofit-charity',
    name: 'Non-Profit Charity',
    category: 'Non-Profit',
    description: 'Template for charitable organizations',
    thumbnail: '/templates/nonprofit-charity.svg',
    isPremium: false,
    tags: ['charity', 'nonprofit', 'donation', 'cause'],
    pages: ['home', 'about', 'causes', 'donate', 'contact'],
    features: ['donation-system', 'cause-showcase', 'impact-stories', 'volunteer-signup']
  },
  
  // === PERSONAL & BLOG TEMPLATES ===
  {
    id: 'personal-portfolio',
    name: 'Personal Portfolio',
    category: 'Portfolio',
    description: 'Showcase individual work template',
    thumbnail: '/templates/personal-portfolio.svg',
    isPremium: false,
    tags: ['personal', 'portfolio', 'individual', 'showcase'],
    pages: ['home', 'about', 'portfolio', 'contact'],
    features: ['personal-info', 'portfolio-showcase', 'skills', 'contact-form']
  },
  {
    id: 'shapely-business',
    name: 'Shapely Business',
    category: 'Business',
    description: 'One-page business template',
    thumbnail: '/templates/shapely-business.svg',
    isPremium: false,
    tags: ['business', 'one-page', 'corporate', 'modern'],
    pages: ['home'],
    features: ['one-page', 'service-showcase', 'testimonials', 'contact-form']
  },
  {
    id: 'illdy-multipurpose',
    name: 'Illdy Multipurpose',
    category: 'Business',
    description: 'Multipurpose WordPress theme',
    thumbnail: '/templates/illdy-multipurpose.svg',
    isPremium: false,
    tags: ['multipurpose', 'wordpress', 'business', 'responsive'],
    pages: ['home', 'about', 'services', 'portfolio', 'contact'],
    features: ['responsive', 'service-showcase', 'portfolio', 'contact-form']
  },
  {
    id: 'activello-blog',
    name: 'Activello Blog',
    category: 'Blog',
    description: 'Minimalist blog theme',
    thumbnail: '/templates/activello-blog.svg',
    isPremium: false,
    tags: ['blog', 'minimalist', 'content', 'writing'],
    pages: ['home', 'posts', 'categories', 'about', 'contact'],
    features: ['blog-layout', 'categories', 'search', 'comments']
  },
  {
    id: 'sparkling-blog',
    name: 'Sparkling Blog',
    category: 'Blog',
    description: 'Flat design theme for blogs',
    thumbnail: '/templates/sparkling-blog.svg',
    isPremium: false,
    tags: ['blog', 'flat-design', 'content', 'modern'],
    pages: ['home', 'posts', 'categories', 'about', 'contact'],
    features: ['blog-layout', 'categories', 'search', 'sidebar']
  },
  
  // === ESCAPE VELOCITY & OTHERS ===
  {
    id: 'escape-velocity-business',
    name: 'Escape Velocity Business',
    category: 'Business',
    description: 'Responsive business template',
    thumbnail: '/templates/escape-velocity-business.svg',
    isPremium: false,
    tags: ['business', 'responsive', 'corporate', 'modern'],
    pages: ['home', 'about', 'services', 'contact'],
    features: ['service-showcase', 'team-section', 'testimonials', 'contact-form']
  },
  {
    id: 'parallelism-portfolio',
    name: 'Parallelism Portfolio',
    category: 'Portfolio',
    description: 'Portfolio template with grid layout',
    thumbnail: '/templates/parallelism-portfolio.svg',
    isPremium: false,
    tags: ['portfolio', 'grid', 'creative', 'showcase'],
    pages: ['home', 'portfolio', 'about', 'contact'],
    features: ['grid-gallery', 'project-showcase', 'about-section', 'contact-form']
  },
  {
    id: 'fractal-blog',
    name: 'Fractal Blog',
    category: 'Blog',
    description: 'Minimalist blog template',
    thumbnail: '/templates/fractal-blog.svg',
    isPremium: false,
    tags: ['blog', 'minimalist', 'content', 'clean'],
    pages: ['home', 'posts', 'about', 'contact'],
    features: ['blog-layout', 'minimal-design', 'search', 'comments']
  },
  {
    id: 'directive-startup',
    name: 'Directive Startup',
    category: 'Business',
    description: 'One-page template for startups',
    thumbnail: '/templates/directive-startup.svg',
    isPremium: false,
    tags: ['startup', 'one-page', 'tech', 'modern'],
    pages: ['home'],
    features: ['one-page', 'feature-showcase', 'testimonials', 'cta']
  },
  {
    id: 'monochromed-photography',
    name: 'Monochromed Photography',
    category: 'Portfolio',
    description: 'Photography portfolio template',
    thumbnail: '/templates/monochromed-photography.svg',
    isPremium: false,
    tags: ['photography', 'portfolio', 'monochrome', 'visual'],
    pages: ['home', 'gallery', 'about', 'contact'],
    features: ['photo-gallery', 'lightbox', 'about-section', 'contact-form']
  },
  
  // === ADDITIONAL SPECIALIZED TEMPLATES ===
  {
    id: 'lawyer-legal',
    name: 'Lawyer Legal',
    category: 'Business',
    description: 'Professional template for law firms and legal services',
    thumbnail: '/templates/lawyer-legal.svg',
    isPremium: true,
    tags: ['lawyer', 'legal', 'law-firm', 'professional'],
    pages: ['home', 'practice-areas', 'attorneys', 'cases', 'contact'],
    features: ['practice-areas', 'attorney-profiles', 'case-studies', 'consultation-booking'],
    localizedFor: 'pk'
  },
  {
    id: 'accounting-finance',
    name: 'Accounting Finance',
    category: 'Business',
    description: 'Template for accounting and financial services',
    thumbnail: '/templates/accounting-finance.svg',
    isPremium: true,
    tags: ['accounting', 'finance', 'tax', 'professional'],
    pages: ['home', 'services', 'about', 'resources', 'contact'],
    features: ['service-packages', 'tax-calculator', 'resource-library', 'appointment-booking'],
    localizedFor: 'pk'
  },
  {
    id: 'insurance-agency',
    name: 'Insurance Agency',
    category: 'Business',
    description: 'Template for insurance agencies and brokers',
    thumbnail: '/templates/insurance-agency.svg',
    isPremium: true,
    tags: ['insurance', 'agency', 'broker', 'financial'],
    pages: ['home', 'insurance-types', 'quotes', 'claims', 'contact'],
    features: ['quote-calculator', 'insurance-types', 'claims-process', 'agent-locator'],
    localizedFor: 'pk'
  },
  {
    id: 'construction-building',
    name: 'Construction Building',
    category: 'Business',
    description: 'Template for construction and building companies',
    thumbnail: '/templates/construction-building.svg',
    isPremium: true,
    tags: ['construction', 'building', 'contractor', 'industrial'],
    pages: ['home', 'services', 'projects', 'about', 'contact'],
    features: ['project-gallery', 'service-showcase', 'certifications', 'quote-request'],
    localizedFor: 'pk'
  },
  {
    id: 'logistics-shipping',
    name: 'Logistics Shipping',
    category: 'Business',
    description: 'Template for logistics and shipping companies',
    thumbnail: '/templates/logistics-shipping.svg',
    isPremium: true,
    tags: ['logistics', 'shipping', 'freight', 'transportation'],
    pages: ['home', 'services', 'tracking', 'about', 'contact'],
    features: ['package-tracking', 'service-rates', 'route-calculator', 'customer-portal'],
    localizedFor: 'pk'
  },
  {
    id: 'agriculture-farming',
    name: 'Agriculture Farming',
    category: 'Business',
    description: 'Template for agriculture and farming businesses',
    thumbnail: '/templates/agriculture-farming.svg',
    isPremium: true,
    tags: ['agriculture', 'farming', 'organic', 'rural'],
    pages: ['home', 'products', 'farm-story', 'sustainability', 'contact'],
    features: ['product-catalog', 'farm-story', 'sustainability-metrics', 'direct-ordering'],
    localizedFor: 'pk'
  },
  {
    id: 'pet-veterinary',
    name: 'Pet Veterinary',
    category: 'Medical',
    description: 'Template for veterinary clinics and pet services',
    thumbnail: '/templates/pet-veterinary.svg',
    isPremium: true,
    tags: ['veterinary', 'pet', 'animal', 'clinic'],
    pages: ['home', 'services', 'veterinarians', 'appointments', 'contact'],
    features: ['appointment-booking', 'veterinarian-profiles', 'pet-care-tips', 'emergency-info'],
    localizedFor: 'pk'
  },
  {
    id: 'dental-clinic',
    name: 'Dental Clinic',
    category: 'Medical',
    description: 'Template for dental clinics and practices',
    thumbnail: '/templates/dental-clinic.svg',
    isPremium: true,
    tags: ['dental', 'dentist', 'oral-health', 'clinic'],
    pages: ['home', 'services', 'dentists', 'appointments', 'contact'],
    features: ['appointment-booking', 'dental-services', 'dentist-profiles', 'oral-health-tips'],
    localizedFor: 'pk'
  },
  {
    id: 'psychology-therapy',
    name: 'Psychology Therapy',
    category: 'Medical',
    description: 'Template for psychology and therapy practices',
    thumbnail: '/templates/psychology-therapy.svg',
    isPremium: true,
    tags: ['psychology', 'therapy', 'mental-health', 'counseling'],
    pages: ['home', 'services', 'therapists', 'appointments', 'contact'],
    features: ['appointment-booking', 'therapy-types', 'therapist-profiles', 'mental-health-resources'],
    localizedFor: 'pk'
  },
  {
    id: 'pharmacy-drugstore',
    name: 'Pharmacy Drugstore',
    category: 'E-commerce',
    description: 'Template for pharmacy and drugstore chains',
    thumbnail: '/templates/pharmacy-drugstore.svg',
    isPremium: true,
    tags: ['pharmacy', 'drugstore', 'medicine', 'healthcare'],
    pages: ['home', 'medicines', 'prescriptions', 'health-tips', 'contact'],
    features: ['medicine-search', 'prescription-management', 'health-tips', 'delivery-service'],
    localizedFor: 'pk'
  },
  
  // === 2025 TRENDING TEMPLATES - BATCH 1 ===
  
  // === AI & TECH TEMPLATES ===
  {
    id: 'technoit-ai',
    name: 'Technoit AI',
    category: 'Business',
    description: 'Sleek responsive template for AI and IT solutions',
    thumbnail: '/templates/technoit-ai.svg',
    isPremium: true,
    tags: ['ai', 'technology', 'it-solutions', 'bootstrap5'],
    pages: ['home', 'services', 'solutions', 'about', 'contact'],
    features: ['ai-showcase', 'service-grid', 'tech-demos', 'contact-form']
  },
  {
    id: 'flex-it-digital',
    name: 'Flex-IT Digital',
    category: 'Business',
    description: 'Modern template for digital agencies and SEO firms',
    thumbnail: '/templates/flex-it-digital.svg',
    isPremium: true,
    tags: ['digital-agency', 'seo', 'web-development', 'modern'],
    pages: ['home', 'services', 'portfolio', 'about', 'contact'],
    features: ['portfolio-showcase', 'service-packages', 'case-studies', 'seo-tools']
  },
  {
    id: 'dreamsoft-development',
    name: 'DreamSoft Development',
    category: 'Business',
    description: 'Multipage template for software development agencies',
    thumbnail: '/templates/dreamsoft-development.svg',
    isPremium: true,
    tags: ['software-development', 'apps', 'multipage', 'responsive'],
    pages: ['home', 'services', 'apps', 'about', 'contact'],
    features: ['app-showcase', 'development-process', 'tech-stack', 'contact-form']
  },
  {
    id: 'advisora-finance',
    name: 'Advisora Finance',
    category: 'Business',
    description: 'Premium template for finance and SaaS industries',
    thumbnail: '/templates/advisora-finance.svg',
    isPremium: true,
    tags: ['finance', 'saas', 'premium', 'robust'],
    pages: ['home', 'features', 'pricing', 'about', 'contact'],
    features: ['pricing-tables', 'feature-comparison', 'testimonials', 'cta']
  },
  {
    id: 'miros-saas',
    name: 'Miros SaaS',
    category: 'Business',
    description: 'Tech-focused template for SaaS and software companies',
    thumbnail: '/templates/miros-saas.svg',
    isPremium: true,
    tags: ['saas', 'software', 'tech-focused', 'industry-specific'],
    pages: ['home', 'features', 'pricing', 'docs', 'contact'],
    features: ['feature-showcase', 'api-docs', 'pricing-calculator', 'demo-videos']
  },
  {
    id: 'darken-tech',
    name: 'Darken Tech',
    category: 'Business',
    description: 'Clean dark design for tech companies',
    thumbnail: '/templates/darken-tech.svg',
    isPremium: true,
    tags: ['tech', 'dark-mode', 'clean', 'cms'],
    pages: ['home', 'products', 'blog', 'about', 'contact'],
    features: ['dark-theme', 'tech-blog', 'product-showcase', 'contact-form']
  },
  {
    id: 'clikup-startup',
    name: 'Clikup Startup',
    category: 'Business',
    description: 'Modern design optimized for SaaS startups',
    thumbnail: '/templates/clikup-startup.svg',
    isPremium: true,
    tags: ['startup', 'saas', 'modern', 'optimized'],
    pages: ['home', 'features', 'pricing', 'about', 'contact'],
    features: ['feature-grid', 'pricing-tables', 'testimonials', 'signup-form']
  },
  {
    id: 'rampay-fintech',
    name: 'Rampay Fintech',
    category: 'Business',
    description: 'Template with real-time analytics for banking and fintech',
    thumbnail: '/templates/rampay-fintech.svg',
    isPremium: true,
    tags: ['fintech', 'banking', 'analytics', 'real-time'],
    pages: ['home', 'services', 'analytics', 'about', 'contact'],
    features: ['analytics-dashboard', 'service-showcase', 'security-features', 'contact-form']
  },
  
  // === CREATIVE & DESIGN TEMPLATES ===
  {
    id: 'mimo-design',
    name: 'Mimo Design',
    category: 'Portfolio',
    description: 'Sleek image-forward template for freelance designers',
    thumbnail: '/templates/mimo-design.svg',
    isPremium: true,
    tags: ['design', 'freelance', 'image-forward', 'sleek'],
    pages: ['home', 'portfolio', 'about', 'services', 'contact'],
    features: ['image-gallery', 'project-showcase', 'skills-section', 'contact-form']
  },
  {
    id: 'leadr-design',
    name: 'Leadr Design',
    category: 'Portfolio',
    description: 'Sophisticated template for creative coaches and service providers',
    thumbnail: '/templates/leadr-design.svg',
    isPremium: true,
    tags: ['creative-coaching', 'sophisticated', 'strategic', 'services'],
    pages: ['home', 'services', 'courses', 'about', 'contact'],
    features: ['course-showcase', 'service-packages', 'testimonials', 'booking-system']
  },
  {
    id: 'portfolio-bold',
    name: 'Portfolio Bold',
    category: 'Portfolio',
    description: 'Bold immersive template for photographers and illustrators',
    thumbnail: '/templates/portfolio-bold.svg',
    isPremium: true,
    tags: ['photography', 'illustration', 'bold', 'immersive'],
    pages: ['home', 'gallery', 'about', 'contact'],
    features: ['full-width-gallery', 'project-showcase', 'about-section', 'contact-form']
  },
  {
    id: 'rosalia-creative',
    name: 'Rosalia Creative',
    category: 'Portfolio',
    description: 'High-end design for creative professionals',
    thumbnail: '/templates/rosalia-creative.svg',
    isPremium: true,
    tags: ['creative', 'high-end', 'visual-content', 'professional'],
    pages: ['home', 'work', 'about', 'contact'],
    features: ['visual-gallery', 'content-management', 'about-section', 'contact-form']
  },
  
  // === SPECIALIZED INDUSTRY TEMPLATES ===
  {
    id: 'vetic-veterinary',
    name: 'Vetic Veterinary',
    category: 'Medical',
    description: 'Specialized template for veterinary and pet care services',
    thumbnail: '/templates/vetic-veterinary.svg',
    isPremium: true,
    tags: ['veterinary', 'pet-care', 'specialized', 'layouts'],
    pages: ['home', 'services', 'veterinarians', 'appointments', 'contact'],
    features: ['appointment-booking', 'veterinarian-profiles', 'pet-care-tips', 'emergency-info'],
    localizedFor: 'pk'
  },
  {
    id: 'elevates-architecture',
    name: 'Elevates Architecture',
    category: 'Business',
    description: 'Template for showcasing architectural projects',
    thumbnail: '/templates/elevates-architecture.svg',
    isPremium: true,
    tags: ['architecture', 'property-showcase', 'projects', 'management'],
    pages: ['home', 'projects', 'services', 'about', 'contact'],
    features: ['project-gallery', 'property-showcase', 'service-showcase', 'contact-form']
  },
  {
    id: 'legally-law',
    name: 'Legally Law',
    category: 'Business',
    description: 'Professional template for law firms and attorneys',
    thumbnail: '/templates/legally-law.svg',
    isPremium: true,
    tags: ['law-firm', 'attorney', 'legal', 'professional'],
    pages: ['home', 'practice-areas', 'attorneys', 'cases', 'contact'],
    features: ['practice-areas', 'attorney-profiles', 'case-studies', 'consultation-booking'],
    localizedFor: 'pk'
  },
  {
    id: 'harmoni-wellness',
    name: 'Harmoni Wellness',
    category: 'Fitness',
    description: 'Wellness-specific template for fitness and wellness industries',
    thumbnail: '/templates/harmoni-wellness.svg',
    isPremium: true,
    tags: ['wellness', 'fitness', 'specific-features', 'layouts'],
    pages: ['home', 'programs', 'trainers', 'booking', 'contact'],
    features: ['program-showcase', 'trainer-profiles', 'booking-system', 'wellness-tips']
  },
  
  // === ENTERTAINMENT & CREATIVE TEMPLATES ===
  {
    id: 'ebook-template',
    name: 'eBook Template',
    category: 'Business',
    description: 'One-page conversion-focused template for authors and digital creators',
    thumbnail: '/templates/ebook-template.svg',
    isPremium: true,
    tags: ['ebook', 'one-page', 'conversion', 'authors'],
    pages: ['home'],
    features: ['one-page', 'conversion-focused', 'book-showcase', 'purchase-form']
  },
  {
    id: 'tattoo-shop',
    name: 'Tattoo Shop',
    category: 'Business',
    description: 'Edgy urban template for tattoo artists and indie studios',
    thumbnail: '/templates/tattoo-shop.svg',
    isPremium: true,
    tags: ['tattoo', 'edgy', 'urban', 'booking'],
    pages: ['home', 'gallery', 'artists', 'booking', 'contact'],
    features: ['gallery-showcase', 'artist-profiles', 'booking-integration', 'contact-form']
  },
  {
    id: 'moon-band',
    name: 'Moon Band',
    category: 'Entertainment',
    description: 'Moody modern template for musicians and bands',
    thumbnail: '/templates/moon-band.svg',
    isPremium: true,
    tags: ['music', 'band', 'moody', 'modern'],
    pages: ['home', 'music', 'tour', 'about', 'contact'],
    features: ['audio-player', 'tour-dates', 'music-gallery', 'newsletter']
  },
  {
    id: 'festival-template',
    name: 'Festival Template',
    category: 'Events',
    description: 'Energetic colorful template for event hosts and festival organizers',
    thumbnail: '/templates/festival-template.svg',
    isPremium: true,
    tags: ['festival', 'events', 'energetic', 'colorful'],
    pages: ['home', 'lineup', 'schedule', 'tickets', 'contact'],
    features: ['lineup-showcase', 'schedule-timeline', 'ticket-booking', 'social-integration']
  },
  
  // === SUSTAINABILITY & GREEN TECH ===
  {
    id: 'green-energy',
    name: 'Green Energy',
    category: 'Business',
    description: 'Template for renewable energy and sustainability companies',
    thumbnail: '/templates/green-energy.svg',
    isPremium: true,
    tags: ['green-energy', 'sustainability', 'renewable', 'eco-friendly'],
    pages: ['home', 'solutions', 'impact', 'about', 'contact'],
    features: ['impact-metrics', 'solution-showcase', 'sustainability-stats', 'contact-form']
  },
  {
    id: 'eco-products',
    name: 'Eco Products',
    category: 'E-commerce',
    description: 'Template for eco-friendly and sustainable product stores',
    thumbnail: '/templates/eco-products.svg',
    isPremium: true,
    tags: ['eco-friendly', 'sustainable', 'green', 'products'],
    pages: ['home', 'products', 'sustainability', 'about', 'contact'],
    features: ['product-catalog', 'sustainability-info', 'eco-certifications', 'shopping-cart']
  },
  {
    id: 'carbon-tracker',
    name: 'Carbon Tracker',
    category: 'Business',
    description: 'Template for carbon tracking and environmental services',
    thumbnail: '/templates/carbon-tracker.svg',
    isPremium: true,
    tags: ['carbon-tracking', 'environmental', 'sustainability', 'tracking'],
    pages: ['home', 'services', 'tracking', 'about', 'contact'],
    features: ['tracking-dashboard', 'service-showcase', 'environmental-impact', 'contact-form']
  },
  
  // === CRYPTO & BLOCKCHAIN ===
  {
    id: 'crypto-exchange',
    name: 'Crypto Exchange',
    category: 'Business',
    description: 'Template for cryptocurrency exchanges and trading platforms',
    thumbnail: '/templates/crypto-exchange.svg',
    isPremium: true,
    tags: ['crypto', 'exchange', 'trading', 'blockchain'],
    pages: ['home', 'trading', 'markets', 'about', 'contact'],
    features: ['trading-dashboard', 'market-data', 'crypto-prices', 'user-portal']
  },
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
    category: 'E-commerce',
    description: 'Template for NFT marketplaces and digital art platforms',
    thumbnail: '/templates/nft-marketplace.svg',
    isPremium: true,
    tags: ['nft', 'marketplace', 'digital-art', 'blockchain'],
    pages: ['home', 'marketplace', 'collections', 'about', 'contact'],
    features: ['nft-gallery', 'auction-system', 'wallet-integration', 'creator-profiles']
  },
  {
    id: 'defi-platform',
    name: 'DeFi Platform',
    category: 'Business',
    description: 'Template for decentralized finance platforms',
    thumbnail: '/templates/defi-platform.svg',
    isPremium: true,
    tags: ['defi', 'decentralized', 'finance', 'blockchain'],
    pages: ['home', 'protocols', 'yield', 'about', 'contact'],
    features: ['protocol-showcase', 'yield-calculator', 'liquidity-pools', 'wallet-connect']
  },
  
  // === METAVERSE & VR ===
  {
    id: 'metaverse-world',
    name: 'Metaverse World',
    category: 'Business',
    description: 'Template for metaverse and virtual reality companies',
    thumbnail: '/templates/metaverse-world.svg',
    isPremium: true,
    tags: ['metaverse', 'vr', 'virtual-reality', 'immersive'],
    pages: ['home', 'worlds', 'experiences', 'about', 'contact'],
    features: ['vr-showcase', 'world-gallery', 'experience-booking', 'contact-form']
  },
  {
    id: 'virtual-events',
    name: 'Virtual Events',
    category: 'Events',
    description: 'Template for virtual event platforms and VR experiences',
    thumbnail: '/templates/virtual-events.svg',
    isPremium: true,
    tags: ['virtual-events', 'vr', 'online-events', 'immersive'],
    pages: ['home', 'events', 'vr-experiences', 'booking', 'contact'],
    features: ['event-showcase', 'vr-booking', 'experience-gallery', 'registration-form']
  },
  
  // === HEALTH TECH & TELEMEDICINE ===
  {
    id: 'telemedicine-platform',
    name: 'Telemedicine Platform',
    category: 'Medical',
    description: 'Template for telemedicine and remote healthcare platforms',
    thumbnail: '/templates/telemedicine-platform.svg',
    isPremium: true,
    tags: ['telemedicine', 'remote-healthcare', 'health-tech', 'platform'],
    pages: ['home', 'services', 'doctors', 'booking', 'contact'],
    features: ['video-consultation', 'doctor-profiles', 'appointment-booking', 'patient-portal'],
    localizedFor: 'pk'
  },
  {
    id: 'health-monitoring',
    name: 'Health Monitoring',
    category: 'Medical',
    description: 'Template for health monitoring and wellness tracking apps',
    thumbnail: '/templates/health-monitoring.svg',
    isPremium: true,
    tags: ['health-monitoring', 'wellness-tracking', 'health-tech', 'apps'],
    pages: ['home', 'features', 'tracking', 'about', 'contact'],
    features: ['tracking-dashboard', 'health-metrics', 'wellness-tips', 'app-download']
  },
  
  // === E-LEARNING & EDUTECH ===
  {
    id: 'online-academy-2025',
    name: 'Online Academy 2025',
    category: 'Education',
    description: 'Modern template for online learning platforms and academies',
    thumbnail: '/templates/online-academy-2025.svg',
    isPremium: true,
    tags: ['online-learning', 'academy', 'edutech', 'modern'],
    pages: ['home', 'courses', 'instructors', 'enrollment', 'contact'],
    features: ['course-catalog', 'instructor-profiles', 'enrollment-system', 'progress-tracking'],
    localizedFor: 'pk'
  },
  {
    id: 'skill-platform',
    name: 'Skill Platform',
    category: 'Education',
    description: 'Template for skill development and professional training platforms',
    thumbnail: '/templates/skill-platform.svg',
    isPremium: true,
    tags: ['skill-development', 'professional-training', 'learning', 'platform'],
    pages: ['home', 'skills', 'courses', 'certificates', 'contact'],
    features: ['skill-assessment', 'course-progression', 'certificate-system', 'progress-tracking']
  },
  
  // === SOCIAL COMMERCE ===
  {
    id: 'social-marketplace',
    name: 'Social Marketplace',
    category: 'E-commerce',
    description: 'Template for social commerce and community-driven marketplaces',
    thumbnail: '/templates/social-marketplace.svg',
    isPremium: true,
    tags: ['social-commerce', 'marketplace', 'community', 'social'],
    pages: ['home', 'marketplace', 'community', 'sellers', 'contact'],
    features: ['social-feeds', 'community-features', 'seller-profiles', 'social-sharing']
  },
  {
    id: 'influencer-platform',
    name: 'Influencer Platform',
    category: 'Business',
    description: 'Template for influencer marketing and creator economy platforms',
    thumbnail: '/templates/influencer-platform.svg',
    isPremium: true,
    tags: ['influencer', 'creator-economy', 'marketing', 'platform'],
    pages: ['home', 'creators', 'campaigns', 'brands', 'contact'],
    features: ['creator-profiles', 'campaign-management', 'brand-matching', 'analytics-dashboard']
  },
  
  // === 2025 TRENDING TEMPLATES - BATCH 2 ===
  
  // === MODERN DESIGN TRENDS ===
  {
    id: 'glassmorphism-modern',
    name: 'Glassmorphism Modern',
    category: 'Business',
    description: 'Template featuring glassmorphism design trend for modern businesses',
    thumbnail: '/templates/glassmorphism-modern.svg',
    isPremium: true,
    tags: ['glassmorphism', 'modern', 'glass-effect', 'trendy'],
    pages: ['home', 'about', 'services', 'contact'],
    features: ['glass-effects', 'modern-layout', 'smooth-animations', 'contact-form']
  },
  {
    id: 'dark-mode-premium',
    name: 'Dark Mode Premium',
    category: 'Business',
    description: 'Premium dark mode template for tech and creative companies',
    thumbnail: '/templates/dark-mode-premium.svg',
    isPremium: true,
    tags: ['dark-mode', 'premium', 'tech', 'creative'],
    pages: ['home', 'about', 'services', 'contact'],
    features: ['dark-theme', 'premium-design', 'smooth-transitions', 'contact-form']
  },
  {
    id: 'neomorphism-soft',
    name: 'Neomorphism Soft',
    category: 'Business',
    description: 'Soft neomorphism design template for modern applications',
    thumbnail: '/templates/neomorphism-soft.svg',
    isPremium: true,
    tags: ['neomorphism', 'soft', 'modern', 'applications'],
    pages: ['home', 'features', 'about', 'contact'],
    features: ['soft-shadows', 'modern-ui', 'feature-showcase', 'contact-form']
  },
  {
    id: 'brutalism-bold',
    name: 'Brutalism Bold',
    category: 'Business',
    description: 'Bold brutalism design template for creative agencies',
    thumbnail: '/templates/brutalism-bold.svg',
    isPremium: true,
    tags: ['brutalism', 'bold', 'creative', 'agencies'],
    pages: ['home', 'portfolio', 'about', 'contact'],
    features: ['bold-design', 'portfolio-showcase', 'creative-layout', 'contact-form']
  },
  
  // === AI & MACHINE LEARNING ===
  {
    id: 'ai-assistant-platform',
    name: 'AI Assistant Platform',
    category: 'Business',
    description: 'Template for AI assistant and chatbot platforms',
    thumbnail: '/templates/ai-assistant-platform.svg',
    isPremium: true,
    tags: ['ai-assistant', 'chatbot', 'platform', 'automation'],
    pages: ['home', 'features', 'demo', 'pricing', 'contact'],
    features: ['ai-demo', 'feature-showcase', 'pricing-tables', 'contact-form']
  },
  {
    id: 'machine-learning-lab',
    name: 'Machine Learning Lab',
    category: 'Business',
    description: 'Template for machine learning and data science companies',
    thumbnail: '/templates/machine-learning-lab.svg',
    isPremium: true,
    tags: ['machine-learning', 'data-science', 'lab', 'research'],
    pages: ['home', 'research', 'services', 'about', 'contact'],
    features: ['research-showcase', 'service-packages', 'team-profiles', 'contact-form']
  },
  {
    id: 'automation-suite',
    name: 'Automation Suite',
    category: 'Business',
    description: 'Template for business automation and workflow platforms',
    thumbnail: '/templates/automation-suite.svg',
    isPremium: true,
    tags: ['automation', 'workflow', 'business', 'suite'],
    pages: ['home', 'automation', 'workflows', 'pricing', 'contact'],
    features: ['workflow-showcase', 'automation-demo', 'pricing-calculator', 'contact-form']
  },
  
  // === REMOTE WORK & COLLABORATION ===
  {
    id: 'remote-work-hub',
    name: 'Remote Work Hub',
    category: 'Business',
    description: 'Template for remote work and collaboration platforms',
    thumbnail: '/templates/remote-work-hub.svg',
    isPremium: true,
    tags: ['remote-work', 'collaboration', 'hub', 'platform'],
    pages: ['home', 'features', 'tools', 'pricing', 'contact'],
    features: ['tool-showcase', 'collaboration-features', 'pricing-tables', 'contact-form']
  },
  {
    id: 'virtual-office',
    name: 'Virtual Office',
    category: 'Business',
    description: 'Template for virtual office and coworking platforms',
    thumbnail: '/templates/virtual-office.svg',
    isPremium: true,
    tags: ['virtual-office', 'coworking', 'platform', 'workspace'],
    pages: ['home', 'spaces', 'amenities', 'booking', 'contact'],
    features: ['space-showcase', 'amenities-list', 'booking-system', 'contact-form']
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    category: 'Business',
    description: 'Template for team collaboration and project management tools',
    thumbnail: '/templates/team-collaboration.svg',
    isPremium: true,
    tags: ['team-collaboration', 'project-management', 'tools', 'platform'],
    pages: ['home', 'features', 'integrations', 'pricing', 'contact'],
    features: ['feature-showcase', 'integration-list', 'pricing-tables', 'contact-form']
  },
  
  // === PERSONALIZATION & CUSTOMIZATION ===
  {
    id: 'personalization-engine',
    name: 'Personalization Engine',
    category: 'Business',
    description: 'Template for personalization and customization platforms',
    thumbnail: '/templates/personalization-engine.svg',
    isPremium: true,
    tags: ['personalization', 'customization', 'engine', 'platform'],
    pages: ['home', 'features', 'demo', 'pricing', 'contact'],
    features: ['personalization-demo', 'feature-showcase', 'pricing-tables', 'contact-form']
  },
  {
    id: 'custom-design-studio',
    name: 'Custom Design Studio',
    category: 'Business',
    description: 'Template for custom design and personalization services',
    thumbnail: '/templates/custom-design-studio.svg',
    isPremium: true,
    tags: ['custom-design', 'personalization', 'studio', 'services'],
    pages: ['home', 'services', 'portfolio', 'about', 'contact'],
    features: ['service-showcase', 'portfolio-gallery', 'customization-tools', 'contact-form']
  },
  
  // === MICRO-MOBILITY & TRANSPORTATION ===
  {
    id: 'micromobility-app',
    name: 'Micro-mobility App',
    category: 'Business',
    description: 'Template for micro-mobility and shared transportation apps',
    thumbnail: '/templates/micromobility-app.svg',
    isPremium: true,
    tags: ['micromobility', 'shared-transportation', 'app', 'platform'],
    pages: ['home', 'features', 'locations', 'download', 'contact'],
    features: ['app-showcase', 'location-map', 'download-links', 'contact-form']
  },
  {
    id: 'electric-vehicle-charging',
    name: 'Electric Vehicle Charging',
    category: 'Business',
    description: 'Template for electric vehicle charging networks and services',
    thumbnail: '/templates/electric-vehicle-charging.svg',
    isPremium: true,
    tags: ['electric-vehicles', 'charging', 'network', 'services'],
    pages: ['home', 'network', 'locations', 'services', 'contact'],
    features: ['network-map', 'location-finder', 'service-showcase', 'contact-form']
  },
  
  // === SPACE TECH & AEROSPACE ===
  {
    id: 'space-tech-company',
    name: 'Space Tech Company',
    category: 'Business',
    description: 'Template for space technology and aerospace companies',
    thumbnail: '/templates/space-tech-company.svg',
    isPremium: true,
    tags: ['space-tech', 'aerospace', 'technology', 'company'],
    pages: ['home', 'missions', 'technology', 'about', 'contact'],
    features: ['mission-showcase', 'tech-showcase', 'team-profiles', 'contact-form']
  },
  {
    id: 'satellite-services',
    name: 'Satellite Services',
    category: 'Business',
    description: 'Template for satellite services and space communication companies',
    thumbnail: '/templates/satellite-services.svg',
    isPremium: true,
    tags: ['satellite', 'space-communication', 'services', 'company'],
    pages: ['home', 'services', 'coverage', 'about', 'contact'],
    features: ['service-showcase', 'coverage-map', 'tech-specs', 'contact-form']
  },
  
  // === QUANTUM COMPUTING ===
  {
    id: 'quantum-computing-lab',
    name: 'Quantum Computing Lab',
    category: 'Business',
    description: 'Template for quantum computing research and development companies',
    thumbnail: '/templates/quantum-computing-lab.svg',
    isPremium: true,
    tags: ['quantum-computing', 'research', 'development', 'lab'],
    pages: ['home', 'research', 'technology', 'team', 'contact'],
    features: ['research-showcase', 'tech-explanations', 'team-profiles', 'contact-form']
  },
  
  // === BIOTECH & HEALTH INNOVATION ===
  {
    id: 'biotech-innovation',
    name: 'Biotech Innovation',
    category: 'Business',
    description: 'Template for biotechnology and health innovation companies',
    thumbnail: '/templates/biotech-innovation.svg',
    isPremium: true,
    tags: ['biotech', 'health-innovation', 'research', 'company'],
    pages: ['home', 'research', 'products', 'about', 'contact'],
    features: ['research-showcase', 'product-gallery', 'team-profiles', 'contact-form']
  },
  {
    id: 'gene-therapy-clinic',
    name: 'Gene Therapy Clinic',
    category: 'Medical',
    description: 'Template for gene therapy and advanced medical treatment clinics',
    thumbnail: '/templates/gene-therapy-clinic.svg',
    isPremium: true,
    tags: ['gene-therapy', 'advanced-medical', 'clinic', 'treatment'],
    pages: ['home', 'treatments', 'doctors', 'appointments', 'contact'],
    features: ['treatment-info', 'doctor-profiles', 'appointment-booking', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === SMART CITY SOLUTIONS ===
  {
    id: 'smart-city-platform',
    name: 'Smart City Platform',
    category: 'Business',
    description: 'Template for smart city solutions and urban technology platforms',
    thumbnail: '/templates/smart-city-platform.svg',
    isPremium: true,
    tags: ['smart-city', 'urban-technology', 'platform', 'solutions'],
    pages: ['home', 'solutions', 'cities', 'about', 'contact'],
    features: ['solution-showcase', 'city-showcase', 'tech-specs', 'contact-form']
  },
  {
    id: 'iot-solutions',
    name: 'IoT Solutions',
    category: 'Business',
    description: 'Template for Internet of Things and connected device solutions',
    thumbnail: '/templates/iot-solutions.svg',
    isPremium: true,
    tags: ['iot', 'connected-devices', 'solutions', 'platform'],
    pages: ['home', 'solutions', 'devices', 'about', 'contact'],
    features: ['device-showcase', 'solution-packages', 'tech-specs', 'contact-form']
  },
  
  // === CYBERSECURITY & PRIVACY ===
  {
    id: 'cybersecurity-firm',
    name: 'Cybersecurity Firm',
    category: 'Business',
    description: 'Template for cybersecurity firms and digital security services',
    thumbnail: '/templates/cybersecurity-firm.svg',
    isPremium: true,
    tags: ['cybersecurity', 'digital-security', 'firm', 'services'],
    pages: ['home', 'services', 'threats', 'about', 'contact'],
    features: ['service-packages', 'threat-analysis', 'security-tips', 'contact-form']
  },
  {
    id: 'privacy-protection',
    name: 'Privacy Protection',
    category: 'Business',
    description: 'Template for privacy protection and data security services',
    thumbnail: '/templates/privacy-protection.svg',
    isPremium: true,
    tags: ['privacy-protection', 'data-security', 'services', 'platform'],
    pages: ['home', 'services', 'compliance', 'about', 'contact'],
    features: ['service-showcase', 'compliance-info', 'security-features', 'contact-form']
  },
  
  // === AUGMENTED REALITY ===
  {
    id: 'ar-experience-platform',
    name: 'AR Experience Platform',
    category: 'Business',
    description: 'Template for augmented reality experience and AR development platforms',
    thumbnail: '/templates/ar-experience-platform.svg',
    isPremium: true,
    tags: ['augmented-reality', 'ar', 'experience', 'platform'],
    pages: ['home', 'experiences', 'development', 'about', 'contact'],
    features: ['ar-demo', 'experience-gallery', 'development-tools', 'contact-form']
  },
  {
    id: 'ar-commerce',
    name: 'AR Commerce',
    category: 'E-commerce',
    description: 'Template for AR-powered e-commerce and virtual shopping experiences',
    thumbnail: '/templates/ar-commerce.svg',
    isPremium: true,
    tags: ['ar-commerce', 'virtual-shopping', 'ecommerce', 'ar'],
    pages: ['home', 'products', 'ar-try', 'about', 'contact'],
    features: ['ar-product-viewer', 'virtual-try-on', 'product-gallery', 'shopping-cart']
  },
  
  // === BLOCKCHAIN & WEB3 ===
  {
    id: 'web3-platform',
    name: 'Web3 Platform',
    category: 'Business',
    description: 'Template for Web3 and decentralized web platforms',
    thumbnail: '/templates/web3-platform.svg',
    isPremium: true,
    tags: ['web3', 'decentralized', 'platform', 'blockchain'],
    pages: ['home', 'features', 'ecosystem', 'about', 'contact'],
    features: ['web3-features', 'ecosystem-map', 'decentralization-info', 'contact-form']
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance',
    category: 'Business',
    description: 'Template for DAO governance and decentralized autonomous organizations',
    thumbnail: '/templates/dao-governance.svg',
    isPremium: true,
    tags: ['dao', 'governance', 'decentralized', 'autonomous'],
    pages: ['home', 'governance', 'proposals', 'about', 'contact'],
    features: ['governance-tools', 'proposal-system', 'voting-interface', 'contact-form']
  },
  
  // === SUSTAINABLE FASHION ===
  {
    id: 'sustainable-fashion',
    name: 'Sustainable Fashion',
    category: 'E-commerce',
    description: 'Template for sustainable fashion and ethical clothing brands',
    thumbnail: '/templates/sustainable-fashion.svg',
    isPremium: true,
    tags: ['sustainable-fashion', 'ethical-clothing', 'eco-friendly', 'fashion'],
    pages: ['home', 'collections', 'sustainability', 'about', 'contact'],
    features: ['collection-gallery', 'sustainability-metrics', 'ethical-info', 'shopping-cart']
  },
  {
    id: 'circular-economy',
    name: 'Circular Economy',
    category: 'Business',
    description: 'Template for circular economy and waste reduction platforms',
    thumbnail: '/templates/circular-economy.svg',
    isPremium: true,
    tags: ['circular-economy', 'waste-reduction', 'sustainability', 'platform'],
    pages: ['home', 'solutions', 'impact', 'about', 'contact'],
    features: ['solution-showcase', 'impact-metrics', 'sustainability-stats', 'contact-form']
  },
  
  // === MENTAL HEALTH TECH ===
  {
    id: 'mental-health-app',
    name: 'Mental Health App',
    category: 'Medical',
    description: 'Template for mental health and wellness applications',
    thumbnail: '/templates/mental-health-app.svg',
    isPremium: true,
    tags: ['mental-health', 'wellness', 'app', 'platform'],
    pages: ['home', 'features', 'resources', 'download', 'contact'],
    features: ['app-features', 'wellness-resources', 'download-links', 'contact-form'],
    localizedFor: 'pk'
  },
  {
    id: 'meditation-platform',
    name: 'Meditation Platform',
    category: 'Fitness',
    description: 'Template for meditation and mindfulness platforms',
    thumbnail: '/templates/meditation-platform.svg',
    isPremium: true,
    tags: ['meditation', 'mindfulness', 'platform', 'wellness'],
    pages: ['home', 'programs', 'instructors', 'subscription', 'contact'],
    features: ['program-showcase', 'instructor-profiles', 'subscription-plans', 'contact-form']
  },
  
  // === FOOD TECH & DELIVERY ===
  {
    id: 'food-tech-platform',
    name: 'Food Tech Platform',
    category: 'Business',
    description: 'Template for food technology and delivery platforms',
    thumbnail: '/templates/food-tech-platform.svg',
    isPremium: true,
    tags: ['food-tech', 'delivery', 'platform', 'technology'],
    pages: ['home', 'services', 'partners', 'about', 'contact'],
    features: ['service-showcase', 'partner-network', 'tech-features', 'contact-form'],
    localizedFor: 'pk'
  },
  {
    id: 'ghost-kitchen',
    name: 'Ghost Kitchen',
    category: 'Business',
    description: 'Template for ghost kitchen and virtual restaurant platforms',
    thumbnail: '/templates/ghost-kitchen.svg',
    isPremium: true,
    tags: ['ghost-kitchen', 'virtual-restaurant', 'platform', 'food'],
    pages: ['home', 'brands', 'kitchens', 'about', 'contact'],
    features: ['brand-showcase', 'kitchen-locations', 'service-info', 'contact-form'],
    localizedFor: 'pk'
  },
  
  // === SPORTS TECH ===
  {
    id: 'sports-analytics',
    name: 'Sports Analytics',
    category: 'Business',
    description: 'Template for sports analytics and performance tracking platforms',
    thumbnail: '/templates/sports-analytics.svg',
    isPremium: true,
    tags: ['sports-analytics', 'performance-tracking', 'platform', 'sports'],
    pages: ['home', 'analytics', 'teams', 'about', 'contact'],
    features: ['analytics-dashboard', 'team-showcase', 'performance-metrics', 'contact-form']
  },
  {
    id: 'esports-platform',
    name: 'eSports Platform',
    category: 'Entertainment',
    description: 'Template for eSports platforms and gaming tournaments',
    thumbnail: '/templates/esports-platform.svg',
    isPremium: true,
    tags: ['esports', 'gaming', 'tournaments', 'platform'],
    pages: ['home', 'tournaments', 'teams', 'streaming', 'contact'],
    features: ['tournament-schedule', 'team-profiles', 'streaming-integration', 'contact-form']
  },
  
  // === PROPERTY TECH ===
  {
    id: 'proptech-platform',
    name: 'PropTech Platform',
    category: 'Business',
    description: 'Template for property technology and real estate innovation platforms',
    thumbnail: '/templates/proptech-platform.svg',
    isPremium: true,
    tags: ['proptech', 'real-estate', 'innovation', 'platform'],
    pages: ['home', 'solutions', 'properties', 'about', 'contact'],
    features: ['solution-showcase', 'property-listings', 'tech-features', 'contact-form']
  },
  {
    id: 'smart-home-platform',
    name: 'Smart Home Platform',
    category: 'Business',
    description: 'Template for smart home and home automation platforms',
    thumbnail: '/templates/smart-home-platform.svg',
    isPremium: true,
    tags: ['smart-home', 'home-automation', 'platform', 'iot'],
    pages: ['home', 'devices', 'automation', 'about', 'contact'],
    features: ['device-showcase', 'automation-scenarios', 'tech-specs', 'contact-form']
  },
  
  // === FINANCIAL INCLUSION ===
  {
    id: 'financial-inclusion',
    name: 'Financial Inclusion',
    category: 'Business',
    description: 'Template for financial inclusion and digital banking platforms',
    thumbnail: '/templates/financial-inclusion.svg',
    isPremium: true,
    tags: ['financial-inclusion', 'digital-banking', 'platform', 'fintech'],
    pages: ['home', 'services', 'impact', 'about', 'contact'],
    features: ['service-showcase', 'impact-metrics', 'banking-features', 'contact-form'],
    localizedFor: 'pk'
  },
  {
    id: 'microfinance-platform',
    name: 'Microfinance Platform',
    category: 'Business',
    description: 'Template for microfinance and small business lending platforms',
    thumbnail: '/templates/microfinance-platform.svg',
    isPremium: true,
    tags: ['microfinance', 'small-business', 'lending', 'platform'],
    pages: ['home', 'loans', 'impact', 'about', 'contact'],
    features: ['loan-calculator', 'impact-stories', 'application-process', 'contact-form'],
    localizedFor: 'pk'
  }
]

export const blockTemplates = [
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    category: 'Heroes',
    thumbnail: '/blocks/hero-gradient.jpg',
    elements: [
      {
        type: 'hero',
        props: {
          style: 'gradient',
          title: 'Build Something Amazing',
          subtitle: 'Create stunning websites with our easy-to-use builder',
          primaryButton: { text: 'Get Started', link: '#' },
          secondaryButton: { text: 'Learn More', link: '#' }
        }
      }
    ]
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    category: 'Features',
    thumbnail: '/blocks/features-grid.jpg',
    elements: [
      {
        type: 'features',
        props: {
          layout: 'grid',
          columns: 3,
          features: [
            {
              icon: 'zap',
              title: 'Lightning Fast',
              description: 'Optimized for speed and performance'
            },
            {
              icon: 'shield',
              title: 'Secure',
              description: 'Built with security in mind'
            },
            {
              icon: 'globe',
              title: 'Global',
              description: 'Reach customers worldwide'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    category: 'Testimonials',
    thumbnail: '/blocks/testimonial-carousel.jpg',
    elements: [
      {
        type: 'testimonial',
        props: {
          layout: 'carousel',
          autoRotate: true,
          testimonials: [
            {
              name: 'Ahmed Ali',
              role: 'CEO, Tech Startup',
              content: 'This platform has transformed our online presence.',
              rating: 5
            }
          ]
        }
      }
    ]
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    category: 'Pricing',
    thumbnail: '/blocks/pricing-table.jpg',
    elements: [
      {
        type: 'pricing',
        props: {
          currency: 'PKR',
          plans: [
            {
              name: 'Basic',
              price: 999,
              features: ['1 Website', 'Basic Support'],
              highlighted: false
            },
            {
              name: 'Pro',
              price: 2499,
              features: ['5 Websites', 'Priority Support', 'Custom Domain'],
              highlighted: true
            },
            {
              name: 'Enterprise',
              price: 4999,
              features: ['Unlimited Websites', '24/7 Support', 'White Label'],
              highlighted: false
            }
          ]
        }
      }
    ]
  },
  {
    id: 'contact-split',
    name: 'Split Contact',
    category: 'Contact',
    thumbnail: '/blocks/contact-split.jpg',
    elements: [
      {
        type: 'container',
        props: {
          layout: 'split',
          children: [
            {
              type: 'form',
              props: {
                title: 'Get in Touch',
                fields: [
                  { type: 'text', label: 'Name', required: true },
                  { type: 'email', label: 'Email', required: true },
                  { type: 'textarea', label: 'Message', required: true }
                ]
              }
            },
            {
              type: 'contact',
              props: {
                showMap: true,
                info: {
                  address: 'Karachi, Pakistan',
                  email: 'info@example.com',
                  phone: '+92 123 4567890'
                }
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cta-gradient',
    name: 'Gradient CTA',
    category: 'Call to Action',
    thumbnail: '/blocks/cta-gradient.jpg',
    elements: [
      {
        type: 'cta',
        props: {
          style: 'gradient',
          title: 'Ready to Get Started?',
          description: 'Join thousands of satisfied customers',
          buttonText: 'Start Free Trial',
          buttonLink: '/signup'
        }
      }
    ]
  },
  {
    id: 'team-cards',
    name: 'Team Cards',
    category: 'Team',
    thumbnail: '/blocks/team-cards.jpg',
    elements: [
      {
        type: 'team',
        props: {
          layout: 'cards',
          members: [
            {
              name: 'Sarah Khan',
              role: 'Founder & CEO',
              image: '/team/sarah.jpg',
              bio: 'Visionary leader with 10+ years experience'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'stats-animated',
    name: 'Animated Stats',
    category: 'Statistics',
    thumbnail: '/blocks/stats-animated.jpg',
    elements: [
      {
        type: 'stats',
        props: {
          animate: true,
          stats: [
            { value: 1000, suffix: '+', label: 'Happy Clients' },
            { value: 98, suffix: '%', label: 'Success Rate' },
            { value: 24, suffix: '/7', label: 'Support' }
          ]
        }
      }
    ]
  },
  {
    id: 'footer-mega',
    name: 'Mega Footer',
    category: 'Footers',
    thumbnail: '/blocks/footer-mega.jpg',
    elements: [
      {
        type: 'footer',
        props: {
          style: 'mega',
          columns: [
            {
              title: 'Company',
              links: ['About', 'Team', 'Careers', 'Blog']
            },
            {
              title: 'Products',
              links: ['Features', 'Pricing', 'Security', 'Updates']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Contact', 'Status', 'Terms']
            }
          ],
          social: ['facebook', 'twitter', 'linkedin', 'instagram'],
          copyright: '© 2025 Your Company. All rights reserved.'
        }
      }
    ]
  }
]
