import { Box, Group, Text } from "@mantine/core";

export default function DasboardFooter() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <>
      <Box p={"md"} mt={"0"}>
        <Group justify="space-between">
          <div>
            <Text
              c="#0A142F"
              style={{
                opacity: 0.75,
                fontSize: 14,
                fontWeight: "400",
                wordWrap: "break-word",
              }}
            >
              © 2025 - {currentYear} Waka Inc.
            </Text>
          </div>
        </Group>
      </Box>
    </>
  );
}
