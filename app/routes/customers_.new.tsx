import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createCustomer } from "../services/customer.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");

  invariant(typeof name === "string", "name must be a string");
  invariant(typeof email === "string", "email must be a string");

  await createCustomer({ name, email });

  return redirect("/customers");
}

export default function Component() {
  return (
    <>
      <h1>New Customer</h1>
      <Form method="post">
        <p>
          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              className="rounded border border-gray-500 px-2 py-1"
            />
          </label>
        </p>
        <p>
          <label>
            <span>Email</span>
            <input
              type="text"
              name="email"
              className="rounded border border-gray-500 px-2 py-1"
            />
          </label>
        </p>
        <p>
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Create
          </button>
        </p>
      </Form>
    </>
  );
}
