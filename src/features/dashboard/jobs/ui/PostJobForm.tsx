import {
  Button,
  Grid,
  Group,
  NumberInput,
  Progress,
  Select,
  SimpleGrid,
  Space,
  Switch,
  Text,
  Textarea,
  TextInput,
  UnstyledButton
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Libraries, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Color } from "../../../../common/theme";
import Env from "../../../../config/env";
import { IUser } from "../../../auth/types";
import { useCountriesAndCurrencies } from "../../profile/data";
import GooglePlacesAutocomplete from "../components/GooglePlacesAutocomplete";
import { useJobServices } from "../services";
import {
  ICategory,
  ICommitmentType,
  IJobForm,
  IUrgencyLevels,
  IWorkLocations,
} from "../types";

const libraries: Libraries = ["places", "maps"];

export default function PostJobForm() {
  const authUser = useAuthUser<IUser>();

  const navigate = useNavigate();
  const { getTranslatedCatgories, getCommitmentTypes, getUrgencyLevels, postJob, getUserJobPostCount, getWorkLocations } =
    useJobServices();
  const { currencies } = useCountriesAndCurrencies();
  const [submitted, setSubmitted] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [jobCategories, setJobCategories] = useState<ICategory[]>([]);
  const [commitmentTypes, setCommitmentTypes] = useState<ICommitmentType[]>([]);
  const [urgencyLevels, setUrgencyLevels] = useState<IUrgencyLevels[]>([]);
  const [workLocations, setWorkLocations] = useState<IWorkLocations[]>([]);
  const [numberOfPostedJobsByUser, setNumberOfPostedJobsByUser] = useState<number>(1);

  const form = useForm<IJobForm>({
    initialValues: {
      title: "",
      description: "",
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
      category: "",
      commitment: "Day Worker",
      urgency: "Normal",
      budgetType: "Fixed",
      budget: 0,
      workLocation: "Onsite",
      numberOfPositions: 1,
      biddingType: "",
      hasBidding: false,
      imageUrls: [],
      currency: currencies.find(c => c.code === authUser?.currency?.code) || undefined,
    },

    validate: (values) => {
      if (active === 1) {
        return {
          category:
            values.category.trim().length == 0 ? "Category required" : null,
          urgency:
            values.urgency.trim().length == 0 ? "Urgency required" : null,
          location:
            values.location.address.trim().length == 0
              ? "Location required"
              : null,
          numberOfPositions:
            values.numberOfPositions <= 0
              ? "Number of position required"
              : null,
        };
      }
      if (active === 2) {
        return {
          budget: values.budget <= 0 ? "Budget required" : null,
          urgency:
            values.urgency.trim().length == 0 ? "Urgency required" : null,

          biddingType:
            values.biddingType.trim().length == 0 && values.hasBidding
              ? "Bidding type required"
              : null,
          description:
            values.description.trim().length <= 0
              ? "Job description required"
              : null,
        };
      }
      return {};
    },
  });
  const submit = () => {
    setSubmitted(true);
    postJob(form.values, numberOfPostedJobsByUser).then(() => {
      setSubmitted(false);
      navigate('/jobs')
    })
      .catch((_error) => {
        setSubmitted(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  }
  const fetchData = () => {
    setIsLoading(true);

    getTranslatedCatgories()
      .then((response) => {
        setIsLoading(false);
        setJobCategories(response.data);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getCommitmentTypes()
      .then((response) => {
        setIsLoading(false);
        setCommitmentTypes(response);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getUrgencyLevels()
      .then((response) => {
        setIsLoading(false);
        setUrgencyLevels(response);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getWorkLocations()
      .then((response) => {
        setIsLoading(false);
        setWorkLocations(response);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getUserJobPostCount().then((response) => {
      setIsLoading(false);
      setNumberOfPostedJobsByUser(response);
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
    fetchData();
  }, []);

  const [active, setActive] = useState(1);

  const nextStep = () => {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 2 ? current + 1 : current;
    });
  };

  const prevStep = () =>
    setActive((current) => (current > 1 ? current - 1 : current));
  return (
    <LoadScript googleMapsApiKey={Env.googleMapsApiKey} libraries={libraries}>
      <form
        onSubmit={form.onSubmit(() => {
          submit();
        })}
      >
        <Space h="xl" />

        <Grid justify="center">
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <Group justify="space-between">
              <UnstyledButton onClick={() => navigate(-1)}>
                <IoArrowBack size={20} />
              </UnstyledButton>
              {/* <UnstyledButton onClick={() => { submit(); }}>
                <Text fw={600} fz={"16px"}>
                  Save And Exit
                </Text>
              </UnstyledButton> */}
            </Group>
            <Space h="md" />
            <Progress
              color={Color.PrimaryBlue}
              value={50 * active}
              bg={"#04429920"}
            />
            <Space h="xl" />
            {active === 1 && (
              <div>
                <Text size="32px" fw={600}>
                  Basic Information
                </Text>
                <Space h="md" />
                <TextInput label={"Job title"} placeholder="UI UX Designer" {...form.getInputProps("title")} />
                <Space h="md" />
                <GooglePlacesAutocomplete
                  label="Location*"
                  location={form.values.location}
                  error={form.errors.location}
                  onSelect={(place) => {
                    form.setFieldValue("location", {
                      address: [place.name, place.formatted_address]
                        .filter(Boolean)
                        .join(", "),
                      latitude: place.latitude,
                      longitude: place.longitude,
                    });
                  }}
                />
                <Space h="md" />
                <Select
                  searchable
                  label="Category*"
                  placeholder="Select your category"
                  data={jobCategories.map((item) => {
                    return { value: item.en, label: item.en };
                  })}
                  {...form.getInputProps("category")}
                />
                <Space h="md" />
                <Grid justify="center">
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <Select
                      label="Urgency*"
                      placeholder="Select your urgency"
                      data={urgencyLevels.map((item) => item.level)}
                      {...form.getInputProps("urgency")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <NumberInput
                      label="Number of positions*"
                      placeholder="Number of positions"
                      min={1}
                      size="md"
                      radius={"md"}
                      {...form.getInputProps("numberOfPositions")}
                    />
                  </Grid.Col>
                </Grid>

                <Space h="md" />
                <Button
                  size="md"
                  variant="filled"
                  radius={"md"}
                  color={Color.DarkBlue}
                  fw={600}
                  onClick={() => {
                    nextStep();
                  }}
                >
                  Continue
                </Button>
              </div>
            )}
            {active === 2 && (
              <div>
                <Text size="32px" fw={600}>
                  Job Information
                </Text>
                <Space h="md" />
                <Grid justify="center">
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <Select
                      label="Select Currency*"
                      searchable
                      placeholder="Select your currency"
                      value={
                        form.values.currency
                          ? form.values.currency.code
                          : undefined
                      }
                      data={currencies.map((item) => {
                        return { value: item.code, label: `${item.name} (${item.symbol})` };
                      })}
                      onChange={(value) => {
                        const currency = currencies.find(
                          (currency) => currency.code === value
                        );
                        form.setFieldValue("currency", currency || undefined);
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                    <NumberInput
                      label="Budget*"
                      leftSection={
                        <Text size="md" fw={500} c="dimmed" mx="sm">
                          {form.values.currency
                            ? form.values.currency.symbol
                            : "TZS"}
                        </Text>
                      }
                      placeholder="e.g 100000"
                      min={0}
                      size="md"
                      radius={"md"}
                      thousandSeparator=","
                      {...form.getInputProps("budget")}
                    />
                  </Grid.Col>
                </Grid>
                <Space h="md" />
                {/* <Flex justify="space-between" align="flex-start">
                  <Select
                    label="Budget Type*"
                    placeholder="Budget Type"
                    data={["Fixed", "Range"]}
                    {...form.getInputProps("budgetType")}
                    w={"20%"}
                  />
                  <NumberInput
                    size="md"
                    radius={"md"}
                    label={
                      form.values.budgetType === "Range"
                        ? "Min Budget*"
                        : "Budget*"
                    }
                    thousandSeparator=","
                    {...form.getInputProps("budget")}
                    w={form.values.budgetType === "Range" ? "38%" : "78%"}
                    min={0}
                  />
                  {form.values.budgetType === "Range" && (
                    <NumberInput
                      size="md"
                      radius={"md"}
                      label="Max Budget*"
                      thousandSeparator=","
                      {...form.getInputProps("maxBudget")}
                      w={"38%"}
                      min={0}
                    />
                  )}
                </Flex> */}
                <Space h="md" />
                <Switch
                  {...form.getInputProps("hasBidding")}
                  label="Allow bidding"
                />
                <Space h="md" />

                {form.values.hasBidding && (
                  <>
                    <Select
                      label="Select Bidding Type*"
                      placeholder="Bidding Type"
                      data={[{ value: "open", label: "Public" }, { value: "closed", label: "Private" }]}
                      {...form.getInputProps("biddingType")}
                    />
                    <Space h="md" />
                  </>
                )}
                <SimpleGrid cols={{ base: 1, md: 2 }} >
                  <Select
                    label="Job Type*"
                    placeholder="Select your Type"
                    data={commitmentTypes.map((item) => item.type)}
                    {...form.getInputProps("commitment")}
                  />
                  <Select
                    label="Work Locations*"
                    placeholder="Select your Location"
                    value={form.values.workLocation}
                    data={workLocations.map((item) => item.location)}
                    {...form.getInputProps("workLocation")}
                  />
                </SimpleGrid>

                <Space h="md" />
                {/* <RichTextInput
                  label="Job Description"
                  setContent={form.setFieldValue}
                  path={"description"}
                  content={form.values.description}
                  errors={form.errors.description}
                /> */}
                <Textarea
                  label="Job Description"
                  placeholder="Whats your job?"
                  {...form.getInputProps("description")}
                  autosize
                  minRows={4}
                  maxRows={8}
                />

                {/* <Space h="md" />

                {files.length == 0 ? (
                  <Dropzone
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                    onDrop={(files) => {
                      setFiles((prev) => [...prev, ...files]);
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
                    bg={"#F2F5F980"}
                    style={{
                      border: "dashed 2px #1361E366",
                      borderRadius: "10px",
                    }}
                  >
                    <Group
                      gap="xl"
                      mih={50}
                      justify="center"
                      style={{ pointerEvents: "none" }}
                    >
                      <div>
                        <Dropzone.Accept>
                          <LuImageUp />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IoMdClose size={40} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <Center>
                            <LuImageUp size={30} />
                          </Center>
                        </Dropzone.Idle>
                        <Space h="md" />
                        <Text
                          size="14px"
                          fw={600}
                          inline
                          c={Color.Text4}
                          ta={"center"}
                        >
                          Drag & Drop or{" "}
                          <span style={{ color: Color.PrimaryBlue }}>
                            choose
                          </span>{" "}
                          image to upload
                        </Text>
                        <Center my={"xs"}>
                          <Button variant="filled" size="sm" radius="md">
                            Upload
                          </Button>
                        </Center>
                        <Text
                          size="11px"
                          fw={400}
                          c={"#7987AE"}
                          inline
                          mt={7}
                          ta={"center"}
                        >
                          JPG, PNG.
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                ) : (
                  <Group wrap="nowrap">
                    <Carousel
                      w={"75%"}
                      h={150}
                      slideSize="200px"
                      slideGap="sm"
                      align="start"
                      slidesToScroll={1}
                      withControls
                      withIndicators
                      controlSize={20}
                      loop
                      styles={{
                        control: {
                          backgroundColor: "#1361E366",
                          color: "white",
                        },
                        indicator: {
                          backgroundColor: Color.PrimaryBlue,
                        },
                      }}
                    >
                      {files.map((file, index) => (
                        <Carousel.Slide key={index}>
                          <Image
                            radius="md"
                            h={150}
                            w={200}
                            fit="cover"
                            src={URL.createObjectURL(file)}
                            style={{ objectFit: "cover" }}
                          />
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                    <Dropzone
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                      onDrop={(files) => {
                        setFiles((prev) => [...prev, ...files]);
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
                      bg={"#F2F5F980"}
                      style={{
                        border: "dashed 2px #1361E366",
                        borderRadius: "10px",
                      }}
                      h={150}
                      w="25%"
                    >
                      <Group
                        gap="xl"
                        mih={50}
                        justify="center"
                        style={{ pointerEvents: "none" }}
                      >
                        <div>
                          <Dropzone.Accept>
                            <Center>
                              <LuImageUp size={20} />
                            </Center>
                          </Dropzone.Accept>
                          <Dropzone.Reject>
                            <IoMdClose size={40} />
                          </Dropzone.Reject>
                          <Dropzone.Idle>
                            <Center>
                              <LuImageUp size={20} />
                            </Center>
                          </Dropzone.Idle>
                          <Space h="xs" />
                          <Text
                            size="12px"
                            fw={600}
                            inline
                            c={Color.Text4}
                            ta={"center"}
                          >
                            Drag & Drop or{" "}
                            <span style={{ color: Color.PrimaryBlue }}>
                              choose
                            </span>{" "}
                            image to upload
                          </Text>
                          <Center my={"xs"}>
                            <Button variant="filled" size="xs" radius="md">
                              + Upload
                            </Button>
                          </Center>
                          <Text
                            size="10px"
                            fw={400}
                            c={"#7987AE"}
                            inline
                            mt={7}
                            ta={"center"}
                          >
                            JPG, PNG.
                          </Text>
                        </div>
                      </Group>
                    </Dropzone>
                  </Group>
                )} */}
                <Space h="md" />
                <Group>
                  <Button
                    size="md"
                    variant="filled"
                    radius={"md"}
                    color={"grey"}
                    fw={600}
                    onClick={() => {
                      prevStep();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    size="md"
                    variant="filled"
                    radius={"md"}
                    color={Color.DarkBlue}
                    fw={600}
                    type="submit"
                    disabled={submitted}
                    loading={submitted}
                  >
                    Submit
                  </Button>
                </Group>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </form>
    </LoadScript>
  );
}
