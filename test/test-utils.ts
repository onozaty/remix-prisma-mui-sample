import { prisma } from "#app/utils/db.server";
import {
  defineCustomerFactory,
  initialize,
} from "#test/__generated__/fabbrica";

export const resetDb = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`,
    );
  } catch (error) {
    console.log({ error });
  }
};

initialize({ prisma: prisma });
export const customerFactory = defineCustomerFactory();
