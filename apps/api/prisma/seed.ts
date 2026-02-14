import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  adapter,
})

async function seed() {
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('12345', 1)
  const user = await prisma.user.create({
    data: {
      name: 'Jhon Doe',
      email: 'jhondoe@acme.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })
  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
          ],
        },
      },
      members: {
        create: [
          {
            userId: user.id,
            role: 'MEMBER',
          },
          {
            userId: anotherUser.id,
            role: 'ADMIN',
          },
          {
            userId: anotherUser2.id,
            role: 'MEMBER',
          },
        ],
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
            {
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
              name: faker.commerce.productName(),
              slug: faker.helpers
                .slugify(faker.commerce.productName())
                .toLocaleLowerCase(),
              description: faker.commerce.productDescription(),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser2.id,
              role: 'ADMIN',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Seeding completed successfully.')
})
