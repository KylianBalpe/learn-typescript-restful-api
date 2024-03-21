import {PrismaClient} from '@prisma/client';
import {logger} from "./logging";

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    },
    {
      emit: 'event',
      level: 'error'
    }
  ]
});

prisma.$on("error", e => {
  logger.error(e)
})

prisma.$on("warn", e => {
  logger.warn(e)
})

prisma.$on("info", e => {
  logger.info(e)
})

prisma.$on("query", e => {
  logger.info(e)
})
