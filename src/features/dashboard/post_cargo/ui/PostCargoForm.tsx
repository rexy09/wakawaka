import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stepper,
  Table,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdRemoveCircleOutline } from "react-icons/io";
import { CountrySelector, usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useNavigate } from "react-router-dom";
import { CustomTable } from "../../../../common/components/Table/CustomTable";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useUtilities } from "../../../hooks/utils";
import GooglePlacesAutocompleteDelivery from "../components/GooglePlacesAutocompleteDelivery";
import GooglePlacesAutocompletePickup from "../components/GooglePlacesAutocompletePickup";
import RouteConfirmation from "../components/RouteConfirmation";
import { usePostCargoServices } from "../services";
import {
  formatPositionToJson,
  ICargoDimension,
  ICargoPackageSize,
  ICargoPackageType,
  IPostCargoForm,
  Position,
} from "../types";

export function PostCargoForm() {
  const [cargoPackageTypes, setCargoPackageTypes] = useState<
    ICargoPackageType[]
  >([]);
  const [cargoPackageSize, setCargoPackageSize] = useState<ICargoPackageSize[]>(
    []
  );
  const [cargoDimensions, setCargoDimension] = useState<ICargoDimension[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { getPackageTypes, getCargoDimensions, getPackageSize, postCargo } =
    usePostCargoServices();
  const { getFormattedDate } = useUtilities();
  const [_isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchData = () => {
    setIsLoading(true);
    getPackageTypes()
      .then((response) => {
        setIsLoading(false);
        setCargoPackageTypes(response.data.results);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });

    getCargoDimensions()
      .then((response) => {
        setIsLoading(false);
        setCargoDimension(response.data.results);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getPackageSize()
      .then((response) => {
        setIsLoading(false);
        setCargoPackageSize(response.data.results);
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

  const handleFinalSubmit = (values: IPostCargoForm) => {
    setIsSubmitting(true);

    postCargo({ d: values, files })
      .then((_response) => {
        setIsSubmitting(false);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Cargo posted successfully",
        });
        navigate("/");
      })
      .catch((_error) => {
        setIsSubmitting(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong! failed to post cargo",
        });
      });
  };

  const [active, setActive] = useState(0);

  const form = useForm<IPostCargoForm>({
    initialValues: {
      category: "",
      senderName: "",
      senderPhoneCountry: "",
      senderPhone: "",
      senderPickupLocation: "",
      senderPickupLocationData: "",
      senderPickupDescription: "",
      receiverName: "",
      receiverPhoneCountry: "",
      receiverPhone: "",
      deliveryDate: "",
      deliveryDateValue: null,
      receiverDeliveryLocation: "",
      receiverDeliveryLocationData: "",
      receiverDeliveryDescription: "",
      numberOfPackages: 1,
      packageSize: "",
      packageDimensions: "",
      packageType: "",
      isHazardous: false,
      isStackable: false,
      isFastLoad: false,
      selectedVehicle: "",
      distance: 0,
      duration: 0,
    },

    validate: (values) => {
      // return {};

      if (active === 0) {
        return {
          category:
            values.category.trim().length == 0 ? "Cargo type required" : null,
          senderName:
            values.senderName.trim().length == 0
              ? "Consignor name required"
              : null,
          senderPhone:
            values.senderPhone.trim().length == 0
              ? "Phone number required"
              : values.senderPhone.trim().length < 9
                ? "Phone number must be atleast 9 digits"
                : null,
          senderPickupLocation:
            values.senderPickupLocation.trim().length == 0
              ? "Pickup location required"
              : null,
          senderPickupDescription:
            values.senderPickupDescription.trim().length == 0
              ? "Notes required"
              : null,
        };
      }
      if (active === 1) {
        return {
          receiverName:
            values.receiverName.trim().length == 0
              ? "Consignee required"
              : null,
          receiverPhone:
            values.receiverPhone.trim().length == 0
              ? "Phone number required"
              : values.senderPhone.trim().length < 9
                ? "Phone number must be atleast 9 digits"
                : null,
          receiverDeliveryLocation:
            values.receiverDeliveryLocation.trim().length == 0
              ? "Delivery location required"
              : null,
          deliveryDate:
            values.deliveryDate.trim().length == 0
              ? "Delivery date required"
              : null,
          receiverDeliveryDescription:
            values.receiverDeliveryDescription.trim().length == 0
              ? "Notes required"
              : null,
        };
      }
      if (active === 2) {
        return {
          numberOfPackages:
            values.numberOfPackages < 0 ? "Number of package required" : null,
          packageSize:
            values.packageSize.trim().length == 0 ? "Weight required" : null,
          packageDimensions:
            values.packageDimensions.trim().length == 0
              ? "Dimensions required"
              : null,
          packageType:
            values.packageType.trim().length == 0
              ? "Package Type required"
              : null,
        };
      }

      return {};
    },
  });
  const senderPhoneInput = usePhoneInput({
    defaultCountry: "tz",
    value: form.values.senderPhoneCountry,
    onChange: (data) => {
      form.setFieldValue("senderPhoneCountry", data.phone.replace(/^\+/, ""));
    },
  });
  const receiverPhoneInput = usePhoneInput({
    defaultCountry: "tz",
    value: form.values.receiverPhoneCountry,
    onChange: (data) => {
      form.setFieldValue("receiverPhoneCountry", data.phone.replace(/^\+/, ""));
    },
  });

  const nextStep = () => {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 5 ? current + 1 : current;
    });
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const rows = files.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          size={"md"}
          color="red"
          onClick={() => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <IoMdRemoveCircleOutline size={20} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <div>
      <Group justify="space-between">
        <Text size="18px" fw={500}>
          Post New Cargo
        </Text>
      </Group>
      <Space h="md" />
      <form>
        <Paper p="md" radius="10px" style={{ border: "2px solid #1A2F570F" }}>
          <Stepper active={active}>
            <Stepper.Step label="Consignor Details">
              <SimpleGrid cols={3}>
                <Select
                  label="Cargo Type"
                  data={[
                    { value: "transit", label: "Transit" },
                    { value: "local", label: "Local" },
                  ]}
                  {...form.getInputProps("category")}
                />
                <TextInput
                  label="Consignor Name"
                  placeholder="Enter Consignor's name"
                  {...form.getInputProps("senderName")}
                />
                <div>
                  <Text
                    size="md"
                    fw={500}
                  >
                    Phone Number
                  </Text>

                  <Grid grow>
                    <Grid.Col span="auto" pr="0px">
                      <CountrySelector
                        selectedCountry={senderPhoneInput.country.iso2}
                        onSelect={(country) => senderPhoneInput.setCountry(country.iso2)}
                        renderButtonWrapper={({ children, rootProps }) => (
                          <Button
                            {...rootProps}
                            variant="outline"
                            color="#CED4DA"
                            px="4px"
                            mr="8px"
                            radius="md"
                            size="md"
                          >
                            {children}
                          </Button>
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 8, md: 9, lg: 9 }} pl="0px">
                      <TextInput
                        withAsterisk
                        placeholder="789654321"
                        radius="md"
                        leftSection={
                          <Text c="black" size="md" mt={'2px'}>
                            {senderPhoneInput.phone}
                          </Text>
                        }
                        leftSectionWidth={50}
                        error={form.errors.senderPhone}
                        value={form.values.senderPhone}
                        onChange={(phone) =>
                          form.setFieldValue(
                            "senderPhone",
                            phone.target.value.replace(/^0+/, "").replace(/\D/g, "")
                          )
                        }
                        onBlur={() => {
                          const isValidInput = /^\d*$/.test(form.values.senderPhone);
                          if (!isValidInput) {
                            form.setFieldError("senderPhone", "Invalid phone number");
                          }
                        }}
                      />
                    </Grid.Col>
                  </Grid>
                </div>
                {/* <TextInput
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  {...form.getInputProps("senderPhone")}
                /> */}
              </SimpleGrid>
              <Space h="sm" />
              <GooglePlacesAutocompletePickup
                label="Pickup Location"
                location={form.values.senderPickupLocation}
                error={form.errors.senderPickupLocation}
                onSelect={(locationDataString) => {
                  const position: Position = {
                    latitude: locationDataString.latitude,
                    longitude: locationDataString.longitude,
                    heading: undefined,
                    altitude: undefined,
                  };
                  const locationJoiner = ", ";
                  const locationData = formatPositionToJson(
                    position,
                    locationDataString.name +
                    locationJoiner +
                    locationDataString.formatted_address
                  );

                  if (
                    JSON.parse(locationData).senderLocation != locationJoiner
                  ) {
                    form.setValues({
                      senderPickupLocation:
                        JSON.parse(locationData).senderLocation,
                      senderPickupLocationData: locationData,
                    });
                  } else {
                    form.setValues({
                      senderPickupLocation: "",
                      senderPickupLocationData: "",
                    });
                  }
                }}
              />

              <Space h="sm" />

              <Textarea
                label="Additional Notes"
                placeholder="Additional cargo details"
                {...form.getInputProps("senderPickupDescription")}
              />
            </Stepper.Step>

            <Stepper.Step label="Consignee Details">
              <SimpleGrid cols={3}>
                <TextInput
                  label="Consignee Name"
                  placeholder="Enter Consignee's name"
                  {...form.getInputProps("receiverName")}
                />
                <div>
                  <Text
                    size="md"
                    fw={500}
                  >
                    Phone Number
                  </Text>
                  <Grid grow>
                    <Grid.Col span="auto" pr="0px">
                      <CountrySelector
                        selectedCountry={receiverPhoneInput.country.iso2}
                        onSelect={(country) => receiverPhoneInput.setCountry(country.iso2)}
                        renderButtonWrapper={({ children, rootProps }) => (
                          <Button
                            {...rootProps}
                            variant="outline"
                            color="#CED4DA"
                            px="4px"
                            mr="8px"
                            radius="md"
                            size="md"
                          >
                            {children}
                          </Button>
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 8, md: 9, lg: 9 }} pl="0px">
                      <TextInput
                        withAsterisk
                        placeholder="789654321"
                        radius="md"
                        leftSection={
                          <Text c="black" size="md" mt={'2px'}>
                            {receiverPhoneInput.phone}
                          </Text>
                        }
                        leftSectionWidth={50}
                        error={form.errors.receiverPhone}
                        value={form.values.receiverPhone}
                        onChange={(phone) =>
                          form.setFieldValue(
                            "receiverPhone",
                            phone.target.value.replace(/^0+/, "").replace(/\D/g, "")
                          )
                        }
                        onBlur={() => {
                          const isValidInput = /^\d*$/.test(form.values.receiverPhone);
                          if (!isValidInput) {
                            form.setFieldError("receiverPhone", "Invalid phone number");
                          }
                        }}
                      />
                    </Grid.Col>
                  </Grid>
                </div>
                {/* <TextInput
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  {...form.getInputProps("receiverPhone")}
                /> */}
                <DateInput
                  label="Expected Delivery Date"
                  placeholder="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  value={form.values.deliveryDateValue}
                  onChange={(value) => {
                    form.setValues({
                      deliveryDate: getFormattedDate(value),
                      deliveryDateValue: value ?? null,
                    });
                  }}
                  error={form.errors.deliveryDate}
                  clearable
                />
              </SimpleGrid>
              <Space h="sm" />
              <GooglePlacesAutocompleteDelivery
                label="Delivery Location"
                location={form.values.receiverDeliveryLocation}
                error={form.errors.receiverDeliveryLocation}
                onSelect={(locationDataString) => {
                  const position: Position = {
                    latitude: locationDataString.latitude,
                    longitude: locationDataString.longitude,
                    heading: undefined,
                    altitude: undefined,
                  };
                  const locationJoiner = ", ";
                  const locationData = formatPositionToJson(
                    position,
                    undefined,
                    locationDataString.name +
                    locationJoiner +
                    locationDataString.formatted_address
                  );

                  if (
                    JSON.parse(locationData).receiverLocation != locationJoiner
                  ) {
                    form.setValues({
                      receiverDeliveryLocation:
                        JSON.parse(locationData).receiverLocation,
                      receiverDeliveryLocationData: locationData,
                    });
                  } else {
                    form.setValues({
                      receiverDeliveryLocation: "",
                      receiverDeliveryLocationData: "",
                    });
                  }
                }}
              />

              <Space h="sm" />

              <Textarea
                label="Additional Notes"
                placeholder="Additional cargo details"
                {...form.getInputProps("receiverDeliveryDescription")}
              />
            </Stepper.Step>

            <Stepper.Step label="Package Details">
              <SimpleGrid cols={2}>
                <NumberInput
                  label="Number of Packages"
                  placeholder="Enter number of Packages"
                  min={1}
                  {...form.getInputProps("numberOfPackages")}
                />
                <Select
                  label="Weight"
                  placeholder="Weight"
                  searchable
                  clearable
                  value={form.values.packageSize}
                  data={[
                    ...cargoPackageSize.map((item) => ({
                      value: item.id,
                      label: item.description,
                    })),
                  ]}
                  onChange={(value) => {
                    form.setValues({
                      packageSize: value ?? "",
                    });
                  }}
                  error={form.errors.packageSize}
                />
                <Select
                  label="Dimensions"
                  placeholder="Dimensions"
                  searchable
                  clearable
                  value={form.values.packageDimensions}
                  data={[
                    ...cargoDimensions.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                  onChange={(value) => {
                    form.setValues({
                      packageDimensions: value ?? "",
                    });
                  }}
                  error={form.errors.packageDimensions}
                />
                <Select
                  label="Package Type"
                  placeholder="Package Type"
                  searchable
                  clearable
                  value={form.values.packageType}
                  data={[
                    ...cargoPackageTypes.map((item) => ({
                      value: item.id,
                      label: item.type,
                    })),
                  ]}
                  onChange={(value) => {
                    form.setValues({
                      packageType: value ?? "",
                    });
                  }}
                  error={form.errors.packageType}
                />
              </SimpleGrid>
              <Space h="md" />
              <Group>
                <Checkbox
                  label="Hazardous"
                  {...form.getInputProps("isHazardous")}
                  checked={form.values.isHazardous}
                />
                <Checkbox
                  label="Stackable"
                  {...form.getInputProps("isStackable")}
                  checked={form.values.isStackable}
                />
                <Checkbox
                  label="Fast Load"
                  {...form.getInputProps("isFastLoad")}
                  checked={form.values.isFastLoad}
                />
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Documents">
              <Dropzone
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.pdf,
                  MIME_TYPES.doc,
                  MIME_TYPES.docx,
                  MIME_TYPES.ppt,
                  MIME_TYPES.pptx,
                  MIME_TYPES.xls,
                  MIME_TYPES.xlsx,
                  MIME_TYPES.csv,
                ]}
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
                bg={'#F2F5F980'}
                style={{ border: "dashed 2px #1361E366", borderRadius: "10px" }}
              >
                <Group
                  gap="xl"
                  mih={50}
                  justify="center"
                  style={{ pointerEvents: "none" }}
                >

                  <div>
                    <Dropzone.Accept>
                      {Icons.paper_upload}
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IoMdClose size={40} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      {Icons.paper_upload}
                    </Dropzone.Idle>
                    <Space h="md" />
                    <Text size="14px" fw={600} inline c={Color.Text4} ta={"center"}>
                      Drag & Drop or <span style={{ color: Color.PrimaryBlue }}>choose</span> file to upload
                    </Text>
                    <Center my={'xs'}>
                      <Button variant="filled" size="lg" radius="md">Upload</Button>
                    </Center>
                    <Text
                      size="11px"
                      fw={400}
                      c={"#7987AE"}
                      inline
                      mt={7}
                      ta={"center"}
                    >
                      PDF, DOCX, JPG, PNG, XLSX.
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Space h="sm" />
              <CustomTable
                title="Documents"
                rows={rows}
                colSpan={3}
                columns={
                  <Table.Tr style={{ border: "none" }}>
                    <Table.Th
                      w={100}
                      style={{
                        borderRadius: "10px 0px 0px 10px",
                      }}
                    >
                      No.
                    </Table.Th>
                    <Table.Th>File</Table.Th>
                    <Table.Th
                      w={200}
                      style={{
                        borderRadius: "0px 10px 10px 0px",
                      }}
                    >
                      Action
                    </Table.Th>
                  </Table.Tr>
                }
                totalData={rows.length}
                isLoading={false}
              />
            </Stepper.Step>
            <Stepper.Step label="Review and Submit">
              <Space h="md" />
              <div>
                <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                  Consignor Details
                </Text>
                <Space h="xs" />
                <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
                  <div>
                    <SimpleGrid cols={3}>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Consignor Name
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          {form.values.senderName}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Phone Number
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {"+" + form.values.senderPhoneCountry + form.values.senderPhone}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Pickup Location
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.senderPickupLocation}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Notes
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.senderPickupDescription}
                        </Text>
                      </div>
                    </SimpleGrid>
                  </div>
                </Paper>
              </div>
              <Space h="xl" />

              <div>
                <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                  Consignee Details
                </Text>
                <Space h="xs" />

                <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
                  <div>
                    <SimpleGrid cols={3}>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Consignee Name
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.receiverName}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Phone Number
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {"+" + form.values.receiverPhoneCountry + form.values.receiverPhone}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Expected Delivery Date
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.deliveryDate}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Delivery Location
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.receiverDeliveryLocation}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Notes
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.receiverDeliveryDescription}
                        </Text>
                      </div>
                    </SimpleGrid>
                  </div>
                </Paper>
              </div>
              <Space h="xl" />

              <div>
                <Text size="18px" fw={700} c={Color.TextTitle3} mb={"xs"}>
                  Package Details
                </Text>
                <Space h="xs" />

                <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
                  <div>
                    <SimpleGrid cols={3}>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Category
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.category}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Number of Packages
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {form.values.numberOfPackages}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Weight
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {cargoPackageSize
                            .filter(
                              (item) => item.id === form.values.packageSize
                            )
                            .map((item) => item.description)}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Dimensions
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {cargoDimensions
                            .filter(
                              (item) =>
                                item.id === form.values.packageDimensions
                            )
                            .map((item) => item.name)}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Package Type
                        </Text>
                        <Text size="18px" fw={500} c={Color.Text3}>
                          {cargoPackageTypes
                            .filter(
                              (item) => item.id === form.values.packageType
                            )
                            .map((item) => item.type)}
                        </Text>
                      </div>
                      <div>
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Properties
                        </Text>

                        <Group gap="sm">
                          {form.values.isHazardous ? (
                            <Text size="18px" fw={500} c={Color.Text3}>
                              Hazardous
                            </Text>
                          ) : null}
                          {form.values.isStackable ? (
                            <Text size="18px" fw={500} c={Color.Text3}>
                              Stackable
                            </Text>
                          ) : null}
                          {form.values.isFastLoad ? (
                            <Text size="18px" fw={500} c={Color.Text3}>
                              Fast Load
                            </Text>
                          ) : null}
                        </Group>
                      </div>
                    </SimpleGrid>
                  </div>
                </Paper>
              </div>
              <Space h="xl" />

              <CustomTable
                title="Documents"
                rows={rows}
                colSpan={3}
                columns={
                  <Table.Tr style={{ border: "none" }}>
                    <Table.Th
                      w={100}
                      style={{
                        borderRadius: "10px 0px 0px 10px",
                      }}
                    >
                      No.
                    </Table.Th>
                    <Table.Th>File</Table.Th>
                    <Table.Th
                      w={200}
                      style={{
                        borderRadius: "0px 10px 10px 0px",
                      }}
                    >
                      Action
                    </Table.Th>
                  </Table.Tr>
                }
                totalData={rows.length}
                isLoading={false}
              />
            </Stepper.Step>
            <Stepper.Completed>
              <RouteConfirmation
                origin={form.values.senderPickupLocationData}
                destination={form.values.receiverDeliveryLocationData}
                onConfirm={(vehicleType, distance, duration) => {
                  const updatedValues = {
                    ...form.values,
                    selectedVehicle: vehicleType,
                    distance: parseFloat(distance),
                    duration: parseFloat(duration),
                  };

                  form.setValues(updatedValues);

                  handleFinalSubmit(updatedValues);
                }}
                no_of_packages={form.values.numberOfPackages}
                orderType={form.values.packageType}
                orderSize={form.values.packageSize}
                isSubmitting={isSubmitting}
              />

              {/*  Completed! Form values:
              <Code block mt="xl">
                {JSON.stringify(form.getValues(), null, 2)}
              </Code> */}
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active !== 5 && <Button onClick={nextStep}>Next</Button>}
          </Group>
        </Paper>
      </form>
      <Space h="md" />
    </div>
  );
}
