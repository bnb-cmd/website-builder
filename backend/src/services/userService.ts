import bcrypt from 'bcryptjs'
import { User, UserRole, UserStatus, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { authConfig } from '@/config/environment'

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  businessType?: string
  city?: string
  companyName?: string
  role?: UserRole
}

export interface UpdateUserData {
  name?: string
  phone?: string
  avatar?: string
  businessType?: string
  city?: string
  companyName?: string
  status?: UserStatus
}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  businessType?: string
  city?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserWithRelations extends User {
  subscription?: any
  websites?: any[]
  teams?: any[]
}

export class UserService extends BaseService<User> {
  protected getModelName(): string {
    return 'user'
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      this.validateRequired(data, ['email', 'name', 'password'])
      
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      })
      
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, authConfig.bcryptRounds)
      
      // Create user
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role || UserRole.USER,
          status: UserStatus.ACTIVE
        }
      })
      
      // Invalidate cache
      await this.invalidateCache('users:*')
      
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      this.validateId(id)
      
      const cacheKey = `user:${id}`
      const cached = await this.getCached<User>(cacheKey)
      if (cached) return cached
      
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          subscription: true,
          websites: {
            select: {
              id: true,
              name: true,
              status: true,
              createdAt: true
            }
          },
          teams: {
            select: {
              id: true,
              role: true,
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })
      
      if (user) {
        await this.setCached(cacheKey, user, 1800) // 30 minutes
      }
      
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email provided')
      }
      
      const cacheKey = `user:email:${email}`
      const cached = await this.getCached<User>(cacheKey)
      if (cached) return cached
      
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (user) {
        await this.setCached(cacheKey, user, 1800) // 30 minutes
      }
      
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(filters: UserFilters = {}): Promise<User[]> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        ...whereFilters
      } = filters
      
      const { skip, take } = this.getPaginationParams(page, limit)
      
      // Build where clause
      const where: Prisma.UserWhereInput = {
        ...whereFilters
      }
      
      // Add search functionality
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      const users = await this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: this.buildSortQuery(sortBy, sortOrder),
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          businessType: true,
          city: true,
          companyName: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      })
      
      return users
    } catch (error) {
      this.handleError(error)
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      this.validateId(id)
      
      // Check if user exists
      const existingUser = await this.findById(id)
      if (!existingUser) {
        throw new Error('User not found')
      }
      
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
      await this.invalidateCache(`user:email:${existingUser.email}`)
      await this.invalidateCache('users:*')
      
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      // Check if user exists
      const existingUser = await this.findById(id)
      if (!existingUser) {
        throw new Error('User not found')
      }
      
      // Soft delete by updating status
      await this.prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.INACTIVE,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
      await this.invalidateCache(`user:email:${existingUser.email}`)
      await this.invalidateCache('users:*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    try {
      this.validateId(id)
      
      await this.prisma.user.delete({
        where: { id }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
      await this.invalidateCache('users:*')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Authentication methods
  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      console.error('Password validation error:', error)
      return false
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    try {
      this.validateId(id)
      
      const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptRounds)
      
      await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      this.validateId(id)
      
      await this.prisma.user.update({
        where: { id },
        data: {
          lastLoginAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Subscription methods
  async updateSubscription(id: string, subscriptionId: string): Promise<User> {
    try {
      this.validateId(id)
      
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          subscriptionId,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache(`user:${id}`)
      
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  // Statistics methods
  async getStats(): Promise<{
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    usersByRole: Record<string, number>
    usersByBusinessType: Record<string, number>
  }> {
    try {
      const cacheKey = 'user:stats'
      const cached = await this.getCached(cacheKey)
      if (cached) return cached
      
      const [
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        usersByRole,
        usersByBusinessType
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        this.prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        this.prisma.user.groupBy({
          by: ['businessType'],
          _count: { businessType: true },
          where: { businessType: { not: null } }
        })
      ])
      
      const stats = {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role
          return acc
        }, {} as Record<string, number>),
        usersByBusinessType: usersByBusinessType.reduce((acc, item) => {
          acc[item.businessType || 'Unknown'] = item._count.businessType
          return acc
        }, {} as Record<string, number>)
      }
      
      await this.setCached(cacheKey, stats, 3600) // 1 hour
      
      return stats
    } catch (error) {
      this.handleError(error)
    }
  }

  // Bulk operations
  async bulkCreate(users: CreateUserData[]): Promise<User[]> {
    try {
      const hashedUsers = await Promise.all(
        users.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, authConfig.bcryptRounds),
          role: user.role || UserRole.USER,
          status: UserStatus.ACTIVE
        }))
      )
      
      const result = await this.prisma.user.createMany({
        data: hashedUsers,
        skipDuplicates: true
      })
      
      // Invalidate cache
      await this.invalidateCache('users:*')
      
      return await this.prisma.user.findMany({
        where: {
          email: { in: users.map(u => u.email) }
        }
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async bulkUpdate(updates: Array<{ id: string; data: UpdateUserData }>): Promise<User[]> {
    try {
      const results: User[] = []
      
      for (const update of updates) {
        const user = await this.update(update.id, update.data)
        results.push(user)
      }
      
      return results
    } catch (error) {
      this.handleError(error)
    }
  }

  async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.user.updateMany({
        where: { id: { in: ids } },
        data: {
          status: UserStatus.INACTIVE,
          updatedAt: new Date()
        }
      })
      
      // Invalidate cache
      await this.invalidateCache('users:*')
      
      return result.count
    } catch (error) {
      this.handleError(error)
    }
  }
}
