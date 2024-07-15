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
import { json, Link, useLoaderData } from "@remix-run/react";
import { getCustomers } from "../services/customer.server";

export const loader = async () => {
  const customers = await getCustomers();
  return json(customers);
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
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell component="th" scope="row">
                  {customer.name}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
