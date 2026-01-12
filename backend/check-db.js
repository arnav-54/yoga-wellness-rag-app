require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
console.log('CHECK-DB URL:', process.env.DATABASE_URL);
const prisma = new PrismaClient();

async function main() {
    try {
        const interactions = await prisma.interaction.findMany();
        console.log('Total interactions:', interactions.length);
        console.log(JSON.stringify(interactions, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
