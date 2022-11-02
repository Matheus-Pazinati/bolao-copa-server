import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const user = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatarUrl: 'https://github.com/Matheus-Pazinati.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Bolão do Ma',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-05T12:00:00.551Z',
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR"
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-04T12:00:00.551Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
      
      guesses: {
        create: {
          firstTeamPoints: 7,
          secondTeamPoints: 1,
          
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()