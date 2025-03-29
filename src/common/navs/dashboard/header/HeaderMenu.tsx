import { Burger, Group, Image, Select } from "@mantine/core";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import mainLogo from "../../../../assets/sana_logo.svg";
import { IUserResponse } from "../../../../features/auth/types";
import { Icons } from "../../../icons";
import { Color } from "../../../theme";
import AccountMenu from "./components/AccountMenu";
import NotificationMenu from "./components/NotificationMenu";

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function HeaderMenu({ opened, setOpened }: Props) {
  const navigate = useNavigate();
  const authUser = useAuthUser<IUserResponse>();
  const routesByRights = {
    sender: [{ value: '/post_cargo', label: 'Post Cargo' }],
    owner: [
      { value: '/company', label: 'Company' },
      { value: '/jobs', label: 'Jobs' },
      { value: '/settings?tab=second', label: 'Company Settings' },
    ],
    general: [
      { value: '/', label: 'Dashboard' },
      { value: '/tracking', label: 'Tracking' },
      { value: '/bids', label: 'Bids' },
      { value: '/documents', label: 'Documents' },
      { value: '/eve', label: 'Eve' },
      { value: '/billing', label: 'Billing' },
      { value: '/reports', label: 'Reports' },
      { value: '/settings', label: 'Profile Settings' },
    ],
  };

  return (
    <Group h="100%" justify="space-between" bg={"white"} p={"md"}>
      <Group hiddenFrom="md">
        <Group>
          <Image radius="md" w={"130px"} src={mainLogo} alt="logo image" />

        </Group>
      </Group>
      <Group visibleFrom="md">
        <Select
          leftSection={Icons.search}
          rightSection={<></>}
          radius="md"
          size="md"
          value={''}
          variant="unstyled"
          placeholder="Search for pages"
          searchable
          clearable
          data={[
            ...(authUser?.user_type === 'owner' ? routesByRights.owner : []),
            ...(authUser?.user_type === 'sender' ? routesByRights.sender : []),
            ...routesByRights.general
          ]}
          onChange={(value) => {
            navigate(value ?? "/");
          }}
        />

      </Group>
      <Group>
        <Group visibleFrom="sm">
          <NotificationMenu />
          <AccountMenu />
        </Group>
        
        <Group>
          <Burger
            color={Color.PrimaryBlue}
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="md"
          />
        </Group>
      </Group>
    </Group>
  );
}
