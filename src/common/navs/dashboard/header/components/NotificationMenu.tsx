import { ActionIcon, Indicator } from "@mantine/core";

import { useEffect, useState } from "react";
import { Icons } from "../../../../icons";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../../../../features/dashboard/notifications/stores";
import { useNotificationServices } from "../../../../../features/dashboard/notifications/services";
import { PaginatedResponse } from "../../../../../features/dashboard/home/types";
import { INotification } from "../../../../../features/dashboard/notifications/types";

type Props = {
  setOpened?: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function NotificationMenu({ setOpened }: Props) {
  const navigate = useNavigate();

  const notificationStore = useNotificationStore();
  const [_isLoading, setIsLoading] = useState(false);

  const [_userMenuOpened, _setUserMenuOpened] = useState(false);
  const { getUreadNotifications } = useNotificationServices();
  const [_unreadNotificationResponse, setUreadNotificationResponse] =
    useState<PaginatedResponse<INotification>>();

  const fetchtUreadNotifications = () => {
    getUreadNotifications(notificationStore.isRead)
      .then((response) => {
        setIsLoading(false);
        const data = response.data as PaginatedResponse<INotification>;
        setUreadNotificationResponse(data);
        if (notificationStore.isRead == undefined) {
          notificationStore.updateText("count", data.count.toString());
          notificationStore.updateText("readCount", data.count);
        } else if (notificationStore.isRead == false) {
          notificationStore.updateText("count", data.count.toString());
          notificationStore.updateText("readCount", data.count);
        } else {
          notificationStore.updateText("readCount", data.count);
        }
      })
      .catch((_error) => {
        setIsLoading(false);
        // notifications.show({
        //   color: "red",
        //   title: "Error",
        //   message: "Something went wrong!",
        // });
      });
  };

  useEffect(() => {
    notificationStore.updateText("isRead", undefined);
  }, []);
  
  useEffect(() => {
    fetchtUreadNotifications();
  }, [notificationStore.refresh]);

  return (
    <>
      <Indicator
        color="#F06A6A"
        size={20}
        offset={5}
        processing
        withBorder
        disabled={Number(notificationStore.count) === 0}
        label={
          Number(notificationStore.count) >= 100
            ? "99+"
            : Number(notificationStore.count)
        }
      >
        <ActionIcon
          variant="outline"
          color="#0000001A"
          size="lg"
          radius={"md"}
          aria-label="notifications"
          onClick={() => {
            setOpened && setOpened(false);
            navigate("/notifications");
          }}
        >
          {Icons.notification}
        </ActionIcon>
      </Indicator>
      {/* <Menu
      width={400}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <ActionIcon variant="outline" color="#0000001A" size="lg" radius={'md'} aria-label="Settings">
          <Indicator color="#F06A6A" size={10} offset={5} processing withBorder>
            {Icons.notification}
          </Indicator>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea h={300}>
          <Menu.Label>Notifications</Menu.Label>

          <Text size="sm" ta="center">
            No notifications
          </Text>

        </ScrollArea>
      </Menu.Dropdown>
    </Menu> */}
    </>
  );
}
