import { Paper, Group, Space, Text, Flex, NumberFormatter } from "@mantine/core";
import { IOrderStatistic } from "../types";
import { Icons } from "../../../../common/icons";

interface Props {
  title: string;
  duration: string;
  data: IOrderStatistic;
}
export default function OrderStatisticCard(props: Props) {
  const DiffIcon =
    props.data.percentage_difference > 0 ? Icons.arrow_up : Icons.arrow_down;
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
            {props.data.count}
          </Text>
          <Space h="sm" />
          <Group>
            <Text size="14px" c="#7D7D91" fw={400}>
              vs {props.duration}
            </Text>
            <div
              className="py-[2px] px-2"
              style={{
                borderRadius: "38px",
                backgroundColor:
                  props.data.percentage_difference > 0
                    ? "#F0F2F9"
                    : "#E65E5E1A",
              }}
            >
              <Group gap={2}>
                <Text
                  c={
                    props.data.percentage_difference > 0 ? "#1C4E8C" : "#E65E5E"
                  }
                  fz="12px"
                  fw={500}
                >
                  <span>
                    <NumberFormatter value={props.data.percentage_difference} decimalScale={2} />
                    %
                  </span>
                </Text>
                {DiffIcon}
              </Group>
            </div>
          </Group>
        </div>
      </Flex>
    </Paper>
  );
}
