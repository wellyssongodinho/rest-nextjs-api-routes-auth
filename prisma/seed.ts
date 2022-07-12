import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  //Create a new profile for an existing user
  const profile = await prisma.profile.create({
    data: {
      bio: "Hello World",
      user: {
        connect: { email: "alice@prisma.io" },
      },
    },
  });
  console.log(`Created profile with id: ${profile.id}`)

  //Create a new user with a new profile
  const user = await prisma.user.create({
    data: {
      email: "john@prisma.io",
      name: "John",
      profile: {
        create: {
          bio: "Hello World",
        },
      },
    },
  });
  console.log(`Created user with profile: ${user.id}`)
  
  //Update the profile of an existing user
  const userWithUpdatedProfile = await prisma.user.update({
    where: { email: "alice@prisma.io" },
    data: {
      profile: {
        update: {
          bio: "Hello Friends",
        },
      },
    },
  });  
  console.log(`Update user with id: ${userWithUpdatedProfile.id}`)

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
