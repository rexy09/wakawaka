import useApiClient from "../../services/ApiClient";

export const useNotificationServices = () => {
  const { sendRequest } = useApiClient();

  const getNotifications = async (page: number, isRead?: boolean) => {
    return sendRequest({
      method: "get",
      url: "/extra/notification",
      params: {
        page: page,
        limit: 10,
        ...(isRead !== undefined ? { is_read: isRead } : {}),
      },
    });
  };

  const getUreadNotifications = async (isRead?: boolean) => {
    return sendRequest({
      method: "get",
      url: "/extra/notification",
      params: {
        page: 1,
        limit: 10,
        is_read: isRead ?? false,
      },
    });
  };
  const readNotification = async (id: number) => {
    return sendRequest({
      method: "patch",
      url: "/extra/notification/" + id.toString(),
      data: {
        is_read: true,
      },
    });
  };

  return {
    getNotifications,
    getUreadNotifications,
    readNotification,
  };
};
