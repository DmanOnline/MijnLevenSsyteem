import "dotenv/config";

const { PrismaClient } = require("../src/generated/prisma/client.js");

const prisma = new PrismaClient();

const modules = [
  {
    name: "tasks",
    title: "Tasks",
    description: "Manage your to-do's, projects, and deadlines.",
    icon: "check-circle",
    color: "blue",
    href: "/tasks",
    isActive: false,
    sortOrder: 1,
  },
  {
    name: "habits",
    title: "Habits",
    description: "Build better habits with daily tracking and streaks.",
    icon: "chart-bar",
    color: "emerald",
    href: "/habits",
    isActive: false,
    sortOrder: 2,
  },
  {
    name: "journal",
    title: "Journal",
    description: "Write daily reflections and capture thoughts.",
    icon: "book-open",
    color: "purple",
    href: "/journal",
    isActive: false,
    sortOrder: 3,
  },
  {
    name: "finance",
    title: "Finance",
    description: "Track income, expenses, and budgets.",
    icon: "banknotes",
    color: "amber",
    href: "/finance",
    isActive: false,
    sortOrder: 4,
  },
  {
    name: "goals",
    title: "Goals",
    description: "Set goals, break them into milestones, and track progress.",
    icon: "rocket",
    color: "rose",
    href: "/goals",
    isActive: false,
    sortOrder: 5,
  },
  {
    name: "notes",
    title: "Notes",
    description: "Capture ideas and organize your knowledge base.",
    icon: "pencil-square",
    color: "indigo",
    href: "/notes",
    isActive: false,
    sortOrder: 6,
  },
];

async function main() {
  console.log("Seeding modules...");

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { name: mod.name },
      update: mod,
      create: mod,
    });
  }

  console.log("Seeded 6 modules.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
