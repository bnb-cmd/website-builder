import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FileText, Calendar, User, Tag } from 'lucide-react'

interface BlogElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function BlogElement({ element, onUpdate, viewMode, style, children }: BlogElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'list':
        return 'space-y-6'
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const posts = element.props.posts || [
    {
      id: 1,
      title: 'Getting Started with Web Development',
      excerpt: 'Learn the basics of web development and start building amazing websites.',
      author: 'John Doe',
      date: '2024-01-15',
      image: '/placeholder-blog.jpg',
      tags: ['Web Development', 'Tutorial']
    },
    {
      id: 2,
      title: 'Best Practices for React Components',
      excerpt: 'Discover the best practices for creating reusable and maintainable React components.',
      author: 'Jane Smith',
      date: '2024-01-10',
      image: '/placeholder-blog.jpg',
      tags: ['React', 'JavaScript']
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox: When to Use What',
      excerpt: 'A comprehensive guide to choosing between CSS Grid and Flexbox for your layouts.',
      author: 'Mike Johnson',
      date: '2024-01-05',
      image: '/placeholder-blog.jpg',
      tags: ['CSS', 'Layout']
    }
  ]

  return (
    <div
      className="w-full"
      style={style}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="text-4xl font-bold mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Our Blog'}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest insights, tutorials, and industry news.
        </p>
      </div>

      {/* Blog Posts */}
      <div className={getLayoutClass()}>
        {posts.map((post: any) => (
          <article
            key={post.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Featured Image */}
            <div className="aspect-video bg-muted">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Read More */}
              <a
                href="#"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      {element.props.showLoadMore && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Load More Posts
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p>Configure blog posts in properties panel</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'grid'}
          </p>
        </div>
      )}
    </div>
  )
}
