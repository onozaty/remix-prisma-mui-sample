import { getFieldsetProps, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createCustomer } from "../services/customer.server";

const CustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CustomerSchema });
  if (submission.status !== "success") {
    return json(submission.reply());
  }
  const { name, email } = submission.value;

  await createCustomer({ name, email });

  return redirect("/customers");
}

export default function NewCustomer() {
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

  return (
    <Box>
      <Typography variant="h5">New Customer</Typography>
      <Box sx={{ mt: 1 }}>
        <Form method="post" {...getFormProps(form)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                fullWidth
                error={(fields.name.errors?.length ?? 0) > 0}
                helperText={fields.name.errors}
                {...getFieldsetProps(fields.name)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                fullWidth
                error={(fields.email.errors?.length ?? 0) > 0}
                helperText={fields.email.errors}
                {...getFieldsetProps(fields.email)}
              />
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
