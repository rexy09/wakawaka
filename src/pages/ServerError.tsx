import { Button, Container, Group, Text, Title } from '@mantine/core';

export default function ServerError() {


  return (
      <Container h={"100vh"}>
        <div >500</div>
        <Title >Something bad just happened...</Title>
        <Text size="lg" ta="center" >
          Our servers could not handle your request. Don&apos;t worry, our development team was
          already notified. Try refreshing the page.
        </Text>
        <Group justify="center">
          <Button variant="white" size="md">
            Refresh the page
          </Button>
        </Group>
      </Container>
  );
}
