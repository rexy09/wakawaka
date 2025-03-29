import {
  Avatar,
  Box,
  Button,
  FileButton,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Space,
  TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { useSettingsServices } from "../services";
import { IUserForm } from "../types";

interface Props {
  isLoading: boolean;
  fetchData: () => void;
  user?: IUserResponse;
}

export default function ProfileForm({ isLoading, fetchData, user }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const authUser = useAuthUser<IUserResponse>();



  const { updateUser, updateUserProfileImage } = useSettingsServices();
  const form = useForm<IUserForm>({
    initialValues: {
      full_name: "",
      phone_number: "",
      email: "",
      profile_img: null,
    },

    validate: {
      full_name: isNotEmpty("Full Name is required"),
      phone_number: (value) =>
        value.trim().length == 0
          ? "Phone number required"
          : value.trim().length < 10
            ? "Phone number must be atleast 10 digits"
            : null,
    },
  });

  const updateAction = () => {
    setSubmitted(true);

    updateUser(form.values)
      .then((_response) => {
        setSubmitted(false);
        form.reset();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Profile successfuly updated",
        });
      })
      .catch((_error) => {
        setSubmitted(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };
  const updateImageAction = () => {
    setSubmitted(true);

    updateUserProfileImage(form.values)
      .then((_response) => {
        setSubmitted(false);
        form.reset();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Profile image successfuly updated",
        });
      })
      .catch((_error) => {
        setSubmitted(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  const setValues = () => {
    let values = {
      full_name: "",
      phone_number: "",
      email: "",
    };
    if (authUser?.owner) {
      values = {
        full_name: user?.owner?.user?.full_name ?? "",
        phone_number: user?.owner?.user?.phone_number ?? "",
        email: user?.owner?.user?.email ?? "",
      };
    } else {
      values = {
        full_name: user?.user?.full_name ?? "",
        phone_number: user?.user?.phone_number ?? "",
        email: user?.user?.email ?? "",
      };
    }
    form.setValues(values);
  };

  useEffect(() => {
    setValues();
  }, [user]);

  return (
    <>
      <Box pos="relative" ms={'md'}>
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ children: "Loading..." }}
        />
        <Paper p="md" shadow="xs" radius="md" >
          <form
            onSubmit={form.onSubmit(() => {
              updateAction();
            })}
          >
            <Group>

              <Avatar
                src={
                  !form.values.profile_img ? authUser?.user_type == "owner"
                    ? user?.owner?.user.profile_img
                    : user?.user?.profile_img : URL.createObjectURL(form.values.profile_img)
                }
                alt="profile"
                size={"xl"}
              />
              <Group>
                {!form.values.profile_img ?

                  <FileButton onChange={(file) => {
                    if (file) {
                      form.setValues({
                        profile_img: file ?? null,
                      });
                    }
                  }} accept="image/png,image/jpeg">
                    {(props) => <Button {...props} radius={'md'}>Change image</Button>}
                  </FileButton> : <>

                    <Button color="green" onClick={() => {
                      updateImageAction();
                    }} radius={'md'} variant=""
                      loading={submitted}
                      disabled={submitted}
                    >
                      Save
                    </Button>
                    <Button color="red" onClick={() => {
                      form.setValues({
                        profile_img: null,
                      });
                    }} radius={'md'} variant="light"
                    >
                      Reset
                    </Button>
                  </>
                }
              </Group>
            </Group>

            <Space h="md" />

            <SimpleGrid cols={2}>
              <TextInput
                label="Full Name"
                placeholder="Enter Full Name"
                key={form.key("full_name")}
                {...form.getInputProps("full_name")}
                error={form.errors.full_name}
              />
              <TextInput
                label="Phone Number"
                placeholder="Enter Phone Number"
                {...form.getInputProps("phone_number")}
              />
            </SimpleGrid>
            <TextInput
              readOnly
              label="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />


            <Space h="md" />

            <Button
              radius={'md'}
              type="submit"
              color={Color.PrimaryBlue}
              loading={submitted}
              disabled={submitted}
             
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}
