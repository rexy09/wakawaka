import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Radio,
  SimpleGrid,
  Space,
  TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Color } from "../../../common/theme";
import useAuthServices from "../services";
import { ISenderForm } from "../types";
interface Props {
  accountType: string;
}

export default function SenderForm({ accountType }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const { postSenderDetails } = useAuthServices();
  const form = useForm<ISenderForm>({
    initialValues: {
      full_name: "",
      phone_number: "",
      role: '',
      identification: '',
      profile_img: null,
    },

    validate: {
      full_name: isNotEmpty("Full Name is required"),
      phone_number: isNotEmpty("Phone number is required"),
      identification: isNotEmpty("Identification is required"),
      // profile_img: (value) => (value == null ? "Profile image required" : null),
    },
  });

  const createAction = () => {
    setSubmitted(true);

    postSenderDetails(form.values)
      .then((_response) => {
        setSubmitted(false);
        form.reset();
        navigate("/auth/callback");
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Your profile have been created successfully",
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


  useEffect(() => {
    console.log(accountType);

    form.setValues({
      role: accountType,
    });
  }, []);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={false}
          loaderProps={{ children: "Loading..." }}
        />
        <form
          onSubmit={form.onSubmit(() => {
            createAction();
          })}
        >
          <SimpleGrid cols={1}>
            <TextInput
              label="Full Name"
              placeholder="Enter Full Name"
              key={form.key("full_name")}
              {...form.getInputProps("full_name")}
              error={form.errors.full_name}
              size="md"
              radius={'md'}
            />
            <TextInput
              label="Phone Number"
              placeholder="Enter Phone Number"
              {...form.getInputProps("phone_number")}
              size="md"
              radius={'md'}
            />
            <Radio.Group
              label="Select your Identification"
              {...form.getInputProps("identification")}
            >
              <Group mt="xs">
                <Radio value="user" label="Sender" />
                <Radio value="dalali" label="Broker" />
                <Radio value="clearing_agent" label="Clearing Agent" />
              </Group>
            </Radio.Group>
            {/* <div>
              <Text c="" size="sm" fw={500} mb={5}>
                Profile Image
              </Text>


              <Dropzone
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.svg,
                  MIME_TYPES.gif,
                ]}
                onDrop={(files) => {
                  if (files.length > 0) {
                    form.setValues({
                      profile_img: files[0] ?? null,
                    });
                  }
                }}
                onReject={(files) => {
                  notifications.show({
                    color: "red",
                    title: "Error",
                    message: `${files.length} files rejected`,
                  });
                }}
                maxSize={10 * 1024 ** 2}
                radius={"md"}
                bg={'#F2F5F980'}
                style={{ border: "dashed 2px #1361E366", borderRadius: "10px" }}
              >
                <Group
                  gap="xl"
                  mih={50}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <LuImagePlus size={40} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IoMdClose size={40} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    {form.values.profile_img ? (

                      <Avatar src={URL.createObjectURL(form.values.profile_img)} color="white" size={'56px'} />
                    ) :
                      <Avatar variant="filled" color="white" size={'56px'} >
                        <LuImagePlus size={24} color={Color.PrimaryBlue} />
                      </Avatar>
                    }
                  </Dropzone.Idle>

                  <div>
                    <Text size="12px" fw={500} inline c={Color.PrimaryBlue}>
                      Upload
                    </Text>
                    <Text
                      size="12px"
                      fw={300}
                      c={Color.PrimaryBlue}
                      inline
                      mt={7}
                      ta={"center"}
                    >
                      Drop your file here or browse
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              <Text c="red" size="xs" mt={5}>
                {form.errors.profile_img}
              </Text>
            </div> */}
          </SimpleGrid>

          <Space h="md" />
          <Button
            fullWidth
            type="submit"
            color={Color.DarkBlue}
            loading={submitted}
            disabled={submitted}
            size="lg"
            radius={"md"}
            onClick={() => {
              // console.log(form.errors);
            }}
          >
            Save & Continue
          </Button>
        </form>
      </Box>
    </>
  );
}
