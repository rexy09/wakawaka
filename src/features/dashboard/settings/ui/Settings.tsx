import { Space, Tabs, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { FaRegUser } from "react-icons/fa";
import { IUser } from "../../../auth/types";
import ProfileForm from "../components/ProfileForm";
import { useSettingsServices } from "../services";
import { Color } from "../../../../common/theme";
import { useSearchParams } from "react-router-dom";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const { getUser } = useSettingsServices();
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();
  const authHeader = useAuthHeader();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSystemUser = (userState: IUser) => {
    if (
      authHeader &&
      signIn({
        auth: {
          token: authHeader.split(" ")[1],
          type: "Bearer",
        },
        userState: userState,
      })
    ) {
      return;
    }
  };
  const fetchData = () => {
    setIsLoading(true);
    getUser()
      .then((response) => {
        setIsLoading(false);
        setUser(response.data);
        updateSystemUser(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    if (searchParams.get("tab") == "second") {
      setActiveTab("second");
    } else {
      setActiveTab("first");
    }
    fetchData();
  }, [searchParams]);

  return (
    <div>
      <Tabs
        keepMounted={false}
        value={activeTab}
        onChange={setActiveTab}
        // variant="pills" 
        orientation="vertical"
      >

        <Tabs.List w={200} >
          <Tabs.Tab value="first" leftSection={<FaRegUser color={activeTab == "first" ? Color.PrimaryBlue : ""} size={18} />} mb={'md'} onClick={() => {
            searchParams.delete("tab");
            setSearchParams(searchParams);
          }}>
            <Text c={activeTab == "first" ? Color.PrimaryBlue : ""} size="16px">
              Profile
            </Text>
          </Tabs.Tab>
          
          
        </Tabs.List>

        <Space h="md" />

        <Tabs.Panel value="first" >
          <ProfileForm
            isLoading={isLoading}
            fetchData={fetchData}
            user={user}
          />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <Text>Second tab</Text>
        </Tabs.Panel>
        
      </Tabs>
    </div>
  );
}
