'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ahmed Khan',
    business: 'Khan Restaurant',
    location: 'Karachi',
    image: '/testimonials/ahmed-khan.jpg',
    rating: 5,
    text: 'Pakistan Builder helped me create a beautiful website for my restaurant. The AI content generation in Urdu was amazing, and the JazzCash integration made payments so easy for my customers.'
  },
  {
    name: 'Fatima Ali',
    business: 'Ali Fashion Store',
    location: 'Lahore',
    image: '/testimonials/fatima-ali.jpg',
    rating: 5,
    text: 'I was able to set up my online store in just a few hours. The templates are beautiful and the e-commerce features work perfectly. My sales have increased by 300% since going online.'
  },
  {
    name: 'Muhammad Hassan',
    business: 'Hassan Tech Solutions',
    location: 'Islamabad',
    image: '/testimonials/muhammad-hassan.jpg',
    rating: 5,
    text: 'As a tech consultant, I needed a professional website quickly. Pakistan Builder delivered exactly what I needed with their modern templates and AI-powered content suggestions.'
  },
  {
    name: 'Ayesha Malik',
    business: 'Malik Medical Center',
    location: 'Rawalpindi',
    image: '/testimonials/ayesha-malik.jpg',
    rating: 5,
    text: 'The healthcare template was perfect for my clinic. Patients can now book appointments online, and the Urdu language support makes it accessible to everyone in our community.'
  },
  {
    name: 'Omar Sheikh',
    business: 'Sheikh Electronics',
    location: 'Faisalabad',
    image: '/testimonials/omar-sheikh.jpg',
    rating: 5,
    text: 'The e-commerce features are incredible. I can manage my inventory, process orders, and accept payments through JazzCash and EasyPaisa. Everything works seamlessly.'
  },
  {
    name: 'Sara Ahmed',
    business: 'Ahmed Academy',
    location: 'Multan',
    image: '/testimonials/sara-ahmed.jpg',
    rating: 5,
    text: 'Creating a website for my educational institute was so easy. The AI helped me write compelling content, and the student portal integration is fantastic.'
  }
]

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by Pakistani Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Pakistani entrepreneurs who have built successful online businesses 
            with Pakistan Website Builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative mb-4">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground italic relative z-10">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.business}, {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
