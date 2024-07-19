import { Customer } from "@prisma/client";
import { prisma } from "../utils/db.server";

export const getCustomers = async () => {
  return await prisma.customer.findMany();
};

export const getCustomer = async (customerId: number) => {
  return await prisma.customer.findUnique({
    where: { customerId },
  });
};

export const createCustomer = async (
  customer: Pick<Customer, "name" | "email">,
) => {
  return await prisma.customer.create({ data: customer });
};

export const updateCustomer = async (
  customer: Pick<Customer, "customerId" | "name" | "email">,
) => {
  return await prisma.customer.update({
    where: { customerId: customer.customerId },
    data: customer,
  });
};

export const deleteCustomer = async (customerId: number) => {
  return await prisma.customer.delete({ where: { customerId } });
};
