import Customers, { action, loader } from "#app/routes/customers";
import { resetDb } from "#tests/test-utils";
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
});
