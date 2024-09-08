import Customers, { action, loader } from "#app/routes/customers+/index";
import { customerFactory, resetDb } from "#test/test-utils";
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";

beforeEach(async () => {
  await resetDb();
});

test("0件", async () => {
  // ARRANGE
  const RemixStub = createRemixStub([
    {
      path: "/customers",
      Component: Customers,
      loader,
      action,
    },
  ]);

  // ACT
  render(<RemixStub initialEntries={["/customers"]} />);

  // ASSERT
  const heading = await screen.findByRole("heading");
  expect(heading.textContent).toBe("Customers");

  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(1); // ヘッダのみ

  // ヘッダの確認
  const headerCells = rows[0].querySelectorAll("th");
  expect(headerCells).toHaveLength(3);
  expect(headerCells[0]).toHaveTextContent("Name");
  expect(headerCells[1]).toHaveTextContent("Email");
  expect(headerCells[2]).toHaveTextContent("");
});

test("1件", async () => {
  // ARRANGE
  const customer1 = await customerFactory.create();

  const RemixStub = createRemixStub([
    {
      path: "/customers",
      Component: Customers,
      loader,
      action,
    },
  ]);

  // ACT
  render(<RemixStub initialEntries={["/customers"]} />);

  // ASSERT
  const heading = await screen.findByRole("heading");
  expect(heading.textContent).toBe("Customers");

  // ヘッダ＋データ行
  const [header, ...dataRows] = await screen.findAllByRole("row");

  // ヘッダの確認
  const headerCells = header.querySelectorAll("th");
  expect(headerCells).toHaveLength(3);
  expect(headerCells[0]).toHaveTextContent("Name");
  expect(headerCells[1]).toHaveTextContent("Email");
  expect(headerCells[2]).toHaveTextContent("");

  // データ行の確認
  expect(dataRows).toHaveLength(1);
  const data1Cells = dataRows[0].querySelectorAll("td");
  expect(data1Cells).toHaveLength(3);
  expect(data1Cells[0]).toHaveTextContent(customer1.name);
  expect(data1Cells[1]).toHaveTextContent(customer1.email);
});
