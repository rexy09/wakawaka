import { Paper, Group, Space, Text, Flex } from "@mantine/core";
import { Icons } from "../../../../common/icons";

interface Props {
  title: string;
  data: number;
}
export default function CompanyStatisticsCard(props: Props) {
 
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
          {Icons.box}
        </div>
        <div>
          <Group>
            <Text size="14px" c="#7D7D91" fw={400}>
              {props.title}
            </Text>
            {Icons.info_circle}
          </Group>
          <Space h="sm" />
          <Text fw={500} size="26px" c="#23293D">
            {props.data}
          </Text>
          <Space h="sm" />
        
        </div>
      </Flex>
    </Paper>
  );
}
