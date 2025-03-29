import { Group, Space, Text } from "@mantine/core";
import Settings from "../../features/dashboard/settings/ui/Settings";

export default function SettingsPage() {
  return (
    <>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Settings
        </Text>
      </Group>
      <Space h="md" />
      <Settings />
    </>
  );
}
