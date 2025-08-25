import { Button, Container, Group, Text, Title, Paper, Space } from '@mantine/core';

export default function ServerError() {
  return (
    <Container size="xs" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper p="xl" radius="lg" shadow="lg" withBorder style={{ width: '100%', textAlign: 'center', }}>
        {/* <Group justify="center" mb="md">
          <Title order={2} c="#e03131" fw={700} style={{ marginRight: 8 }}>Error</Title>
          <Title order={2} c="#151F42" fw={700}>500</Title>
        </Group> */}
        <Title order={1} c="#e03131" fw={900} style={{ fontSize: 80, letterSpacing: -2, marginBottom: 8 }}>
          500
        </Title>
        <Title order={3} mb="sm" c="#151F42">
          Something bad just happened...
        </Title>
        <Text size="lg" ta="center" c="#444" mb="lg">
          Our servers could not handle your request.<br />Don&apos;t worry, our development team was already notified.<br />Try refreshing the page.
        </Text>
        <Group justify="center">
          <Button
            color="red"
            size="md"
            radius="md"
            onClick={() => window.location.reload()}
            style={{ fontWeight: 600 }}
          >
            Refresh the page
          </Button>
        </Group>
        <Space h="md" />
      </Paper>
    </Container>
  );
}
