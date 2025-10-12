import { Context } from 'hono'

export const errorHandler = (error: Error, c: Context) => {
  console.error('Error:', error)

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return c.json({ error: 'Validation failed', details: error.message }, 400)
  }

  if (error.name === 'UnauthorizedError') {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (error.name === 'ForbiddenError') {
    return c.json({ error: 'Forbidden' }, 403)
  }

  if (error.name === 'NotFoundError') {
    return c.json({ error: 'Not found' }, 404)
  }

  // Generic error response
  return c.json({ 
    error: 'Internal server error',
    message: c.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  }, 500)
}
