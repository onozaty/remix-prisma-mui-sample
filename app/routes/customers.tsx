import { json, Link, useLoaderData } from "@remix-run/react";
import { getCustomers } from "../services/customer.server";

export const loader = async () => {
  const customers = await getCustomers();
  return json(customers);
};

export default function Customers() {
  const customers = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Customers</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {customers.map((customer) => (
          <li key={customer.customerId}>
            <p>Name: {customer.name}</p>
            <p>Email: {customer.email}</p>
          </li>
        ))}
      </ul>
      <Link to="/customers/new" className="text-blue-700 underline">
        New Customer
      </Link>
    </div>
  );
}
