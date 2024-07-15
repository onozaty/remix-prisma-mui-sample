import { Box, Button, Grid, TextField, Typography } from "@mui/material";
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
    <Box>
      <Typography variant="h5">New Customer</Typography>
      <Box sx={{ mt: 1 }}>
        <Form method="post">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Name" name="name" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Email" name="email" fullWidth />
            </Grid>
          </Grid>
          <Box sx={{ justifyContent: "flex-end", display: "flex", mt: 1 }}>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
