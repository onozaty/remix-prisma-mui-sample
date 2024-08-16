import { deleteCustomer, getCustomers } from "#app/services/customer.server";
import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader = async () => {
  const customers = await getCustomers();
  return json(customers);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const customerId = formData.get("customerId");

  invariant(customerId, "Missing customerId param");

  await deleteCustomer(Number(customerId));

  return redirect("/customers");
};

export default function Customers() {
  const customers = useLoaderData<typeof loader>();

  return (
    <Box>
      <Typography variant="h5">Customers</Typography>
      <Box sx={{ justifyContent: "flex-end", display: "flex", mb: 1 }}>
        <Button component={Link} to="/customers/new" variant="contained">
          New Customer
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Box
                    component={Form}
                    method="delete"
                    onSubmit={(event) => {
                      if (!confirm("Do you want to delete it?")) {
                        event.preventDefault();
                      }
                    }}
                    sx={{
                      display: "inline-block",
                    }}
                  >
                    <input
                      type="hidden"
                      name="customerId"
                      value={customer.customerId}
                    ></input>
                    <Button
                      type="submit"
                      variant="outlined"
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </Box>
                  <Button
                    component={Link}
                    to={`/customers/${customer.customerId}/edit`}
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{ marginLeft: 2 }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
