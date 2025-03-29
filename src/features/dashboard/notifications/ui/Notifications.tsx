import { Group, Space, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "../../home/types";
import { useNotificationServices } from "../services";
import { INotification } from "../types";
import NotificationSection from "./NotificationSection";
import { useNotificationStore } from "../stores";

export default function Notifications() {
  const { getNotifications } = useNotificationServices();
  const [isLoading, setIsLoading] = useState(false);
  const [_notificationResponse, setNotificationResponse] =
    useState<PaginatedResponse<INotification>>();

  const [sanaNotifications, setNotifications] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const notificationStore = useNotificationStore();
  const fetchData = (pageNum: number) => {
    setIsLoading(true);
    getNotifications(pageNum, notificationStore.isRead)
      .then((response) => {
        setIsLoading(false);
        const data = response.data as PaginatedResponse<INotification>;
        setNotificationResponse(data);
        setNotifications((prev) => [...prev, ...data.results]);
        setHasMore(pageNum < Math.ceil(data.count / 10));
      })
      .catch((error) => {
        setIsLoading(false);

        if (
          error.response.data.detail == "Invalid page." &&
          error.response.status == 404
        ) {
          return;
        } else {
          notifications.show({
            color: "red",
            title: "Error",
            message: "Something went wrong!",
          });
        }
      });
  };

  const fetchtNotifications = () => {
    setNotifications([]);
    setPage(1);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, notificationStore.isRead]);

  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Notifications
        </Text>
      </Group>
      <Space h="md" />
      <NotificationSection
        data={sanaNotifications}
        isLoading={isLoading}
        hasMore={hasMore}
        setPage={setPage}
        setNotifications={setNotifications}
        fetchtNotifications={fetchtNotifications}
      />
      <Space h="md" />
    </div>
  );
}
