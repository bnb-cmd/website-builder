import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      email: string
      name: string
      role: 'ADMIN' | 'USER'
    }
  }
}

