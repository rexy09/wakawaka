import { useEffect, useState } from "react";
import { useProfileServices } from "../../profile/services";
import { Avatar } from "@mantine/core";

interface Props {
  userId: string;
}

function UserAvatar({ userId }: Props) {
  const { getUserData } = useProfileServices();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getUserData(userId)
      .then((user) => {
        setImageUrl(user?.avatarURL || null);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, []);

  return <Avatar w="50px" h="50px" radius={"xl"} src={imageUrl} />;
}

export default UserAvatar;
