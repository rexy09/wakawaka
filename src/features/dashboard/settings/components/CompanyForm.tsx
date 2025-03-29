import {
  Avatar,
  Box,
  Button,
  FileButton,
  FileInput,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  SimpleGrid,
  Space,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { useSettingsServices } from "../services";
import { ICompanyForm, IYearOfExperience } from "../types";
import { FiExternalLink } from "react-icons/fi";
interface Props {
  isLoading: boolean;
  fetchData: () => void;
  user?: IUserResponse;
}

export default function CompanyForm({ isLoading, fetchData, user }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<IYearOfExperience[]>([]);
  const authUser = useAuthUser<IUserResponse>();

  const { updateOwnerDetails, getYearsOfExperince } = useSettingsServices();
  const form = useForm<ICompanyForm>({
    initialValues: {
      company: "",
      company_phone: "",
      office_location: "",
      website: "",
      years_of_experience: "",
      logo: null,
      registration_certificate: null,
    },

    validate: {
      company: isNotEmpty("Company Name is required"),
      office_location: isNotEmpty("Office Location is required"),
      years_of_experience: isNotEmpty("Year of Experience is required"),
      company_phone: (value) =>
        value.trim().length == 0
          ? "Phone number required"
          : value.trim().length < 10
          ? "Phone number must be atleast 10 digits"
          : null,
    },
  });

  const updateAction = () => {
    setSubmitted(true);

    updateOwnerDetails(form.values, authUser?.owner?.id ?? "")
      .then((_response) => {
        setSubmitted(false);
        form.reset();
        fetchData();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Company details successfuly updated",
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
      company: "",
      company_phone: "",
      office_location: "",
      website: "",
      years_of_experience: "",
      logo: null,
    };
    if (authUser?.owner) {
      values = {
        company: user?.owner?.company ?? "",
        company_phone: user?.owner?.company_phone ?? "",
        office_location: user?.owner?.office_location ?? "",
        website: user?.owner?.website ?? "",
        years_of_experience: years.find((item) => item.name == user?.owner?.years_of_experience)?.id ?? "",
        logo: null,
      };
    }
    form.setValues(values);
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
    fetchOptionData();
  }, [user]);
  useEffect(() => {
    setValues();
  }, [user, years]);

  return (
    <>
      <Box pos="relative" ms={'md'}>
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ children: "Loading..." }}
        />
        <Paper p="md" shadow="xs" radius="md">
          <form
            onSubmit={form.onSubmit(() => {
              updateAction();
            })}
          >
            <Group>
              <Avatar
                src={
                  !form.values.logo
                    ? authUser?.user_type == "owner"
                      ? user?.owner?.logo
                      : user?.user?.profile_img
                    : URL.createObjectURL(form.values.logo)
                }
                alt="profile"
                size={"xl"}
              />
              <Group>
                {!form.values.logo ? (
                  <FileButton
                    onChange={(file) => {
                      if (file) {
                        form.setValues({
                          logo: file ?? null,
                        });
                      }
                    }}
                    accept="image/png,image/jpeg"
                  >
                    {(props) => (
                      <Button {...props} radius={"md"}>
                        Change image
                      </Button>
                    )}
                  </FileButton>
                ) : (
                  <>
                    <Button
                      color="green"
                      onClick={() => {
                        updateAction();
                      }}
                      radius={"md"}
                      variant=""
                      loading={submitted}
                      disabled={submitted}
                    >
                      Save
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        form.setValues({
                          logo: null,
                        });
                      }}
                      radius={"md"}
                      variant="light"
                    >
                      Reset
                    </Button>
                  </>
                )}
              </Group>
            </Group>

            <Space h="md" />

            <SimpleGrid cols={2}>
              <TextInput
                label="Company Name"
                placeholder="Enter company name"
                key={form.key("company")}
                {...form.getInputProps("company")}
                error={form.errors.company}
              />
              <TextInput
                label="Company Phone"
                placeholder="Enter phone number"
                {...form.getInputProps("company_phone")}
              />
              <TextInput
                label="Company Address"
                placeholder="Enter company address"
                key={form.key("office_location")}
                {...form.getInputProps("office_location")}
              />
              <TextInput
                label="Company Website"
                placeholder="Enter company website"
                key={form.key("website")}
                {...form.getInputProps("website")}
              />
             
              <Select
              disabled={loading}
                label="Year of Experience"
                placeholder="Select Year of Experience"
                searchable
                value={form.values.years_of_experience
                 
                }
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
              />
              <FileInput
                clearable
                label="Registration Certificate"
                placeholder="Upload registration certificate"
                key={form.key("registration_certificate")}
                {...form.getInputProps("registration_certificate")}
              />
              <Button
                component="a"
                href={user?.owner?.registration_certificate}
                target="_blank"
                color="blue"
                // mt="24px"
                rightSection={<FiExternalLink />}
              >
                View Registration Certificate
              </Button>
            </SimpleGrid>

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
