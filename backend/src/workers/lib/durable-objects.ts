import { DurableObject } from 'cloudflare:workers'

export interface CollaborationState {
  users: Map<string, { id: string; name: string; cursor: { x: number; y: number } }>
  components: any[]
  lastModified: number
}

export class CollaborationRoom extends DurableObject {
  private state: CollaborationState = {
    users: new Map(),
    components: [],
    lastModified: Date.now()
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    switch (path) {
      case '/join':
        return this.handleJoin(request)
      case '/leave':
        return this.handleLeave(request)
      case '/cursor':
        return this.handleCursorUpdate(request)
      case '/components':
        if (request.method === 'GET') {
          return this.handleGetComponents(request)
        } else if (request.method === 'POST') {
          return this.handleUpdateComponents(request)
        }
        break
      case '/sync':
        return this.handleSync(request)
    }

    return new Response('Not Found', { status: 404 })
  }

  private async handleJoin(request: Request): Promise<Response> {
    const { userId, userName } = await request.json()
    
    this.state.users.set(userId, {
      id: userId,
      name: userName,
      cursor: { x: 0, y: 0 }
    })

    // Broadcast user joined
    await this.broadcast({
      type: 'user_joined',
      user: { id: userId, name: userName }
    })

    return new Response(JSON.stringify({ success: true }))
  }

  private async handleLeave(request: Request): Promise<Response> {
    const { userId } = await request.json()
    
    this.state.users.delete(userId)

    // Broadcast user left
    await this.broadcast({
      type: 'user_left',
      userId
    })

    return new Response(JSON.stringify({ success: true }))
  }

  private async handleCursorUpdate(request: Request): Promise<Response> {
    const { userId, cursor } = await request.json()
    
    const user = this.state.users.get(userId)
    if (user) {
      user.cursor = cursor
      
      // Broadcast cursor update
      await this.broadcast({
        type: 'cursor_update',
        userId,
        cursor
      })
    }

    return new Response(JSON.stringify({ success: true }))
  }

  private async handleGetComponents(request: Request): Promise<Response> {
    return new Response(JSON.stringify({
      components: this.state.components,
      lastModified: this.state.lastModified
    }))
  }

  private async handleUpdateComponents(request: Request): Promise<Response> {
    const { components, userId } = await request.json()
    
    this.state.components = components
    this.state.lastModified = Date.now()

    // Broadcast component update
    await this.broadcast({
      type: 'components_updated',
      components,
      userId,
      timestamp: this.state.lastModified
    })

    return new Response(JSON.stringify({ success: true }))
  }

  private async handleSync(request: Request): Promise<Response> {
    const { lastModified } = await request.json()
    
    if (lastModified < this.state.lastModified) {
      return new Response(JSON.stringify({
        needsUpdate: true,
        components: this.state.components,
        lastModified: this.state.lastModified
      }))
    }

    return new Response(JSON.stringify({ needsUpdate: false }))
  }

  private async broadcast(message: any): Promise<void> {
    const messageStr = JSON.stringify(message)
    
    for (const [userId, user] of this.state.users) {
      try {
        // In a real implementation, you'd use WebSocket connections
        // For now, we'll store the message for polling
        await this.env.CACHE.put(`collab:${userId}:${Date.now()}`, messageStr, {
          expirationTtl: 30 // 30 seconds
        })
      } catch (error) {
        console.error('Failed to broadcast to user:', userId, error)
      }
    }
  }
}
