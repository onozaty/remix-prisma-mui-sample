import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix + Prisma Sample App" },
    { name: "description", content: "Remix + Prisma Sample App" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Remix + Prisma Sample App</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <Link to="/customers" className="text-blue-700 underline">
            Customers
          </Link>
        </li>
      </ul>
    </div>
  );
}
