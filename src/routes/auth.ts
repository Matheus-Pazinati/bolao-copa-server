import axios from "axios";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      accessToken: z.string()
    })

    const { accessToken } = createUserBody.parse(request.body)

    const userDataFromGoogle = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    })

    const userInfo = userInfoSchema.parse(userDataFromGoogle.data)

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
          googleId: userInfo.id
        }
      })
    }

    return { userInfo }
  })
}