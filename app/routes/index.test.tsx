import Index, { meta } from "#app/routes";
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";

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
