import {
  Container,
  Grid
} from "@mantine/core";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Container fluid style={{ height: "100vh" }} m={0} p={0}>
      <Grid gutter={0} m={0} p={0}>
        <Grid.Col span={{ base: 12, md: 6 }} px={"md"}>
          <Outlet />
        </Grid.Col>
        <Grid.Col span={6} visibleFrom="md" bg={"#151F42"} p={0}>
          {/* <Stack h={"100vh"} justify="flex-end" gap="0">
            <div
              style={{
                background: "#151F42",
                padding: "0px 50px",
              }}
            >
              <Space h="100px" />
            </div>
          </Stack> */}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default AuthLayout;
