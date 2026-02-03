import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // En Prisma 7, pasamos opciones como logs para que no esté vacío.
  // La conexión a la BD se tomará automáticamente del .env
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma