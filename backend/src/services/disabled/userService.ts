import bcrypt from 'bcryptjs'
import { User, UserRole, UserStatus, BusinessType, Prisma } from '@prisma/client'
import { BaseService } from './baseService'
import { authConfig } from '@/config/environment'

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  businessType?: BusinessType
  city?: string
  companyName?: string
  role?: UserRole
}

export interface UpdateUserData {
  name?: string
  phone?: string
  avatar?: string
  businessType?: BusinessType
  city?: string
  companyName?: string
  status?: UserStatus
}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  businessType?: BusinessType
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

  override async create(data: CreateUserData): Promise<User> {
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
          email: data.email,
          name: data.name,
          password: hashedPassword,
          phone: data.phone || null,
          businessType: data.businessType || null,
          city: data.city || null,
          companyName: data.companyName || null,
          role: data.role || UserRole.USER,
          status: UserStatus.ACTIVE
        }
      })
      
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error // This should throw since it's a create operation
    }
  }

  override async findById(id: string): Promise<User | null> {
    try {
      // Temporarily disable validation
      // this.validateId(id)
      
      const user = await this.prisma.user.findUnique({
        where: { id }
      })
      
      return user
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email provided')
      }
      
      // Temporarily disable all caching
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  override async findAll(filters: UserFilters = {}): Promise<User[]> {
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
        orderBy: { [sortBy]: sortOrder },
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

  override async update(id: string, data: UpdateUserData): Promise<User> {
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
          name: data.name,
          phone: data.phone || null,
          avatar: data.avatar || null,
          businessType: data.businessType || null,
          city: data.city || null,
          companyName: data.companyName || null,
          status: data.status,
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

  override async delete(id: string): Promise<boolean> {
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
      console.error('Error updating password:', error)
      throw error // This one should throw since it's not a find operation
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      // Temporarily disable validation
      // this.validateId(id)
      
      await this.prisma.user.update({
        where: { id },
        data: {
          lastLoginAt: new Date()
        }
      })
      
    } catch (error) {
      console.error('Error updating last login:', error)
      // Don't throw error for last login update
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
  override async bulkCreate(users: CreateUserData[]): Promise<User[]> {
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
        data: hashedUsers.map(user => ({
          email: user.email,
          name: user.name,
          password: user.password,
          phone: user.phone || null,
          businessType: user.businessType || null,
          city: user.city || null,
          companyName: user.companyName || null,
          role: user.role || UserRole.USER,
          status: UserStatus.ACTIVE
        })),
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

  override async bulkUpdate(updates: Array<{ id: string; data: UpdateUserData }>): Promise<User[]> {
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

  override async bulkDelete(ids: string[]): Promise<number> {
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
