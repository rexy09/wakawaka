import { Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { NavLink } from "react-router-dom";
import { Color } from "../../../../theme";

type Props = {
  label: string;
  target?: string;
  to: string;
  iconKey?: string;

  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavLinkButton(props: Props) {
  const { hovered, ref } = useHover();
  
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
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive || hovered ? "#044299" : "transparent",
            }}
          >
            <Text
              fz="14px"
              fw={500}
              c={isActive || hovered ? Color.White : "#FFFFFF99"}
            >
              {props.label}
            </Text>
          </div>
        );
      }}
    />
  );
}
