import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCustomer, updateCustomer } from "../services/customer.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.customerId, "Missing customerId param");
  const customer = await getCustomer(Number(params.customerId));
  if (!customer) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(customer);
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.customerId, "Missing customerId param");

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  invariant(typeof name === "string", "name must be a string");
  invariant(typeof email === "string", "email must be a string");

  await updateCustomer({ customerId: Number(params.customerId), name, email });

  return redirect("/customers");
};

export default function EditCustomer() {
  const customer = useLoaderData<typeof loader>();
  return (
    <Box>
      <Typography variant="h5">Edit Customer</Typography>
      <Box sx={{ mt: 1 }}>
        <Form method="post">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                name="name"
                defaultValue={customer.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                defaultValue={customer.email}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ justifyContent: "flex-end", display: "flex", mt: 1 }}>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
