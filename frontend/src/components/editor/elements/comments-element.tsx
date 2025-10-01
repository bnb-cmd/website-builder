import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MessageCircle, ThumbsUp, Reply, Flag } from 'lucide-react'

interface CommentsElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CommentsElement({ element, onUpdate, viewMode, style, children }: CommentsElementProps) {
  const handleCommentChange = (commentId: string, content: string) => {
    const updatedComments = element.props.comments?.map((comment: any) =>
      comment.id === commentId ? { ...comment, content } : comment
    ) || []
    
    onUpdate(element.id, {
      props: {
        ...element.props,
        comments: updatedComments
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'threaded':
        return 'space-y-4'
      case 'flat':
        return 'space-y-3'
      case 'nested':
        return 'space-y-2'
      default:
        return 'space-y-4'
    }
  }

  const comments = element.props.comments || [
    {
      id: '1',
      author: 'John Doe',
      avatar: '/placeholder-avatar.jpg',
      content: 'This is a great article! Thanks for sharing.',
      timestamp: '2 hours ago',
      likes: 5,
      replies: 2
    },
    {
      id: '2',
      author: 'Jane Smith',
      avatar: '/placeholder-avatar.jpg',
      content: 'I found this very helpful. Looking forward to more content like this.',
      timestamp: '1 hour ago',
      likes: 3,
      replies: 0
    }
  ]

  return (
    <div
      className="w-full space-y-6"
      style={style}
    >
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className={getLayoutClass()}>
        {comments.map((comment: any) => (
          <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-foreground">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                </div>
                
                <div
                  className="text-foreground mb-3"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleCommentChange(comment.id, e.target.innerText)}
                >
                  {comment.content}
                </div>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Replies */}
                {comment.replies > 0 && (
                  <div className="mt-3 ml-4 border-l-2 border-border pl-4">
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      View {comment.replies} replies
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
          
          <div className="flex-1">
            <textarea
              placeholder="Write a comment..."
              className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {comments.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4" />
          <p>No comments yet</p>
          <p className="text-xs mt-2">
            Layout: {element.props.layout || 'threaded'}
          </p>
        </div>
      )}
    </div>
  )
}
