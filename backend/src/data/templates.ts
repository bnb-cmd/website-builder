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
          style: 'modern',
          isSticky: true,
          showMobileMenu: true
        },
        style: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        },
        children: []
      },
      {
        id: 'hero-1',
        type: 'herosection',
        props: {
          title: 'Transform Your Business',
          subtitle: 'We help businesses grow with innovative solutions and cutting-edge technology.',
          ctaButtons: [
            { text: 'Get Started', link: '/contact', variant: 'primary' },
            { text: 'Learn More', link: '/about', variant: 'secondary' }
          ],
          backgroundImage: '/templates/hero-business.jpg',
          style: 'centered',
          overlayOpacity: 0.4
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff'
        },
        children: []
      },
      {
        id: 'features-1',
        type: 'featurelist',
        props: {
          title: 'Why Choose Us',
          subtitle: 'We provide comprehensive solutions for your business needs',
          features: [
            {
              icon: 'rocket',
              title: 'Fast Delivery',
              description: 'Get your projects completed quickly and efficiently.'
            },
            {
              icon: 'shield',
              title: 'Secure & Reliable',
              description: 'Your data is safe with our enterprise-grade security.'
            },
            {
              icon: 'support',
              title: '24/7 Support',
              description: 'Round-the-clock support whenever you need help.'
            }
          ],
          columns: 3,
          showIcons: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f9fafb'
        },
        children: []
      },
      {
        id: 'about-1',
        type: 'aboutsection',
        props: {
          title: 'About Our Company',
          content: 'We are a team of passionate professionals dedicated to delivering exceptional results. With years of experience in the industry, we understand what it takes to build successful businesses and create meaningful impact.',
          imageUrl: '/templates/about-business.jpg',
          layout: 'text-image',
          showStats: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'contact-1',
        type: 'contactform',
        props: {
          title: 'Get In Touch',
          subtitle: 'Ready to start your project? Contact us today for a free consultation.',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
            { name: 'phone', type: 'tel', required: false, placeholder: 'Your Phone' },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' }
          ],
          submitText: 'Send Message',
          showMap: true,
          mapLocation: 'Karachi, Pakistan'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f9fafb'
        },
        children: []
      },
      {
        id: 'footer-1',
        type: 'footer',
        props: {
          logo: 'Your Business',
          description: 'Building the future of business with innovative solutions and exceptional service.',
          links: [
            {
              title: 'Company',
              items: [
                { label: 'About Us', link: '/about' },
                { label: 'Our Team', link: '/team' },
                { label: 'Careers', link: '/careers' },
                { label: 'Contact', link: '/contact' }
              ]
            },
            {
              title: 'Services',
              items: [
                { label: 'Web Development', link: '/services/web' },
                { label: 'Mobile Apps', link: '/services/mobile' },
                { label: 'Consulting', link: '/services/consulting' },
                { label: 'Support', link: '/support' }
              ]
            },
            {
              title: 'Resources',
              items: [
                { label: 'Blog', link: '/blog' },
                { label: 'Documentation', link: '/docs' },
                { label: 'Help Center', link: '/help' },
                { label: 'Community', link: '/community' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/yourbusiness' },
            { platform: 'twitter', url: 'https://twitter.com/yourbusiness' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/yourbusiness' },
            { platform: 'instagram', url: 'https://instagram.com/yourbusiness' }
          ],
          copyright: '© 2025 Your Business. All rights reserved.',
          showNewsletter: true
        },
        style: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
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
          showSearch: true,
          style: 'modern',
          isSticky: true
        },
        style: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        },
        children: []
      },
      {
        id: 'hero-2',
        type: 'herosection',
        props: {
          title: 'Shop the Latest Trends',
          subtitle: 'Discover amazing products at unbeatable prices.',
          ctaButtons: [
            { text: 'Shop Now', link: '/shop', variant: 'primary' },
            { text: 'View Sale', link: '/sale', variant: 'secondary' }
          ],
          backgroundImage: '/templates/hero-fashion.jpg',
          style: 'centered',
          overlayOpacity: 0.3
        },
        style: {
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff'
        },
        children: []
      },
      {
        id: 'products-2',
        type: 'productgrid',
        props: {
          title: 'Featured Products',
          subtitle: 'Handpicked items just for you',
          products: [
            {
              name: 'Wireless Headphones',
              price: 'Rs. 2,500',
              originalPrice: 'Rs. 3,000',
              image: '/templates/products/headphones.jpg',
              rating: 4.5,
              reviews: 128,
              badge: 'Sale'
            },
            {
              name: 'Smart Watch',
              price: 'Rs. 8,500',
              originalPrice: 'Rs. 10,000',
              image: '/templates/products/smartwatch.jpg',
              rating: 4.8,
              reviews: 89,
              badge: 'New'
            },
            {
              name: 'Bluetooth Speaker',
              price: 'Rs. 1,800',
              originalPrice: null,
              image: '/templates/products/speaker.jpg',
              rating: 4.3,
              reviews: 156,
              badge: null
            }
          ],
          columns: 3,
          showRating: true,
          showReviews: true,
          showBadges: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'features-2',
        type: 'featurelist',
        props: {
          title: 'Why Shop With Us',
          subtitle: 'We make online shopping easy and secure',
          features: [
            {
              icon: 'truck',
              title: 'Free Shipping',
              description: 'Free delivery on orders over Rs. 2,000'
            },
            {
              icon: 'shield',
              title: 'Secure Payment',
              description: 'Your payment information is always safe'
            },
            {
              icon: 'refresh',
              title: 'Easy Returns',
              description: '30-day return policy for all items'
            },
            {
              icon: 'support',
              title: '24/7 Support',
              description: 'Customer support whenever you need help'
            }
          ],
          columns: 4,
          showIcons: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f9fafb'
        },
        children: []
      },
      {
        id: 'testimonials-2',
        type: 'testimonials',
        props: {
          title: 'What Our Customers Say',
          subtitle: 'Join thousands of satisfied customers',
          testimonials: [
            {
              name: 'Sarah Ahmed',
              role: 'Customer',
              company: 'Karachi',
              content: 'Amazing quality and fast delivery! I love shopping here.',
              avatar: '/templates/avatars/sarah.jpg',
              rating: 5
            },
            {
              name: 'Ali Khan',
              role: 'Customer',
              company: 'Lahore',
              content: 'Great prices and excellent customer service. Highly recommended!',
              avatar: '/templates/avatars/ali.jpg',
              rating: 5
            },
            {
              name: 'Fatima Sheikh',
              role: 'Customer',
              company: 'Islamabad',
              content: 'The best online store in Pakistan. Quality products and reliable delivery.',
              avatar: '/templates/avatars/fatima.jpg',
              rating: 5
            }
          ],
          layout: 'carousel',
          showRating: true,
          autoPlay: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'newsletter-2',
        type: 'cta',
        props: {
          title: 'Stay Updated',
          subtitle: 'Subscribe to our newsletter for exclusive deals and new arrivals',
          ctaButtons: [
            { text: 'Subscribe Now', link: '/newsletter', variant: 'primary' }
          ],
          backgroundImage: '/templates/newsletter-bg.jpg',
          style: 'centered',
          overlayOpacity: 0.6
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'footer-2',
        type: 'footer',
        props: {
          logo: 'Fashion Store',
          description: 'Your one-stop destination for the latest fashion trends and quality products.',
          links: [
            {
              title: 'Shop',
              items: [
                { label: 'New Arrivals', link: '/new' },
                { label: 'Best Sellers', link: '/bestsellers' },
                { label: 'Sale', link: '/sale' },
                { label: 'Categories', link: '/categories' }
              ]
            },
            {
              title: 'Customer Service',
              items: [
                { label: 'Contact Us', link: '/contact' },
                { label: 'Shipping Info', link: '/shipping' },
                { label: 'Returns', link: '/returns' },
                { label: 'Size Guide', link: '/size-guide' }
              ]
            },
            {
              title: 'Company',
              items: [
                { label: 'About Us', link: '/about' },
                { label: 'Careers', link: '/careers' },
                { label: 'Press', link: '/press' },
                { label: 'Blog', link: '/blog' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/fashionstore' },
            { platform: 'instagram', url: 'https://instagram.com/fashionstore' },
            { platform: 'twitter', url: 'https://twitter.com/fashionstore' },
            { platform: 'pinterest', url: 'https://pinterest.com/fashionstore' }
          ],
          copyright: '© 2025 Fashion Store. All rights reserved.',
          showNewsletter: true
        },
        style: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'restaurant-1-global',
    name: 'Restaurant Deluxe',
    category: 'Restaurant',
    description: 'Elegant restaurant website with menu and reservations',
    thumbnail: '/templates/restaurant-1.svg',
    isPremium: false,
    tags: ['food', 'dining', 'hospitality'],
    pages: ['home', 'menu', 'about', 'reservations', 'contact'],
    features: ['menu-display', 'reservation-system', 'gallery'],
    isGlobal: true,
    elements: [
      {
        id: 'restaurant-navbar',
        type: 'navbar',
        props: {
          logo: 'Restaurant Deluxe',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Menu', link: '/menu' },
            { label: 'About', link: '/about' },
            { label: 'Reservations', link: '/reservations' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'elegant'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'restaurant-hero',
        type: 'herosection',
        props: {
          title: 'Fine Dining Experience',
          subtitle: 'Discover exquisite flavors and exceptional service',
          ctaButtons: [
            { text: 'View Menu', link: '/menu', variant: 'primary' },
            { text: 'Make Reservation', link: '/reservations', variant: 'secondary' }
          ],
          backgroundImage: '/images/restaurant-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'restaurant-menu',
        type: 'menu-section',
        props: {
          title: 'Our Menu',
          subtitle: 'Fresh ingredients, authentic flavors',
          categories: [
            {
              name: 'Appetizers',
              items: [
                { name: 'Bruschetta', description: 'Fresh tomatoes, basil, garlic', price: '$12' },
                { name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons', price: '$14' }
              ]
            },
            {
              name: 'Main Courses',
              items: [
                { name: 'Grilled Salmon', description: 'Fresh salmon with herbs', price: '$28' },
                { name: 'Chicken Parmesan', description: 'Breaded chicken with marinara', price: '$24' }
              ]
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'restaurant-footer',
        type: 'footer',
        props: {
          logo: 'Restaurant Deluxe',
          description: 'Fine dining at its best',
          links: [
            { title: 'Menu', items: [
              { label: 'Appetizers', link: '/menu#appetizers' },
              { label: 'Main Courses', link: '/menu#mains' },
              { label: 'Desserts', link: '/menu#desserts' }
            ]},
            { title: 'Contact', items: [
              { label: 'Reservations', link: '/reservations' },
              { label: 'Location', link: '/contact' },
              { label: 'Hours', link: '/contact#hours' }
            ]}
          ],
          contactInfo: {
            address: '123 Restaurant Street, City, Country',
            phone: '+1-555-123-4567',
            email: 'info@restaurantdeluxe.com'
          },
          copyright: '© 2025 Restaurant Deluxe. All rights reserved.'
        },
        style: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant Deluxe (Pakistan)',
    category: 'Restaurant',
    description: 'Elegant restaurant website with menu and reservations - Pakistan version',
    thumbnail: '/templates/restaurant-1.svg',
    isPremium: false,
    tags: ['food', 'dining', 'hospitality'],
    pages: ['home', 'menu', 'about', 'reservations', 'contact'],
    features: ['menu-display', 'reservation-system', 'gallery'],
    parentTemplateId: 'restaurant-1-global',
    localizedFor: 'pk',
    elements: [
      {
        id: 'restaurant-navbar',
        type: 'navbar',
        props: {
          logo: 'Restaurant Deluxe',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Menu', link: '/menu' },
            { label: 'About', link: '/about' },
            { label: 'Reservations', link: '/reservations' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'elegant'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'restaurant-hero',
        type: 'herosection',
        props: {
          title: 'Fine Dining Experience',
          subtitle: 'Discover exquisite flavors and exceptional service',
          ctaButtons: [
            { text: 'View Menu', link: '/menu', variant: 'primary' },
            { text: 'Make Reservation', link: '/reservations', variant: 'secondary' }
          ],
          backgroundImage: '/images/restaurant-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'restaurant-menu',
        type: 'menu-section',
        props: {
          title: 'Our Menu',
          subtitle: 'Fresh ingredients, authentic flavors',
          categories: [
            {
              name: 'Appetizers',
              items: [
                { name: 'Biryani', description: 'Fragrant rice with spices', price: 'Rs. 450' },
                { name: 'Samosa', description: 'Crispy pastry with filling', price: 'Rs. 50' }
              ]
            },
            {
              name: 'Main Courses',
              items: [
                { name: 'Chicken Karahi', description: 'Spicy chicken curry', price: 'Rs. 800' },
                { name: 'Mutton Pulao', description: 'Aromatic rice with mutton', price: 'Rs. 900' }
              ]
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'restaurant-payment',
        type: 'payment-methods',
        props: {
          title: 'Payment Methods',
          methods: [
            { name: 'JazzCash', icon: 'jazzcash', available: true },
            { name: 'EasyPaisa', icon: 'easypaisa', available: true },
            { name: 'Bank Transfer', icon: 'bank', available: true },
            { name: 'Cash on Delivery', icon: 'cash', available: true }
          ]
        },
        style: {
          padding: '2rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'restaurant-footer',
        type: 'footer',
        props: {
          logo: 'Restaurant Deluxe',
          description: 'Fine dining at its best',
          links: [
            { title: 'Menu', items: [
              { label: 'Appetizers', link: '/menu#appetizers' },
              { label: 'Main Courses', link: '/menu#mains' },
              { label: 'Desserts', link: '/menu#desserts' }
            ]},
            { title: 'Contact', items: [
              { label: 'Reservations', link: '/reservations' },
              { label: 'Location', link: '/contact' },
              { label: 'Hours', link: '/contact#hours' }
            ]}
          ],
          contactInfo: {
            address: '123 Restaurant Street, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@restaurantdeluxe.pk',
            whatsapp: '+92-300-1234567'
          },
          copyright: '© 2025 Restaurant Deluxe. All rights reserved.'
        },
        style: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
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
    features: ['image-gallery', 'project-showcase', 'contact-form'],
    elements: [
      {
        id: 'portfolio-navbar',
        type: 'navbar',
        props: {
          logo: 'Your Name',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Portfolio', link: '/portfolio' },
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'minimal'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'portfolio-hero',
        type: 'herosection',
        props: {
          title: 'Creative Designer & Developer',
          subtitle: 'Bringing ideas to life through beautiful design and clean code',
          ctaButtons: [
            { text: 'View My Work', link: '/portfolio', variant: 'primary' },
            { text: 'Get In Touch', link: '/contact', variant: 'secondary' }
          ],
          backgroundImage: '/images/portfolio-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'portfolio-gallery',
        type: 'gallery',
        props: {
          title: 'Featured Work',
          subtitle: 'A selection of my recent projects',
          images: [
            {
              src: '/images/portfolio/project-1.jpg',
              alt: 'E-commerce Website',
              title: 'E-commerce Platform',
              description: 'Modern online store with custom CMS'
            },
            {
              src: '/images/portfolio/project-2.jpg',
              alt: 'Mobile App Design',
              title: 'Mobile Banking App',
              description: 'User-friendly financial management app'
            },
            {
              src: '/images/portfolio/project-3.jpg',
              alt: 'Brand Identity',
              title: 'Brand Identity Design',
              description: 'Complete brand package for startup'
            }
          ],
          layout: 'masonry',
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'portfolio-about',
        type: 'aboutsection',
        props: {
          title: 'About Me',
          subtitle: 'Passionate about creating digital experiences',
          content: 'I\'m a creative designer and developer with 5+ years of experience building beautiful, functional websites and applications. I specialize in user experience design, front-end development, and brand identity.',
          imageUrl: '/images/portfolio/about-me.jpg',
          skills: ['UI/UX Design', 'Frontend Development', 'Brand Identity', 'Web Design'],
          layout: 'split'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'portfolio-contact',
        type: 'contactform',
        props: {
          title: 'Let\'s Work Together',
          subtitle: 'Ready to start your next project?',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
            { name: 'project', type: 'select', required: true, placeholder: 'Project Type', options: ['Web Design', 'Brand Identity', 'Mobile App', 'Other'] },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Tell me about your project' }
          ],
          submitText: 'Send Message'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'portfolio-footer',
        type: 'footer',
        props: {
          logo: 'Your Name',
          description: 'Creative Designer & Developer',
          links: [
            { title: 'Quick Links', items: [
              { label: 'Home', link: '/' },
              { label: 'Portfolio', link: '/portfolio' },
              { label: 'About', link: '/about' },
              { label: 'Contact', link: '/contact' }
            ]},
            { title: 'Services', items: [
              { label: 'Web Design', link: '/services/web-design' },
              { label: 'Brand Identity', link: '/services/branding' },
              { label: 'Mobile Apps', link: '/services/mobile' }
            ]}
          ],
          socialMedia: [
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'dribbble', url: 'https://dribbble.com' }
          ],
          copyright: '© 2025 Your Name. All rights reserved.'
        },
        style: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'education-1-global',
    name: 'Online Academy',
    category: 'Education',
    description: 'Modern education platform for online learning',
    thumbnail: '/templates/education-1.svg',
    isPremium: true,
    tags: ['education', 'courses', 'learning'],
    pages: ['home', 'courses', 'instructors', 'about', 'enroll'],
    features: ['course-catalog', 'instructor-profiles', 'enrollment-system'],
    isGlobal: true,
    elements: [
      {
        id: 'education-navbar',
        type: 'navbar',
        props: {
          logo: 'EduAcademy',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Courses', link: '/courses' },
            { label: 'Instructors', link: '/instructors' },
            { label: 'About', link: '/about' },
            { label: 'Enroll', link: '/enroll' }
          ],
          style: 'modern'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'education-hero',
        type: 'herosection',
        props: {
          title: 'Learn Without Limits',
          subtitle: 'Access world-class education from anywhere. Join thousands of students learning online.',
          ctaButtons: [
            { text: 'Browse Courses', link: '/courses', variant: 'primary' },
            { text: 'Start Free Trial', link: '/enroll', variant: 'secondary' }
          ],
          backgroundImage: '/images/education-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'education-courses',
        type: 'course-grid',
        props: {
          title: 'Popular Courses',
          subtitle: 'Start your learning journey with these trending courses',
          courses: [
            {
              title: 'Web Development Bootcamp',
              instructor: 'Dr. Sarah Johnson',
              duration: '12 weeks',
              price: '$299',
              rating: 4.8,
              students: 1250,
              image: '/images/courses/web-dev.jpg',
              description: 'Complete full-stack web development course'
            },
            {
              title: 'Digital Marketing Mastery',
              instructor: 'Prof. Michael Chen',
              duration: '8 weeks',
              price: '$199',
              rating: 4.7,
              students: 980,
              image: '/images/courses/digital-marketing.jpg',
              description: 'Learn modern digital marketing strategies'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'education-footer',
        type: 'footer',
        props: {
          logo: 'EduAcademy',
          description: 'Empowering learners worldwide through quality education',
          links: [
            { title: 'Quick Links', items: [
              { label: 'Home', link: '/' },
              { label: 'Courses', link: '/courses' },
              { label: 'Instructors', link: '/instructors' },
              { label: 'About', link: '/about' }
            ]},
            { title: 'Support', items: [
              { label: 'Help Center', link: '/help' },
              { label: 'Contact Us', link: '/contact' },
              { label: 'FAQ', link: '/faq' }
            ]}
          ],
          contactInfo: {
            address: '123 Education Avenue, City, Country',
            phone: '+1-555-123-4567',
            email: 'info@eduacademy.com'
          },
          copyright: '© 2025 EduAcademy. All rights reserved.'
        },
        style: {
          backgroundColor: '#34495e',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'education-1',
    name: 'Online Academy (Pakistan)',
    category: 'Education',
    description: 'Modern education platform for online learning - Pakistan version',
    thumbnail: '/templates/education-1.svg',
    isPremium: true,
    tags: ['education', 'courses', 'learning'],
    pages: ['home', 'courses', 'instructors', 'about', 'enroll'],
    features: ['course-catalog', 'instructor-profiles', 'enrollment-system'],
    parentTemplateId: 'education-1-global',
    localizedFor: 'pk',
    elements: [
      {
        id: 'education-navbar',
        type: 'navbar',
        props: {
          logo: 'EduAcademy',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Courses', link: '/courses' },
            { label: 'Instructors', link: '/instructors' },
            { label: 'About', link: '/about' },
            { label: 'Enroll', link: '/enroll' }
          ],
          style: 'modern'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'education-hero',
        type: 'herosection',
        props: {
          title: 'Learn Without Limits',
          subtitle: 'Access world-class education from anywhere. Join thousands of students learning online.',
          ctaButtons: [
            { text: 'Browse Courses', link: '/courses', variant: 'primary' },
            { text: 'Start Free Trial', link: '/enroll', variant: 'secondary' }
          ],
          backgroundImage: '/images/education-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'education-courses',
        type: 'course-grid',
        props: {
          title: 'Popular Courses',
          subtitle: 'Start your learning journey with these trending courses',
          courses: [
            {
              title: 'Web Development Bootcamp',
              instructor: 'Dr. Sarah Ahmed',
              duration: '12 weeks',
              price: 'Rs. 15,000',
              rating: 4.8,
              students: 1250,
              image: '/images/courses/web-dev.jpg',
              description: 'Complete full-stack web development course'
            },
            {
              title: 'Digital Marketing Mastery',
              instructor: 'Prof. Ali Khan',
              duration: '8 weeks',
              price: 'Rs. 12,000',
              rating: 4.7,
              students: 980,
              image: '/images/courses/digital-marketing.jpg',
              description: 'Learn modern digital marketing strategies'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'education-payment',
        type: 'payment-methods',
        props: {
          title: 'Payment Options',
          methods: [
            { name: 'JazzCash', icon: 'jazzcash', available: true },
            { name: 'EasyPaisa', icon: 'easypaisa', available: true },
            { name: 'Bank Transfer', icon: 'bank', available: true },
            { name: 'Credit Card', icon: 'credit-card', available: true }
          ]
        },
        style: {
          padding: '2rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'education-footer',
        type: 'footer',
        props: {
          logo: 'EduAcademy',
          description: 'Empowering learners worldwide through quality education',
          links: [
            { title: 'Quick Links', items: [
              { label: 'Home', link: '/' },
              { label: 'Courses', link: '/courses' },
              { label: 'Instructors', link: '/instructors' },
              { label: 'About', link: '/about' }
            ]},
            { title: 'Support', items: [
              { label: 'Help Center', link: '/help' },
              { label: 'Contact Us', link: '/contact' },
              { label: 'FAQ', link: '/faq' }
            ]}
          ],
          contactInfo: {
            address: '123 Education Avenue, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@eduacademy.pk',
            whatsapp: '+92-300-1234567'
          },
          copyright: '© 2025 EduAcademy. All rights reserved.'
        },
        style: {
          backgroundColor: '#34495e',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
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
    localizedFor: 'pk',
    elements: [
      {
        id: 'medical-navbar',
        type: 'navbar',
        props: {
          logo: 'HealthCare Plus',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Services', link: '/services' },
            { label: 'Doctors', link: '/doctors' },
            { label: 'Appointments', link: '/appointments' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'professional'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'medical-hero',
        type: 'herosection',
        props: {
          title: 'Your Health, Our Priority',
          subtitle: 'Comprehensive healthcare services with experienced medical professionals',
          ctaButtons: [
            { text: 'Book Appointment', link: '/appointments', variant: 'primary' },
            { text: 'Emergency Contact', link: '/contact', variant: 'secondary' }
          ],
          backgroundImage: '/images/medical-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'medical-services',
        type: 'featurelist',
        props: {
          title: 'Our Medical Services',
          subtitle: 'Comprehensive healthcare solutions for all your needs',
          features: [
            {
              icon: 'heart',
              title: 'Cardiology',
              description: 'Expert heart care and cardiovascular treatments'
            },
            {
              icon: 'brain',
              title: 'Neurology',
              description: 'Advanced neurological diagnosis and treatment'
            },
            {
              icon: 'baby',
              title: 'Pediatrics',
              description: 'Specialized care for children and infants'
            },
            {
              icon: 'eye',
              title: 'Ophthalmology',
              description: 'Complete eye care and vision services'
            },
            {
              icon: 'bone',
              title: 'Orthopedics',
              description: 'Bone, joint, and muscle treatment'
            },
            {
              icon: 'stethoscope',
              title: 'General Medicine',
              description: 'Primary healthcare and preventive medicine'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'medical-doctors',
        type: 'team-section',
        props: {
          title: 'Our Medical Team',
          subtitle: 'Experienced healthcare professionals dedicated to your wellbeing',
          members: [
            {
              name: 'Dr. Ahmed Hassan',
              role: 'Chief Cardiologist',
              image: '/images/doctors/ahmed-hassan.jpg',
              bio: '20+ years experience in cardiovascular medicine',
              specialization: 'Cardiology',
              experience: '20 years'
            },
            {
              name: 'Dr. Fatima Ali',
              role: 'Senior Neurologist',
              image: '/images/doctors/fatima-ali.jpg',
              bio: 'Specialist in neurological disorders and treatments',
              specialization: 'Neurology',
              experience: '15 years'
            },
            {
              name: 'Dr. Muhammad Khan',
              role: 'Pediatrician',
              image: '/images/doctors/muhammad-khan.jpg',
              bio: 'Expert in child healthcare and development',
              specialization: 'Pediatrics',
              experience: '12 years'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'medical-appointment',
        type: 'appointment-booking',
        props: {
          title: 'Book Your Appointment',
          subtitle: 'Schedule your visit with our medical professionals',
          departments: [
            { name: 'Cardiology', doctor: 'Dr. Ahmed Hassan' },
            { name: 'Neurology', doctor: 'Dr. Fatima Ali' },
            { name: 'Pediatrics', doctor: 'Dr. Muhammad Khan' },
            { name: 'General Medicine', doctor: 'Dr. Sarah Ahmed' }
          ],
          timeSlots: [
            '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
          ],
          emergencyContact: '+92-300-1234567'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'medical-testimonials',
        type: 'testimonials',
        props: {
          title: 'Patient Testimonials',
          subtitle: 'What our patients say about our care',
          testimonials: [
            {
              name: 'Ayesha Malik',
              role: 'Patient',
              content: 'Excellent care and professional service. The doctors are very knowledgeable and caring.',
              rating: 5,
              image: '/images/patients/ayesha-malik.jpg'
            },
            {
              name: 'Hassan Sheikh',
              role: 'Patient',
              content: 'The medical team provided exceptional treatment during my recovery. Highly recommended.',
              rating: 5,
              image: '/images/patients/hassan-sheikh.jpg'
            },
            {
              name: 'Zara Khan',
              role: 'Patient',
              content: 'Professional, clean, and efficient. The staff made me feel comfortable throughout my visit.',
              rating: 5,
              image: '/images/patients/zara-khan.jpg'
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'medical-footer',
        type: 'footer',
        props: {
          logo: 'HealthCare Plus',
          description: 'Your trusted healthcare partner',
          links: [
            { title: 'Services', items: [
              { label: 'Cardiology', link: '/services/cardiology' },
              { label: 'Neurology', link: '/services/neurology' },
              { label: 'Pediatrics', link: '/services/pediatrics' },
              { label: 'General Medicine', link: '/services/general' }
            ]},
            { title: 'Quick Links', items: [
              { label: 'Book Appointment', link: '/appointments' },
              { label: 'Emergency Contact', link: '/emergency' },
              { label: 'Patient Portal', link: '/portal' }
            ]}
          ],
          contactInfo: {
            address: '123 Medical Street, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@healthcareplus.pk',
            emergency: '+92-300-1234567'
          },
          copyright: '© 2025 HealthCare Plus. All rights reserved.'
        },
        style: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
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
    localizedFor: 'pk',
    elements: [
      {
        id: 'realestate-navbar',
        type: 'navbar',
        props: {
          logo: 'Property Pro',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Properties', link: '/properties' },
            { label: 'Agents', link: '/agents' },
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'modern'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'realestate-hero',
        type: 'herosection',
        props: {
          title: 'Find Your Dream Home',
          subtitle: 'Discover the perfect property with our expert real estate services',
          ctaButtons: [
            { text: 'Browse Properties', link: '/properties', variant: 'primary' },
            { text: 'Get Valuation', link: '/valuation', variant: 'secondary' }
          ],
          backgroundImage: '/images/realestate-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'realestate-search',
        type: 'property-search',
        props: {
          title: 'Search Properties',
          subtitle: 'Find your perfect home with our advanced search',
          filters: {
            propertyType: ['House', 'Apartment', 'Commercial', 'Land'],
            priceRange: { min: 5000000, max: 50000000 },
            bedrooms: [1, 2, 3, 4, 5],
            bathrooms: [1, 2, 3, 4],
            location: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi']
          },
          featuredProperties: true
        },
        style: {
          padding: '3rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'realestate-featured',
        type: 'property-grid',
        props: {
          title: 'Featured Properties',
          subtitle: 'Handpicked properties just for you',
          properties: [
            {
              title: 'Modern Villa in DHA',
              price: 'Rs. 25,000,000',
              location: 'DHA Phase 5, Karachi',
              bedrooms: 4,
              bathrooms: 3,
              area: '2500 sq ft',
              image: '/images/properties/villa-dha.jpg',
              features: ['Garden', 'Parking', 'Security'],
              agent: 'Ahmed Hassan'
            },
            {
              title: 'Luxury Apartment',
              price: 'Rs. 15,000,000',
              location: 'Gulberg, Lahore',
              bedrooms: 3,
              bathrooms: 2,
              area: '1800 sq ft',
              image: '/images/properties/apartment-gulberg.jpg',
              features: ['Gym', 'Swimming Pool', '24/7 Security'],
              agent: 'Fatima Ali'
            },
            {
              title: 'Commercial Office Space',
              price: 'Rs. 8,000,000',
              location: 'Blue Area, Islamabad',
              bedrooms: 0,
              bathrooms: 2,
              area: '1200 sq ft',
              image: '/images/properties/office-blue-area.jpg',
              features: ['Parking', 'Elevator', 'Central AC'],
              agent: 'Muhammad Khan'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'realestate-agents',
        type: 'team-section',
        props: {
          title: 'Our Expert Agents',
          subtitle: 'Professional real estate agents ready to help you',
          members: [
            {
              name: 'Ahmed Hassan',
              role: 'Senior Real Estate Agent',
              image: '/images/agents/ahmed-hassan.jpg',
              bio: '10+ years experience in Karachi real estate market',
              propertiesSold: 150,
              rating: 4.9
            },
            {
              name: 'Fatima Ali',
              role: 'Luxury Property Specialist',
              image: '/images/agents/fatima-ali.jpg',
              bio: 'Specialist in high-end residential properties',
              propertiesSold: 120,
              rating: 4.8
            },
            {
              name: 'Muhammad Khan',
              role: 'Commercial Real Estate Expert',
              image: '/images/agents/muhammad-khan.jpg',
              bio: 'Expert in commercial and investment properties',
              propertiesSold: 200,
              rating: 4.9
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'realestate-services',
        type: 'featurelist',
        props: {
          title: 'Our Services',
          subtitle: 'Complete real estate solutions for all your needs',
          features: [
            {
              icon: 'home',
              title: 'Property Sales',
              description: 'Buy and sell residential and commercial properties'
            },
            {
              icon: 'key',
              title: 'Property Rentals',
              description: 'Find the perfect rental property or list yours'
            },
            {
              icon: 'calculator',
              title: 'Property Valuation',
              description: 'Get accurate property valuations from experts'
            },
            {
              icon: 'document',
              title: 'Legal Services',
              description: 'Complete legal support for property transactions'
            },
            {
              icon: 'camera',
              title: 'Virtual Tours',
              description: 'Explore properties with our virtual tour service'
            },
            {
              icon: 'shield',
              title: 'Property Management',
              description: 'Professional property management services'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'realestate-footer',
        type: 'footer',
        props: {
          logo: 'Property Pro',
          description: 'Your trusted real estate partner',
          links: [
            { title: 'Properties', items: [
              { label: 'Residential', link: '/properties/residential' },
              { label: 'Commercial', link: '/properties/commercial' },
              { label: 'Land', link: '/properties/land' }
            ]},
            { title: 'Services', items: [
              { label: 'Property Sales', link: '/services/sales' },
              { label: 'Rentals', link: '/services/rentals' },
              { label: 'Valuation', link: '/services/valuation' }
            ]}
          ],
          contactInfo: {
            address: '123 Real Estate Avenue, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@propertypro.pk',
            whatsapp: '+92-300-1234567'
          },
          copyright: '© 2025 Property Pro. All rights reserved.'
        },
        style: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'wedding-1',
    name: 'Wedding Bells',
    category: 'Events',
    description: 'Beautiful wedding and event planning website',
    thumbnail: '/templates/wedding-1.svg',
    isPremium: false,
    tags: ['wedding', 'events', 'planning'],
    pages: ['home', 'gallery', 'services', 'testimonials', 'contact'],
    features: ['photo-gallery', 'rsvp-system', 'countdown-timer'],
    localizedFor: 'pk',
    elements: [
      {
        id: 'wedding-navbar',
        type: 'navbar',
        props: {
          logo: 'Wedding Bells',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Gallery', link: '/gallery' },
            { label: 'Services', link: '/services' },
            { label: 'Testimonials', link: '/testimonials' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'elegant'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'wedding-hero',
        type: 'herosection',
        props: {
          title: 'Your Dream Wedding Awaits',
          subtitle: 'Creating magical moments that last a lifetime',
          ctaButtons: [
            { text: 'View Gallery', link: '/gallery', variant: 'primary' },
            { text: 'Book Consultation', link: '/contact', variant: 'secondary' }
          ],
          backgroundImage: '/images/wedding-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          color: '#8b4513',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'wedding-gallery',
        type: 'gallery',
        props: {
          title: 'Our Beautiful Weddings',
          subtitle: 'A glimpse into the magical moments we create',
          images: [
            {
              src: '/images/weddings/wedding-1.jpg',
              alt: 'Garden Wedding',
              title: 'Garden Wedding',
              description: 'Romantic outdoor ceremony'
            },
            {
              src: '/images/weddings/wedding-2.jpg',
              alt: 'Ballroom Wedding',
              title: 'Ballroom Wedding',
              description: 'Elegant indoor celebration'
            },
            {
              src: '/images/weddings/wedding-3.jpg',
              alt: 'Beach Wedding',
              title: 'Beach Wedding',
              description: 'Sunset beach ceremony'
            }
          ],
          layout: 'masonry',
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'wedding-services',
        type: 'featurelist',
        props: {
          title: 'Our Services',
          subtitle: 'Complete wedding planning solutions',
          features: [
            {
              icon: 'calendar',
              title: 'Event Planning',
              description: 'Complete wedding planning and coordination'
            },
            {
              icon: 'camera',
              title: 'Photography',
              description: 'Professional wedding photography and videography'
            },
            {
              icon: 'flower',
              title: 'Floral Design',
              description: 'Beautiful floral arrangements and decorations'
            },
            {
              icon: 'utensils',
              title: 'Catering',
              description: 'Delicious cuisine for your special day'
            },
            {
              icon: 'music',
              title: 'Entertainment',
              description: 'Live music and DJ services'
            },
            {
              icon: 'car',
              title: 'Transportation',
              description: 'Luxury transportation for the wedding party'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'wedding-testimonials',
        type: 'testimonials',
        props: {
          title: 'Happy Couples',
          subtitle: 'What our clients say about their special day',
          testimonials: [
            {
              name: 'Ayesha & Hassan',
              role: 'Married Couple',
              content: 'Wedding Bells made our dream wedding come true. Everything was perfect!',
              rating: 5,
              image: '/images/couples/ayesha-hassan.jpg'
            },
            {
              name: 'Fatima & Ali',
              role: 'Married Couple',
              content: 'Professional, creative, and absolutely amazing. Highly recommended!',
              rating: 5,
              image: '/images/couples/fatima-ali.jpg'
            },
            {
              name: 'Zara & Muhammad',
              role: 'Married Couple',
              content: 'They handled everything beautifully. Our guests are still talking about it!',
              rating: 5,
              image: '/images/couples/zara-muhammad.jpg'
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'wedding-footer',
        type: 'footer',
        props: {
          logo: 'Wedding Bells',
          description: 'Making your dreams come true',
          links: [
            { title: 'Services', items: [
              { label: 'Event Planning', link: '/services/planning' },
              { label: 'Photography', link: '/services/photography' },
              { label: 'Catering', link: '/services/catering' }
            ]},
            { title: 'Quick Links', items: [
              { label: 'Gallery', link: '/gallery' },
              { label: 'Testimonials', link: '/testimonials' },
              { label: 'Contact', link: '/contact' }
            ]}
          ],
          contactInfo: {
            address: '123 Wedding Street, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@weddingbells.pk',
            whatsapp: '+92-300-1234567'
          },
          copyright: '© 2025 Wedding Bells. All rights reserved.'
        },
        style: {
          backgroundColor: '#8b4513',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'blog-1',
    name: 'Modern Blog',
    category: 'Blog',
    description: 'Clean and modern blog template',
    thumbnail: '/templates/blog-1.svg',
    isPremium: false,
    tags: ['blog', 'content', 'modern'],
    pages: ['home', 'posts', 'categories', 'about', 'contact'],
    features: ['blog-posts', 'categories', 'comments', 'search'],
    elements: [
      {
        id: 'blog-navbar',
        type: 'navbar',
        props: {
          logo: 'Modern Blog',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'Posts', link: '/posts' },
            { label: 'Categories', link: '/categories' },
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'minimal'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'blog-hero',
        type: 'herosection',
        props: {
          title: 'Welcome to Modern Blog',
          subtitle: 'Discover amazing stories, insights, and inspiration',
          ctaButtons: [
            { text: 'Read Latest Posts', link: '/posts', variant: 'primary' },
            { text: 'Subscribe', link: '/subscribe', variant: 'secondary' }
          ],
          backgroundImage: '/images/blog-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'blog-featured',
        type: 'blog-featured',
        props: {
          title: 'Featured Post',
          post: {
            title: 'The Future of Web Development',
            excerpt: 'Exploring the latest trends and technologies shaping the future of web development...',
            author: 'Sarah Ahmed',
            date: '2025-01-15',
            category: 'Technology',
            image: '/images/posts/web-dev-future.jpg',
            readTime: '5 min read'
          }
        },
        style: {
          padding: '3rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'blog-posts',
        type: 'blog-grid',
        props: {
          title: 'Latest Posts',
          subtitle: 'Stay updated with our latest articles',
          posts: [
            {
              title: 'Getting Started with React',
              excerpt: 'Learn the basics of React development...',
              author: 'Ali Khan',
              date: '2025-01-14',
              category: 'Programming',
              image: '/images/posts/react-basics.jpg',
              readTime: '8 min read'
            },
            {
              title: 'Design Trends 2025',
              excerpt: 'Discover the design trends that will dominate 2025...',
              author: 'Fatima Hassan',
              date: '2025-01-13',
              category: 'Design',
              image: '/images/posts/design-trends.jpg',
              readTime: '6 min read'
            },
            {
              title: 'SEO Best Practices',
              excerpt: 'Essential SEO strategies for better search rankings...',
              author: 'Muhammad Ali',
              date: '2025-01-12',
              category: 'Marketing',
              image: '/images/posts/seo-guide.jpg',
              readTime: '10 min read'
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'blog-categories',
        type: 'category-grid',
        props: {
          title: 'Browse by Category',
          subtitle: 'Find posts that interest you most',
          categories: [
            {
              name: 'Technology',
              count: 25,
              image: '/images/categories/technology.jpg',
              description: 'Latest tech news and tutorials'
            },
            {
              name: 'Design',
              count: 18,
              image: '/images/categories/design.jpg',
              description: 'UI/UX design insights and trends'
            },
            {
              name: 'Programming',
              count: 32,
              image: '/images/categories/programming.jpg',
              description: 'Coding tutorials and best practices'
            },
            {
              name: 'Marketing',
              count: 15,
              image: '/images/categories/marketing.jpg',
              description: 'Digital marketing strategies'
            }
          ],
          columns: 4
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'blog-newsletter',
        type: 'newsletter-signup',
        props: {
          title: 'Stay Updated',
          subtitle: 'Subscribe to our newsletter for the latest posts',
          placeholder: 'Enter your email address',
          buttonText: 'Subscribe',
          description: 'Get weekly updates on technology, design, and programming'
        },
        style: {
          padding: '3rem 0',
          backgroundColor: '#2c3e50',
          color: '#ffffff'
        },
        children: []
      },
      {
        id: 'blog-footer',
        type: 'footer',
        props: {
          logo: 'Modern Blog',
          description: 'Sharing knowledge and inspiring creativity',
          links: [
            { title: 'Categories', items: [
              { label: 'Technology', link: '/category/technology' },
              { label: 'Design', link: '/category/design' },
              { label: 'Programming', link: '/category/programming' }
            ]},
            { title: 'Quick Links', items: [
              { label: 'About', link: '/about' },
              { label: 'Contact', link: '/contact' },
              { label: 'Privacy Policy', link: '/privacy' }
            ]}
          ],
          socialMedia: [
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' }
          ],
          copyright: '© 2025 Modern Blog. All rights reserved.'
        },
        style: {
          backgroundColor: '#34495e',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'nonprofit-1',
    name: 'Charity Hope',
    category: 'Non-Profit',
    description: 'Non-profit organization and charity website',
    thumbnail: '/templates/nonprofit-1.svg',
    isPremium: false,
    tags: ['nonprofit', 'charity', 'cause'],
    pages: ['home', 'about', 'causes', 'donate', 'contact'],
    features: ['donation-system', 'cause-showcase', 'volunteer-signup'],
    localizedFor: 'pk',
    elements: [
      {
        id: 'nonprofit-navbar',
        type: 'navbar',
        props: {
          logo: 'Charity Hope',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
            { label: 'Causes', link: '/causes' },
            { label: 'Donate', link: '/donate' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'clean'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        children: []
      },
      {
        id: 'nonprofit-hero',
        type: 'herosection',
        props: {
          title: 'Making a Difference Together',
          subtitle: 'Join us in creating positive change in our community',
          ctaButtons: [
            { text: 'Donate Now', link: '/donate', variant: 'primary' },
            { text: 'Learn More', link: '/about', variant: 'secondary' }
          ],
          backgroundImage: '/images/nonprofit-hero-bg.jpg',
          style: 'centered'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      },
      {
        id: 'nonprofit-causes',
        type: 'cause-grid',
        props: {
          title: 'Our Causes',
          subtitle: 'Supporting communities and making a lasting impact',
          causes: [
            {
              title: 'Education for All',
              description: 'Providing quality education to underprivileged children',
              image: '/images/causes/education.jpg',
              raised: 'Rs. 2,500,000',
              target: 'Rs. 5,000,000',
              donors: 1250
            },
            {
              title: 'Clean Water Initiative',
              description: 'Bringing clean drinking water to rural communities',
              image: '/images/causes/water.jpg',
              raised: 'Rs. 1,800,000',
              target: 'Rs. 3,000,000',
              donors: 890
            },
            {
              title: 'Healthcare Access',
              description: 'Improving healthcare access in remote areas',
              image: '/images/causes/healthcare.jpg',
              raised: 'Rs. 3,200,000',
              target: 'Rs. 6,000,000',
              donors: 2100
            }
          ],
          columns: 3
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      },
      {
        id: 'nonprofit-stats',
        type: 'stats-counter',
        props: {
          stats: [
            { number: '50,000+', label: 'Lives Impacted' },
            { number: '500+', label: 'Projects Completed' },
            { number: '10,000+', label: 'Volunteers' },
            { number: 'Rs. 25M+', label: 'Funds Raised' }
          ]
        },
        style: {
          padding: '3rem 0',
          backgroundColor: '#2c3e50',
          color: '#ffffff'
        },
        children: []
      },
      {
        id: 'nonprofit-testimonials',
        type: 'testimonials',
        props: {
          title: 'Stories of Hope',
          subtitle: 'Hear from those whose lives we\'ve touched',
          testimonials: [
            {
              name: 'Amina Khan',
              role: 'Beneficiary',
              content: 'Thanks to Charity Hope, my children now have access to quality education. We are forever grateful.',
              rating: 5,
              image: '/images/testimonials/amina-khan.jpg'
            },
            {
              name: 'Hassan Ali',
              role: 'Volunteer',
              content: 'Volunteering with this organization has been one of the most rewarding experiences of my life.',
              rating: 5,
              image: '/images/testimonials/hassan-ali.jpg'
            },
            {
              name: 'Fatima Sheikh',
              role: 'Donor',
              content: 'I\'m proud to support such a transparent and effective organization making real change.',
              rating: 5,
              image: '/images/testimonials/fatima-sheikh.jpg'
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      },
      {
        id: 'nonprofit-footer',
        type: 'footer',
        props: {
          logo: 'Charity Hope',
          description: 'Creating positive change in our community',
          links: [
            { title: 'Causes', items: [
              { label: 'Education', link: '/causes/education' },
              { label: 'Healthcare', link: '/causes/healthcare' },
              { label: 'Water', link: '/causes/water' }
            ]},
            { title: 'Get Involved', items: [
              { label: 'Donate', link: '/donate' },
              { label: 'About', link: '/about' },
              { label: 'Contact', link: '/contact' }
            ]}
          ],
          contactInfo: {
            address: '123 Charity Street, Karachi, Pakistan',
            phone: '+92-21-1234567',
            email: 'info@charityhope.pk',
            whatsapp: '+92-300-1234567'
          },
          copyright: '© 2025 Charity Hope. All rights reserved.'
        },
        style: {
          backgroundColor: '#34495e',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
  },
  {
    id: 'contact-multistep',
    name: 'Multi-step Contact',
    category: 'Contact',
    thumbnail: '/blocks/contact-multistep.svg',
    tags: ['contact', 'form', 'multistep'],
    elements: [
      {
        id: 'contact-multistep-block',
        type: 'contactform',
        props: {
          title: 'Get In Touch',
          subtitle: 'Tell us about your project in a few simple steps',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name', step: 1 },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email', step: 1 },
            { name: 'project-type', type: 'select', required: true, placeholder: 'Project Type', step: 2 },
            { name: 'budget', type: 'select', required: true, placeholder: 'Budget Range', step: 2 },
            { name: 'timeline', type: 'select', required: true, placeholder: 'Timeline', step: 3 },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Project Details', step: 3 }
          ],
          submitText: 'Send Message',
          showSteps: true,
          showProgress: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      }
    ]
  },
  {
    id: 'contact-with-map',
    name: 'Contact with Map',
    category: 'Contact',
    thumbnail: '/blocks/contact-with-map.svg',
    tags: ['contact', 'form', 'map'],
    elements: [
      {
        id: 'contact-map-block',
        type: 'contactform',
        props: {
          title: 'Visit Our Office',
          subtitle: 'Come see us or send us a message',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
            { name: 'phone', type: 'tel', required: false, placeholder: 'Your Phone' },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' }
          ],
          submitText: 'Send Message',
          showMap: true,
          mapLocation: 'Karachi, Pakistan',
          mapZoom: 15,
          showContactInfo: true,
          contactInfo: [
            { type: 'address', label: 'Address', value: '123 Business District, Karachi, Pakistan' },
            { type: 'phone', label: 'Phone', value: '+92 21 1234567' },
            { type: 'email', label: 'Email', value: 'info@company.com' },
            { type: 'hours', label: 'Hours', value: 'Mon-Fri: 9AM-6PM' }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  }
]
