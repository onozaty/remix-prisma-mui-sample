import { CustomerSchema, CustomerTypeItems } from "#app/routes/customers+/new";
import { getCustomer, updateCustomer } from "#app/services/customer.server";
import {
  getFieldsetProps,
  getFormProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

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
  const submission = parseWithZod(formData, { schema: CustomerSchema });
  if (submission.status !== "success") {
    return json(submission.reply());
  }
  const { name, email, type } = submission.value;

  await updateCustomer({
    customerId: Number(params.customerId),
    name,
    email,
    type,
  });

  return redirect("/customers");
};

export default function EditCustomer() {
  const customer = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CustomerSchema });
    },

    // blurイベント発生時にフォームを検証する
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const typeSelect = useInputControl(fields.type);

  return (
    <Box>
      <Typography variant="h5">Edit Customer</Typography>
      <Box sx={{ mt: 1 }}>
        <Form method="post" {...getFormProps(form)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                defaultValue={customer.name}
                fullWidth
                error={(fields.name.errors?.length ?? 0) > 0}
                helperText={fields.name.errors}
                {...getFieldsetProps(fields.name)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                defaultValue={customer.email}
                fullWidth
                error={(fields.email.errors?.length ?? 0) > 0}
                helperText={fields.email.errors}
                {...getFieldsetProps(fields.email)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Type"
                select
                fullWidth
                onChange={(event) => typeSelect.change(event.target.value)}
                defaultValue={customer.type}
                error={(fields.email.errors?.length ?? 0) > 0}
                helperText={fields.email.errors}
                {...getFieldsetProps(fields.type)}
              >
                {CustomerTypeItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
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
