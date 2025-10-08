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
        type: 'hero',
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
        type: 'feature-grid',
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
        type: 'about-section',
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
        type: 'contact-form',
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
        type: 'hero',
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
        type: 'product-grid',
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
        type: 'feature-grid',
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
        type: 'cta-section',
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
        type: 'hero',
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
        type: 'hero',
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
        type: 'hero',
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
        type: 'about-section',
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
        type: 'contact-form',
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
        type: 'hero',
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
        type: 'hero',
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
        type: 'hero',
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
        type: 'feature-grid',
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
        type: 'hero',
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
        type: 'feature-grid',
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
    tags: ['wedding', 'events', 'celebration'],
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
        type: 'hero',
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
        type: 'feature-grid',
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
    tags: ['blog', 'content', 'writing'],
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
        type: 'hero',
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
    tags: ['charity', 'nonprofit', 'donation'],
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
        type: 'hero',
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
    features: ['glass-effects', 'modern-layout', 'smooth-animations', 'contact-form'],
    elements: [
      {
        id: 'navbar-glassmorphism',
        type: 'navbar',
        props: {
          logo: 'Glassmorphism Modern',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
            { label: 'Services', link: '/services' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'glassmorphism',
          isSticky: true,
          showMobileMenu: true
        },
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '1rem 0'
        },
        children: []
      },
      {
        id: 'hero-glassmorphism',
        type: 'hero',
        props: {
          title: 'Modern Glass Design',
          subtitle: 'Experience the future of web design with glassmorphism effects.',
          ctaButtons: [
            { text: 'Explore Features', link: '/features', variant: 'primary' },
            { text: 'View Demo', link: '/demo', variant: 'secondary' }
          ],
          backgroundImage: '/templates/hero-glassmorphism.jpg',
          style: 'glassmorphism',
          overlayOpacity: 0.3
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          position: 'relative'
        },
        children: []
      },
      {
        id: 'features-glassmorphism',
        type: 'feature-grid',
        props: {
          title: 'Glass Effects',
          subtitle: 'Modern design elements with glassmorphism effects',
          features: [
            {
              icon: 'glass',
              title: 'Glass Morphism',
              description: 'Beautiful glass-like effects with transparency and blur.'
            },
            {
              icon: 'modern',
              title: 'Modern Design',
              description: 'Clean, contemporary design that stands out.'
            },
            {
              icon: 'responsive',
              title: 'Fully Responsive',
              description: 'Perfect on all devices and screen sizes.'
            }
          ],
          columns: 3,
          showIcons: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)'
        },
        children: []
      },
      {
        id: 'about-glassmorphism',
        type: 'about-section',
        props: {
          title: 'About Glassmorphism',
          content: 'Glassmorphism is a design trend that uses frosted glass effects to create depth and visual interest. Our templates incorporate this modern aesthetic with subtle transparency, blur effects, and layered elements that create a sophisticated, contemporary look.',
          imageUrl: '/templates/about-glassmorphism.jpg',
          layout: 'text-image',
          showStats: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)'
        },
        children: []
      },
      {
        id: 'contact-glassmorphism',
        type: 'contact-form',
        props: {
          title: 'Get In Touch',
          subtitle: 'Ready to experience glassmorphism design? Contact us today.',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
            { name: 'phone', type: 'tel', required: false, placeholder: 'Your Phone' },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' }
          ],
          submitText: 'Send Message',
          showMap: true,
          mapLocation: 'Modern City, World'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)'
        },
        children: []
      },
      {
        id: 'footer-glassmorphism',
        type: 'footer',
        props: {
          logo: 'Glassmorphism Modern',
          description: 'Leading the way in modern glassmorphism design trends.',
          links: [
            {
              title: 'Design',
              items: [
                { label: 'Glass Effects', link: '/glass-effects' },
                { label: 'Modern UI', link: '/modern-ui' },
                { label: 'Templates', link: '/templates' },
                { label: 'Showcase', link: '/showcase' }
              ]
            },
            {
              title: 'Services',
              items: [
                { label: 'Web Design', link: '/web-design' },
                { label: 'UI/UX', link: '/ui-ux' },
                { label: 'Development', link: '/development' },
                { label: 'Consulting', link: '/consulting' }
              ]
            },
            {
              title: 'Company',
              items: [
                { label: 'About Us', link: '/about' },
                { label: 'Our Team', link: '/team' },
                { label: 'Careers', link: '/careers' },
                { label: 'Contact', link: '/contact' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/glassmorphism' },
            { platform: 'twitter', url: 'https://twitter.com/glassmorphism' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/glassmorphism' },
            { platform: 'instagram', url: 'https://instagram.com/glassmorphism' }
          ],
          copyright: '© 2025 Glassmorphism Modern. All rights reserved.',
          showNewsletter: true
        },
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
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
    features: ['ai-demo', 'feature-showcase', 'pricing-tables', 'contact-form'],
    elements: [
      {
        id: 'navbar-ai',
        type: 'navbar',
        props: {
          logo: 'AI Assistant Platform',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'AI Solutions', link: '/solutions' },
            { label: 'Features', link: '/features' },
            { label: 'Demo', link: '/demo' },
            { label: 'Pricing', link: '/pricing' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'modern',
          isSticky: true,
          showMobileMenu: true
        },
        style: {
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #333333',
          padding: '1rem 0'
        },
        children: []
      },
      {
        id: 'hero-ai',
        type: 'hero',
        props: {
          title: 'AI-Powered Solutions',
          subtitle: 'Harness the power of artificial intelligence for your business.',
          ctaButtons: [
            { text: 'Try AI Demo', link: '/demo', variant: 'primary' },
            { text: 'See Features', link: '/features', variant: 'secondary' }
          ],
          backgroundImage: '/templates/hero-ai.jpg',
          style: 'modern',
          overlayOpacity: 0.6
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          backgroundColor: '#0a0a0a'
        },
        children: []
      },
      {
        id: 'features-ai',
        type: 'feature-grid',
        props: {
          title: 'AI Capabilities',
          subtitle: 'Powerful artificial intelligence features',
          features: [
            {
              icon: 'brain',
              title: 'Machine Learning',
              description: 'Advanced ML algorithms for intelligent automation.'
            },
            {
              icon: 'chat',
              title: 'AI Chatbot',
              description: 'Intelligent conversational AI assistant.'
            },
            {
              icon: 'analytics',
              title: 'Predictive Analytics',
              description: 'Data-driven insights and predictions.'
            }
          ],
          columns: 3,
          showIcons: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#1a1a1a'
        },
        children: []
      },
      {
        id: 'about-ai',
        type: 'about-section',
        props: {
          title: 'AI Technology',
          content: 'Our advanced AI technology uses machine learning algorithms to provide intelligent solutions. From natural language processing to computer vision, we leverage cutting-edge AI to solve complex business problems.',
          imageUrl: '/templates/about-ai.jpg',
          layout: 'text-image',
          showStats: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#0a0a0a'
        },
        children: []
      },
      {
        id: 'stats-ai',
        type: 'stats-counter',
        props: {
          stats: [
            { number: '99.9%', label: 'Uptime', suffix: '', icon: 'uptime' },
            { number: '1M+', label: 'Processed', suffix: 'Requests', icon: 'requests' },
            { number: '50+', label: 'Integrations', suffix: '', icon: 'integrations' },
            { number: '24/7', label: 'Support', suffix: '', icon: 'support' }
          ],
          animation: true,
          duration: 2000
        },
        style: {
          padding: '3rem 0',
          backgroundColor: '#1a1a1a',
          color: '#ffffff'
        },
        children: []
      },
      {
        id: 'contact-ai',
        type: 'contact-form',
        props: {
          title: 'Get Started with AI',
          subtitle: 'Ready to automate your business? Contact us for a consultation.',
          fields: [
            { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
            { name: 'company', type: 'text', required: true, placeholder: 'Company Name' },
            { name: 'use-case', type: 'select', required: true, placeholder: 'Use Case' },
            { name: 'budget', type: 'select', required: false, placeholder: 'Budget Range' },
            { name: 'message', type: 'textarea', required: true, placeholder: 'Tell us about your automation needs' }
          ],
          submitText: 'Request Consultation',
          showMap: true,
          mapLocation: 'AI Tech Hub, Silicon Valley'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#0a0a0a'
        },
        children: []
      },
      {
        id: 'footer-ai',
        type: 'footer',
        props: {
          logo: 'AI Assistant Platform',
          description: 'Leading AI solutions for modern businesses.',
          links: [
            {
              title: 'AI Solutions',
              items: [
                { label: 'Machine Learning', link: '/ml' },
                { label: 'Natural Language', link: '/nlp' },
                { label: 'Computer Vision', link: '/cv' },
                { label: 'Predictive Analytics', link: '/analytics' }
              ]
            },
            {
              title: 'Resources',
              items: [
                { label: 'Documentation', link: '/docs' },
                { label: 'API Reference', link: '/api' },
                { label: 'Tutorials', link: '/tutorials' },
                { label: 'Support', link: '/support' }
              ]
            },
            {
              title: 'Company',
              items: [
                { label: 'About Us', link: '/about' },
                { label: 'Careers', link: '/careers' },
                { label: 'Blog', link: '/blog' },
                { label: 'Contact', link: '/contact' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/aiplatform' },
            { platform: 'twitter', url: 'https://twitter.com/aiplatform' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/aiplatform' },
            { platform: 'github', url: 'https://github.com/aiplatform' }
          ],
          copyright: '© 2025 AI Assistant Platform. All rights reserved.',
          showNewsletter: true
        },
        style: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '3rem 0 1rem'
        },
        children: []
      }
    ]
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
    thumbnail: '/blocks/hero-gradient.svg',
    elements: [
      {
        id: 'hero-gradient-block',
        type: 'hero',
        props: {
          title: 'Build Something Amazing',
          subtitle: 'Create stunning websites with our easy-to-use builder',
          ctaButtons: [
            { text: 'Get Started', link: '#', variant: 'primary' },
            { text: 'Learn More', link: '#', variant: 'secondary' }
          ],
          style: 'gradient',
          gradientColors: ['#667eea', '#764ba2'],
          overlayOpacity: 0.3
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative'
        },
        children: []
      }
    ]
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    category: 'Features',
    thumbnail: '/blocks/features-grid.svg',
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
    thumbnail: '/blocks/testimonial-carousel.svg',
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
    thumbnail: '/blocks/pricing-table.svg',
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
    thumbnail: '/blocks/contact-split.svg',
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
    thumbnail: '/blocks/cta-gradient.svg',
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
    thumbnail: '/blocks/team-cards.svg',
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
    thumbnail: '/blocks/stats-animated.svg',
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
    thumbnail: '/blocks/footer-mega.svg',
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
  },
  
  // === NEW BLOCK TEMPLATES ===
  
  // Hero Variants
  {
    id: 'hero-video-background',
    name: 'Video Background Hero',
    category: 'Heroes',
    thumbnail: '/blocks/hero-video-background.svg',
    elements: [
      {
        id: 'hero-video-block',
        type: 'hero',
        props: {
          title: 'Immersive Experience',
          subtitle: 'Engage your audience with stunning video backgrounds',
          ctaButtons: [
            { text: 'Watch Demo', link: '#', variant: 'primary' },
            { text: 'Learn More', link: '#', variant: 'secondary' }
          ],
          style: 'video-background',
          videoUrl: '/videos/hero-background.mp4',
          overlayOpacity: 0.4
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        },
        children: []
      }
    ]
  },
  {
    id: 'hero-split-screen',
    name: 'Split Screen Hero',
    category: 'Heroes',
    thumbnail: '/blocks/hero-split-screen.svg',
    elements: [
      {
        id: 'hero-split-block',
        type: 'hero',
        props: {
          title: 'Split Screen Design',
          subtitle: 'Modern layout with content and visual elements side by side',
          ctaButtons: [
            { text: 'Get Started', link: '#', variant: 'primary' }
          ],
          style: 'split-screen',
          imageUrl: '/images/hero-split.jpg',
          layout: 'image-text'
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  },
  
  // Feature Grid Variants
  {
    id: 'features-asymmetric',
    name: 'Asymmetric Features',
    category: 'Features',
    thumbnail: '/blocks/features-asymmetric.svg',
    elements: [
      {
        id: 'features-asymmetric-block',
        type: 'feature-grid',
        props: {
          title: 'Asymmetric Layout',
          subtitle: 'Creative feature showcase with asymmetric design',
          features: [
            {
              icon: 'design',
              title: 'Creative Design',
              description: 'Unique asymmetric layouts that stand out'
            },
            {
              icon: 'responsive',
              title: 'Fully Responsive',
              description: 'Perfect on all devices and screen sizes'
            },
            {
              icon: 'customizable',
              title: 'Highly Customizable',
              description: 'Easy to modify and adapt to your needs'
            }
          ],
          columns: 3,
          layout: 'asymmetric',
          showIcons: true
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
    id: 'features-timeline',
    name: 'Features Timeline',
    category: 'Features',
    thumbnail: '/blocks/features-timeline.svg',
    elements: [
      {
        id: 'features-timeline-block',
        type: 'timeline',
        props: {
          title: 'Our Journey',
          subtitle: 'Key milestones in our company development',
          items: [
            {
              year: '2020',
              title: 'Company Founded',
              description: 'Started with a vision to revolutionize web design'
            },
            {
              year: '2021',
              title: 'First Product Launch',
              description: 'Released our flagship website builder'
            },
            {
              year: '2022',
              title: 'Global Expansion',
              description: 'Expanded to serve customers worldwide'
            },
            {
              year: '2023',
              title: 'AI Integration',
              description: 'Added AI-powered design assistance'
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  },
  
  // Testimonial Variants
  {
    id: 'testimonial-cards',
    name: 'Testimonial Cards',
    category: 'Testimonials',
    thumbnail: '/blocks/testimonial-cards.svg',
    elements: [
      {
        id: 'testimonial-cards-block',
        type: 'testimonials',
        props: {
          title: 'What Our Clients Say',
          subtitle: 'Real feedback from satisfied customers',
          testimonials: [
            {
              name: 'Ahmed Hassan',
              role: 'CEO, TechCorp',
              company: 'Karachi',
              content: 'Exceptional service and amazing results. Highly recommended!',
              avatar: '/avatars/ahmed.jpg',
              rating: 5
            },
            {
              name: 'Fatima Ali',
              role: 'Marketing Director',
              company: 'Lahore',
              content: 'The best investment we made for our online presence.',
              avatar: '/avatars/fatima.jpg',
              rating: 5
            },
            {
              name: 'Omar Khan',
              role: 'Founder',
              company: 'Islamabad',
              content: 'Professional, reliable, and delivers beyond expectations.',
              avatar: '/avatars/omar.jpg',
              rating: 5
            }
          ],
          layout: 'cards',
          showRating: true,
          showAvatars: true
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
    id: 'testimonial-masonry',
    name: 'Testimonial Masonry',
    category: 'Testimonials',
    thumbnail: '/blocks/testimonial-masonry.svg',
    elements: [
      {
        id: 'testimonial-masonry-block',
        type: 'testimonials',
        props: {
          title: 'Customer Stories',
          subtitle: 'Real experiences from our community',
          testimonials: [
            {
              name: 'Sarah Ahmed',
              content: 'Amazing platform that helped us grow our business exponentially.',
              rating: 5
            },
            {
              name: 'Hassan Sheikh',
              content: 'The support team is incredible. They helped us every step of the way.',
              rating: 5
            },
            {
              name: 'Ayesha Malik',
              content: 'Clean, modern design that perfectly represents our brand.',
              rating: 5
            }
          ],
          layout: 'masonry',
          showRating: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  },
  
  // Pricing Variants
  {
    id: 'pricing-toggle',
    name: 'Pricing with Toggle',
    category: 'Pricing',
    thumbnail: '/blocks/pricing-toggle.svg',
    elements: [
      {
        id: 'pricing-toggle-block',
        type: 'pricing-table',
        props: {
          title: 'Choose Your Plan',
          subtitle: 'Flexible pricing options for every business size',
          currency: 'PKR',
          showToggle: true,
          toggleOptions: ['Monthly', 'Yearly'],
          plans: [
            {
              name: 'Starter',
              monthlyPrice: 999,
              yearlyPrice: 9999,
              features: ['1 Website', 'Basic Support', '5GB Storage'],
              highlighted: false
            },
            {
              name: 'Professional',
              monthlyPrice: 2499,
              yearlyPrice: 24999,
              features: ['5 Websites', 'Priority Support', '50GB Storage', 'Custom Domain'],
              highlighted: true
            },
            {
              name: 'Enterprise',
              monthlyPrice: 4999,
              yearlyPrice: 49999,
              features: ['Unlimited Websites', '24/7 Support', 'Unlimited Storage', 'White Label'],
              highlighted: false
            }
          ]
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#ffffff'
        },
        children: []
      }
    ]
  },
  
  // CTA Variants
  {
    id: 'cta-split',
    name: 'Split CTA',
    category: 'Call to Action',
    thumbnail: '/blocks/cta-split.svg',
    elements: [
      {
        id: 'cta-split-block',
        type: 'cta-section',
        props: {
          title: 'Ready to Get Started?',
          subtitle: 'Join thousands of satisfied customers',
          ctaButtons: [
            { text: 'Start Free Trial', link: '#', variant: 'primary' },
            { text: 'View Demo', link: '#', variant: 'secondary' }
          ],
          style: 'split',
          imageUrl: '/images/cta-split.jpg',
          layout: 'text-image'
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#3b82f6',
          color: '#ffffff'
        },
        children: []
      }
    ]
  },
  {
    id: 'cta-fullwidth',
    name: 'Full Width CTA',
    category: 'Call to Action',
    thumbnail: '/blocks/cta-fullwidth.svg',
    elements: [
      {
        id: 'cta-fullwidth-block',
        type: 'cta-section',
        props: {
          title: 'Transform Your Business Today',
          subtitle: 'Don\'t wait - start your journey to success now',
          ctaButtons: [
            { text: 'Get Started Now', link: '#', variant: 'primary' }
          ],
          style: 'fullwidth',
          backgroundImage: '/images/cta-fullwidth.jpg',
          overlayOpacity: 0.7
        },
        style: {
          padding: '6rem 0',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          textAlign: 'center'
        },
        children: []
      }
    ]
  },
  
  // Team Variants
  {
    id: 'team-circles',
    name: 'Team Circles',
    category: 'Team',
    thumbnail: '/blocks/team-circles.svg',
    elements: [
      {
        id: 'team-circles-block',
        type: 'team-section',
        props: {
          title: 'Meet Our Team',
          subtitle: 'The talented people behind our success',
          members: [
            {
              name: 'Ahmed Khan',
              role: 'CEO & Founder',
              bio: 'Visionary leader with 15+ years experience',
              avatar: '/team/ahmed.jpg',
              socialLinks: [
                { platform: 'linkedin', url: 'https://linkedin.com/in/ahmed' },
                { platform: 'twitter', url: 'https://twitter.com/ahmed' }
              ]
            },
            {
              name: 'Fatima Ali',
              role: 'CTO',
              bio: 'Technical expert and innovation driver',
              avatar: '/team/fatima.jpg',
              socialLinks: [
                { platform: 'linkedin', url: 'https://linkedin.com/in/fatima' },
                { platform: 'github', url: 'https://github.com/fatima' }
              ]
            },
            {
              name: 'Omar Hassan',
              role: 'Design Director',
              bio: 'Creative genius behind our beautiful designs',
              avatar: '/team/omar.jpg',
              socialLinks: [
                { platform: 'dribbble', url: 'https://dribbble.com/omar' },
                { platform: 'behance', url: 'https://behance.com/omar' }
              ]
            }
          ],
          layout: 'circles',
          showSocialLinks: true
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
    id: 'team-minimal',
    name: 'Team Minimal',
    category: 'Team',
    thumbnail: '/blocks/team-minimal.svg',
    elements: [
      {
        id: 'team-minimal-block',
        type: 'team-section',
        props: {
          title: 'Our People',
          subtitle: 'Simple, clean team showcase',
          members: [
            {
              name: 'Sarah Ahmed',
              role: 'Product Manager',
              bio: 'Passionate about creating great user experiences'
            },
            {
              name: 'Hassan Sheikh',
              role: 'Lead Developer',
              bio: 'Building the future with clean, efficient code'
            },
            {
              name: 'Ayesha Malik',
              role: 'UX Designer',
              bio: 'Making complex things simple and beautiful'
            }
          ],
          layout: 'minimal',
          showSocialLinks: false
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  },
  
  // Stats Variants
  {
    id: 'stats-with-charts',
    name: 'Stats with Charts',
    category: 'Statistics',
    thumbnail: '/blocks/stats-with-charts.svg',
    elements: [
      {
        id: 'stats-charts-block',
        type: 'stats-counter',
        props: {
          title: 'Our Impact',
          subtitle: 'Numbers that speak for themselves',
          stats: [
            { number: '500+', label: 'Projects', suffix: 'Completed', icon: 'projects', chartType: 'bar' },
            { number: '1000+', label: 'Happy', suffix: 'Clients', icon: 'clients', chartType: 'line' },
            { number: '99%', label: 'Success', suffix: 'Rate', icon: 'success', chartType: 'pie' },
            { number: '24/7', label: 'Support', suffix: '', icon: 'support', chartType: 'donut' }
          ],
          animation: true,
          showCharts: true,
          duration: 2000
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#3b82f6',
          color: '#ffffff'
        },
        children: []
      }
    ]
  },
  
  // Gallery Variants
  {
    id: 'gallery-masonry',
    name: 'Gallery Masonry',
    category: 'Gallery',
    thumbnail: '/blocks/gallery-masonry.svg',
    elements: [
      {
        id: 'gallery-masonry-block',
        type: 'gallery',
        props: {
          title: 'Our Work',
          subtitle: 'A showcase of our best projects',
          images: [
            {
              src: '/gallery/project1.jpg',
              alt: 'Project 1',
              caption: 'E-commerce Website Design'
            },
            {
              src: '/gallery/project2.jpg',
              alt: 'Project 2',
              caption: 'Mobile App Interface'
            },
            {
              src: '/gallery/project3.jpg',
              alt: 'Project 3',
              caption: 'Brand Identity Design'
            },
            {
              src: '/gallery/project4.jpg',
              alt: 'Project 4',
              caption: 'Corporate Website'
            }
          ],
          layout: 'masonry',
          showLightbox: true,
          columns: 3
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
    id: 'gallery-slider',
    name: 'Gallery Slider',
    category: 'Gallery',
    thumbnail: '/blocks/gallery-slider.svg',
    elements: [
      {
        id: 'gallery-slider-block',
        type: 'gallery',
        props: {
          title: 'Portfolio Showcase',
          subtitle: 'Swipe through our latest work',
          images: [
            {
              src: '/gallery/slide1.jpg',
              alt: 'Slide 1',
              caption: 'Modern Web Design'
            },
            {
              src: '/gallery/slide2.jpg',
              alt: 'Slide 2',
              caption: 'Mobile App Design'
            },
            {
              src: '/gallery/slide3.jpg',
              alt: 'Slide 3',
              caption: 'Brand Design'
            }
          ],
          layout: 'slider',
          showLightbox: true,
          autoPlay: true,
          showArrows: true,
          showDots: true
        },
        style: {
          padding: '4rem 0',
          backgroundColor: '#f8f9fa'
        },
        children: []
      }
    ]
  },
  
  // Contact Variants
  {
    id: 'contact-multistep',
    name: 'Multi-step Contact',
    category: 'Contact',
    thumbnail: '/blocks/contact-multistep.svg',
    elements: [
      {
        id: 'contact-multistep-block',
        type: 'contact-form',
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
    elements: [
      {
        id: 'contact-map-block',
        type: 'contact-form',
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
