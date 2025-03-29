import { Box, Group } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
// import ColorSchemeToggle from "../../components/color_scheme_toggle";

function AuthHeader() {
   const colorScheme = useColorScheme();

  return (
      <Box
        px="md"
        style={{
          border: 0,
          background: colorScheme === "dark" ? "#101113" : "#eef3fd",
        }}
      >
        <Group justify="flex-end" style={{ height: "100%" }}>
          <Group>
            {/* <ColorSchemeToggle /> */}
          </Group>
        </Group>
      </Box>
  );
}

export default AuthHeader;
