import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "#app/services/customer.server";
import { customerFactory, resetDb } from "#test/test-utils";
import { CustomerType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

beforeEach(async () => {
  await resetDb();
});

describe("getCustomers", () => {
  test("0件", async () => {
    // ACT
    const customers = await getCustomers();

    // ASSERT
    expect(customers).toHaveLength(0);
  });

  test("1件", async () => {
    // ARRANGE
    const customer1 = await customerFactory.create();

    // ACT
    const customers = await getCustomers();

    // ASSERT
    expect(customers).toEqual([customer1]);
  });

  test("複数件", async () => {
    // ARRANGE
    const customer1 = await customerFactory.create();
    const customer2 = await customerFactory.create();

    // ACT
    const customers = await getCustomers();

    // ASSERT
    expect(customers.sort((a, b) => a.customerId - b.customerId)).toEqual([
      customer1,
      customer2,
    ]);
  });
});

describe("getCustomer", () => {
  test("対象無し", async () => {
    // ACT
    const customer = await getCustomer(1);

    // ASSERT
    expect(customer).toBeNull();
  });

  test("対象あり", async () => {
    // ARRANGE
    const customer1 = await customerFactory.create();

    // ACT
    const customer = await getCustomer(customer1.customerId);

    // ASSERT
    expect(customer).toEqual(customer1);
  });
});

describe("createCustomer", () => {
  test("正常", async () => {
    // ARRANGE
    const name = "あいうえお";
    const email = "test@example.com";
    const type: CustomerType = "CORPORATE";

    // ACT
    const created = await createCustomer({ name, email, type });

    // ASSERT
    const customer = await getCustomer(created.customerId);
    expect(customer).toEqual(created);
    expect(customer).toEqual({
      customerId: expect.anything(),
      name,
      email,
      createdAt: expect.anything(),
    });
  });

  test("同じemail", async () => {
    // ARRANGE
    const other = await customerFactory.create();
    const name = "あいうえお";
    const email = other.email; // 同じemail
    const type: CustomerType = "CORPORATE";

    try {
      // ACT
      await createCustomer({ name, email, type });
      throw new Error("エラーがスローされなかった");
    } catch (e) {
      expect(e).toBeInstanceOf(PrismaClientKnownRequestError);
      assert(e instanceof PrismaClientKnownRequestError);
      expect(e.code).toBe("P2002");
    }
  });
});

describe("updateCustomer", () => {
  test("正常", async () => {
    // ARRANGE
    const target = await customerFactory.create();
    const name = "あいうえお";
    const email = "test@example.com";
    const type: CustomerType = "CORPORATE";

    // ACT
    const updated = await updateCustomer({
      customerId: target.customerId,
      name,
      email,
      type,
    });

    // ASSERT
    const customer = await getCustomer(target.customerId);
    expect(customer).toEqual(updated);
    expect(customer).toEqual({
      customerId: expect.anything(),
      name,
      email,
      createdAt: expect.anything(),
    });
  });

  test("同じemail", async () => {
    // ARRANGE
    const target = await customerFactory.create();
    const other = await customerFactory.create();
    const name = "あいうえお";
    const email = other.email; // 同じemail
    const type: CustomerType = "CORPORATE";

    // ACT
    try {
      await updateCustomer({
        customerId: target.customerId,
        name,
        email,
        type,
      });
      throw new Error("エラーがスローされなかった");
    } catch (e) {
      // ASSERT
      expect(e).toBeInstanceOf(PrismaClientKnownRequestError);
      assert(e instanceof PrismaClientKnownRequestError);
      expect(e.code).toBe("P2002");
    }
  });

  test("対象無し", async () => {
    // ARRANGE
    const name = "あいうえお";
    const email = "test@example.com";
    const type: CustomerType = "CORPORATE";

    try {
      // ACT
      await updateCustomer({ customerId: 1, name, email, type });
      throw new Error("エラーがスローされなかった");
    } catch (e) {
      expect(e).toBeInstanceOf(PrismaClientKnownRequestError);
      assert(e instanceof PrismaClientKnownRequestError);
      expect(e.code).toBe("P2025");
    }
  });
});

describe("deleteCustomer", () => {
  test("正常", async () => {
    // ARRANGE
    const target = await customerFactory.create();

    // ACT
    const deleted = await deleteCustomer(target.customerId);

    // ASSERT
    const customer = await getCustomer(target.customerId);
    expect(customer).toBeNull();
    expect(deleted).toEqual(target);
  });

  test("対象無し", async () => {
    // ACT
    try {
      await deleteCustomer(1);
      throw new Error("エラーがスローされなかった");
    } catch (e) {
      expect(e).toBeInstanceOf(PrismaClientKnownRequestError);
      assert(e instanceof PrismaClientKnownRequestError);
      expect(e.code).toBe("P2025");
    }
  });
});
