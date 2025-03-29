import { Flex, Group, Space, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { NavLink } from "react-router-dom";
import { Icons } from "../../../../icons";
import { Color } from "../../../../theme";

type Props = {
  label: string;
  target?: string;
  to: string;
  iconKey?: string;
  icon?:any
  ;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavLinkButton(props: Props) {
  const { hovered, ref } = useHover();
  // const colorScheme = useColorScheme();
  const Icon = (iconKey: string, isActive: boolean) =>
    Icons[(isActive ? `${iconKey}2` : iconKey) as keyof typeof Icons];
  return (
    <NavLink
      onClick={() => props.setOpened(true)}
      target={props.target}
      to={props.to}
      
      children={({ isActive }) => {
        return (
          <div
            ref={ref}
            style={{
              height: "72px",
              backgroundColor: isActive || hovered ? "#F3F9FF" : Color.White,
            }}
          >
            <Group justify="space-between">
              <Flex
                h={"72px"}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
                ms={"20px"}
              >
                {props.icon && (
                  <props.icon
                    size="1.3rem"
                    stroke={2}
                    color={isActive || hovered ? Color.PrimaryBlue : Color.DarkBlue}
                  />
                )}
                {props.iconKey ? (
                  Icon(props.iconKey, isActive || hovered)
                ) : (
                  <Space w="md" />
                )}

                <Text
                  fz="20px"
                  fw={isActive || hovered ? 600 : 500}
                  c={isActive || hovered ? Color.PrimaryBlue : Color.DarkBlue}
                  style={{ fontFamily: "Manrope"}}
                >
                  {props.label}
                </Text>
              </Flex>
              {(isActive || hovered) && <div style={{ height: "72px", backgroundColor: Color.PrimaryBlue, width: "8px" }}></div>}
            </Group>
          </div>
        );
      }}
    />
  );
}

export default NavLinkButton;
