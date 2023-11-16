import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.org.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const firstUser = await prisma.user.create({
    data: {
      email: 'lisa@simpson.com',
      firstname: 'Lisa',
      lastname: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'User',
    },
  });

  const firstUserPost = await prisma.post.create({
    data: {
      name: 'Join us for Prisma Day 2019 in Berlin',
      description: 'https://www.prisma.io/day/',
      status: 'Active',
      userId: firstUser.id
    },
  });

  const firstUserOrg = await prisma.org.create({
    data: {
      name: 'LS Technology Store',
      description: 'https://www.prisma.io/day/',
      type: 'Store',
      status: 'Active',
      userId: firstUser.id
    },
  });

  const firstUserProduct = await prisma.product.create({
    data: {
      name: 'Xiaomi Poco X3 NFC',
      description: 'https://www.prisma.io/day/',
      type: 'ShoppingGoods',
      status: 'Active',
      userId: firstUser.id
    },
  });

  const secondUser = await prisma.user.create({
    data: {
      email: 'bart@simpson.com',
      firstname: 'Bart',
      lastname: 'Simpson',
      role: 'Admin',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
    },
  });

  const secondUserPost = await prisma.post.createMany({
    data: [
      {
        name: 'Subscribe to GraphQL Weekly for community news',
        description: 'https://graphqlweekly.com/',
        status: 'Active',
        userId: secondUser.id
      },
      {
        name: 'Follow Prisma on Twitter',
        description: 'https://twitter.com/prisma',
        status: 'Active',
        userId: secondUser.id
      },
    ],
    skipDuplicates: true,
  });

  console.log({ firstUser, secondUser });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  })
