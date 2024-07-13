import { Customer } from "@prisma/client";
import { prisma } from "../utils/db.server";

export const getCustomers = async () => {
  return await prisma.customer.findMany();
};

export const createCustomer = async (
  customer: Pick<Customer, "name" | "email">,
) => {
  return await prisma.customer.create({ data: customer });
};
