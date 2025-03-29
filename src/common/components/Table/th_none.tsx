import {
  Flex,
  Text
} from "@mantine/core";

import classes from "./table.module.css";

interface ThProps {
  children: React.ReactNode;
  width?: number;
}


export default function ThNone({ children, width }: ThProps) {
  
  return (
    <th className={classes.th} style={{ width: width ?? "" }}>
        <Flex 
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          <Text fw={600} fz="12px">
            {children}
          </Text>
         
        </Flex>
    </th>
  );
}
