import { Flex, Group, NumberFormatter, Paper, Space, Text } from "@mantine/core";
import { Icons } from "../../../../common/icons";

interface Props {
  title: string;
  subscript?: string;
  duration: string;
  data: number;
}
export default function BillingStatisticCard(props: Props) {

  return (
    <Paper
      p="20px"
      radius="10px"
      key={props.title}
      style={{ border: "2px solid #1A2F570F" }}
    >
      <Flex gap="xs" align="flex-start" direction="row">
        <div
          style={{
            border: "1px solid #292D3214",
            borderRadius: "8px",
            padding: 10,
            width: "40px",
            height: "40px",
          }}
        >
          {Icons.billingStats}
        </div>
        <div>
          <Group>
            <Text size="14px" c="#7D7D91" fw={400}>
              {props.title}
            </Text>
            {Icons.info_circle}
          </Group>
          <Space h="lg" />
          <Text fw={500} size="26px" c="#23293D">
            <NumberFormatter prefix="" value={props.data} thousandSeparator />
            {' '}
            {props.subscript && <sub>{props.subscript}</sub>}
          </Text>
          <Space h="sm" />

        </div>
      </Flex>
    </Paper>
  );
}
