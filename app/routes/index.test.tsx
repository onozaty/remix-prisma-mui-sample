import Index, { meta } from "#app/routes";
import Customers, { loader } from "#app/routes/customers+";
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

test("画面表示", async () => {
  // ARRANGE
  const RemixStub = createRemixStub([
    {
      path: "/",
      meta: meta,
      Component: Index,
    },
  ]);

  // ACT
  render(<RemixStub initialEntries={["/"]} />);

  // ASSERT
  const heading = await screen.findByRole("heading");
  expect(heading.textContent).toBe("Top");

  const link = await screen.findByRole("link");
  expect(link.textContent).toBe("Customers");
});

test("Customersへの遷移", async () => {
  // ARRANGE
  const RemixStub = createRemixStub([
    {
      path: "/",
      meta: meta,
      Component: Index,
    },
    {
      path: "/customers",
      Component: Customers,
      loader: loader,
    },
  ]);

  // ACT
  render(<RemixStub initialEntries={["/"]} />);
  await userEvent.click(await screen.findByRole("link"));

  // ASSERT
  // -> Customersへ遷移
  const heading = await screen.findByRole("heading", { name: "Customers" });
  expect(heading).toBeInTheDocument();
});
