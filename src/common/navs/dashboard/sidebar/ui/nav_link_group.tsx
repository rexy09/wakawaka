import {
  Collapse,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React, { useState } from "react";
import classes from "./nav_links.module.css";
import { useLocation } from "react-router-dom";
import { Color } from "../../../../theme";

type Props = {
  label: string;
  children: React.ReactNode;
  icon: any;
  path: string;
};
function NavLinkGroup(props: Props) {
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <UnstyledButton
        p={"sm"}
        onClick={() => {
          setOpened((o) => !o);
          return;
        }}
        className={classes.control}
      >
        <Group justify="space-between">
          <Group>
            <props.icon
              size="1.3rem"
              stroke={2}
              color={
                splitLocation[1] === props.path
                  ? Color.TextSecondary2
                  : Color.White
              }
            />
            <Text
              fz="16px"
              fw={600}
              c={
                splitLocation[1] === props.path
                  ? Color.TextSecondary2
                  : Color.White
              }
            >
              {props.label}
            </Text>
          </Group>
          {/* <IconChevronRight
            className={classes.chevron}
            stroke={1.6}
            style={{
              width: rem(16),
              height: rem(16),
              transform:
                splitLocation[1] === props.path
                  ? "rotate(-90deg)"
                  : opened
                  ? "rotate(-90deg)"
                  : "none",
              color:
                splitLocation[1] === props.path
                  ? Color.TextSecondaryHover
                  : Color.White,
            }}
          /> */}
        </Group>
      </UnstyledButton>
      <Collapse in={splitLocation[1] === props.path ? true : opened}>
        {props.children}
      </Collapse>
    </div>
  );
}

export default NavLinkGroup;
