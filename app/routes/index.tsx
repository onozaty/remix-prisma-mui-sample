import {
  Box,
  List,
  ListItem,
  Link as MuiLink,
  Typography,
} from "@mui/material";
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
    <Box>
      <Typography variant="h5">Top</Typography>
      <List>
        <ListItem>
          <MuiLink component={Link} to="/customers" underline="hover">
            Customers
          </MuiLink>
        </ListItem>
      </List>
    </Box>
  );
}
