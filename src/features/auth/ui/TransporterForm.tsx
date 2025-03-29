import {
  Avatar,
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Radio,
  Select,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Color } from "../../../common/theme";
import { useSettingsServices } from "../../dashboard/settings/services";
import { IYearOfExperience } from "../../dashboard/settings/types";
import useAuthServices from "../services";
import { ITransporterForm } from "../types";
interface Props {
  accountType: string;
}

export default function TransporterForm({ accountType }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<IYearOfExperience[]>([]);
  const navigate = useNavigate();

  const { getYearsOfExperince } = useSettingsServices();
  const { postOwnerDetails } = useAuthServices();
  const form = useForm<ITransporterForm>({
    initialValues: {
      full_name: "",
      phone_number: "",
      role: "",
      company: "",
      company_phone: "",
      years_of_experience: "",
      identification: "",
      logo: null,
      registration_certificate: null,
    },

    validate: {
      full_name: isNotEmpty("Full Name is required"),
      phone_number: isNotEmpty("Phone number is required"),
      company: isNotEmpty("Company Name is required"),
      years_of_experience: isNotEmpty("Year of Experience is required"),
      identification: isNotEmpty("Identification is required"),

      company_phone: (value) =>
        value.trim().length == 0
          ? "Phone number required"
          : value.trim().length < 10
            ? "Phone number must be atleast 10 digits"
            : null,
      logo: (value) =>
        value == null ? "Logo image required" : null,
      registration_certificate: (value) => (value == null ? "Registration certificate required" : null),
    },
  });

  const createAction = () => {
    setSubmitted(true);

    postOwnerDetails(form.values)
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

  const fetchOptionData = () => {
    setLoading(true);
    getYearsOfExperince()
      .then((response) => {
        setLoading(false);

        setYears(response.data.results);
      })
      .catch((_error) => {
        setLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    form.setValues({
      role: accountType,
    });
    fetchOptionData();
  }, []);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
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
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              key={form.key("company")}
              {...form.getInputProps("company")}
              error={form.errors.company}
              size="md"
              radius={'md'}
            />
            <TextInput
              label="Company Phone"
              placeholder="Enter company phone number"
              {...form.getInputProps("company_phone")}
              size="md"
              radius={'md'}
            />

            <Select
              disabled={loading}
              label="Year of Experience"
              placeholder="Select year of experience"
              searchable
              value={form.values.years_of_experience}
              data={[
                ...years.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
              onChange={(value) => {
                form.setValues({
                  years_of_experience: value ?? "",
                });
              }}
              error={form.errors.years_of_experience}
              size="md"
              radius={'md'}
            />
            <Radio.Group
              label="Select your Identification"
              {...form.getInputProps("identification")}
            >
              <Group mt="xs">
                <Radio value="owner" label="Owner" />
                <Radio value="dalali" label="Broker" />
              </Group>
            </Radio.Group>
            <FileInput
              clearable
              label="Registration Certificate"
              placeholder="Upload registration certificate"
              key={form.key("registration_certificate")}
              {...form.getInputProps("registration_certificate")}
              size="md"
              radius={'md'}
            />
            <div>
              <Text c="" size="sm" fw={500} mb={5}>
                Company Logo
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
                      logo: files[0] ?? null,
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
                    {form.values.logo ? (

                      <Avatar src={URL.createObjectURL(form.values.logo)} color="white" size={'56px'} />
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
                {form.errors.logo}
              </Text>
            </div>
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
