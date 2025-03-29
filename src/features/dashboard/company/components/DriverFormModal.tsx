import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Space,
  Switch,
  Text,
  TextInput
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IoMdClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { Color } from "../../../../common/theme";
import { IUserResponse } from "../../../auth/types";
import { useCompanyServices } from "../services";
import { IDriver, IDriverForm, IDriverVehicle } from "../types";
interface Props {
  fetchData: () => void;
  fetchDrivers: (page: number) => void;
  switchTab?: () => void;
  update?: boolean;
  driver?: IDriver;
  vehicles: IDriverVehicle[];
}

export default function DriverFormModal({ fetchData, fetchDrivers, switchTab, update, driver, vehicles }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthUser<IUserResponse>();

  const { postDriver, updateDriver } = useCompanyServices();
  const form = useForm<IDriverForm>({
    initialValues: {
      full_name: "",
      phone_number: "",
      nida_no: "",
      driver_license: "",
      truck_id: "",
      owner_id: "",
      profile_img: null,
      driver_license_img: null,
      nida_img: null,
      is_active: false,
    },

    validate: {
      full_name: isNotEmpty("Full Name is required"),
      phone_number: (value) => value.trim().length == 0 ? "Phone number required" : value.trim().length < 10 ? "Phone number must be atleast 10 digits" : null,
      nida_no: isNotEmpty("Nida No is required"),
      driver_license: isNotEmpty("Driver License is required"),
      // truck_id: isNotEmpty("Truck is required"),
      ...!update && {
        profile_img: (value) => (value == null ? "Profile image required" : null),
        driver_license_img: (value) =>
          value == null ? "Driver License image required" : null,
        nida_img: (value) => (value == null ? "Nida image required" : null),

      }

    },
  });

  const createAction = () => {
    setIsLoading(true);

    postDriver(form.values)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        fetchDrivers(1);
        form.reset();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Vehicle successfuly added",
        });
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
  const updateAction = () => {
    setIsLoading(true);

    updateDriver(form.values, driver?.id!)
      .then((_response) => {
        setIsLoading(false);
        fetchData();
        fetchDrivers(1);
        close();
        form.reset();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Vehicle successfuly updated",
        });
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


  const setValues = () => {

    const values = {
      is_active: driver?.is_active ?? false,
      full_name: driver?.full_name ?? "",
      phone_number: driver?.phone_number ?? "",
      nida_no: driver?.information.nida_no ?? "",
      driver_license: driver?.information.driver_license ?? "",
      truck_id: driver?.current_vehicle != null ? driver?.current_vehicle.id : "",
    };
    form.setValues(values);
  };

  useEffect(() => {
    if (update == true) {
      setValues();
    }
    authUser?.owner ? form.setValues({ owner_id: authUser.owner.id }) : null;
  }, []);

  return (
    <>
      <Modal
        size={"xl"}
        opened={opened}
        onClose={() => {
          close();
          if (update != true) {
          form.reset();}
        }}
        centered
        title={
          <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
            {update ? "Update Driver" : "Add Driver"}
          </Text>
        }
      >
        <form
          onSubmit={form.onSubmit(() => {
            update ? updateAction() : createAction();
          })}
        >
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
            <TextInput
              label="Nida No"
              placeholder="Enter Nida No"
              key={form.key("nida_no")}
              {...form.getInputProps("nida_no")}
              error={form.errors.nida_no}
            />
            <TextInput
              label="Driver License"
              placeholder="Enter Driver License"
              key={form.key("driver_license")}
              {...form.getInputProps("driver_license")}
              error={form.errors.driver_license}
            />
          </SimpleGrid>
          <Space h="md" />


          {update &&
            <>
              <Select
                label="Assign Truck"
                placeholder="Select Truck"
                searchable
                clearable
                value={form.values.truck_id}
                data={[
                  ...vehicles
                    .filter((item) => !update || item.id !== driver?.current_vehicle?.id)
                    .map((item) => ({
                      value: item.id,
                      label: `${item.plate_no} ${item.make} ${item.model}`,
                    })),
                  ...(update && driver?.current_vehicle
                    ? [
                        {
                          value: driver.current_vehicle.id,
                          label: `${driver.current_vehicle.plate_no} ${driver.current_vehicle.make} ${driver.current_vehicle.model}`,
                        },
                      ]
                    : []),
                ]}
                onChange={(value) => {
                  form.setValues({
                    truck_id: value ?? "",
                  });
                }}
                error={form.errors.truck_id}
              />
              <Space h="md" />
              <Switch
                checked={form.values.is_active}
                onChange={(event) => {
                  form.setValues({ is_active: event.currentTarget.checked });
                }}
                label="Is active"
                size="md"
              />
            </>
          }
          <Space h="md" />

          <SimpleGrid cols={3}>
            <div>
              <Text c="" size="xs" fw={600} mb={5}>
                Driving License Image
              </Text>


              <Dropzone
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,

                ]}
                onDrop={(files) => {
                  if (files.length > 0) {
                    form.setValues({
                      driver_license_img: files[0] ?? null,
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
                  wrap="nowrap"
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


                    {form.values.driver_license_img ? (

                      <Avatar src={URL.createObjectURL(form.values.driver_license_img)} color="white" size={'56px'} />
                    ) : driver?.information.driver_license_img && update && !form.values.driver_license_img ?

                      < Avatar src={driver?.information.driver_license_img} color="white" size={'56px'} /> :
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
                    >
                      Drop your file here or browse
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              <Text c="red" size="xs" mt={5}>
                {form.errors.driver_license_img}
              </Text>
            </div>
            <div>
              <Text c="" size="xs" fw={600} mb={5}>
                Nida Image
              </Text>

              <Dropzone
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,

                ]}
                onDrop={(files) => {
                  if (files.length > 0) {
                    form.setValues({
                      nida_img: files[0] ?? null,
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
                  wrap="nowrap"
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
                    {form.values.nida_img ? (

                      <Avatar src={URL.createObjectURL(form.values.nida_img)} color="white" size={'56px'} />
                    ) : driver?.information.nida_img && update && !form.values.nida_img ?

                      < Avatar src={driver?.information.nida_img} color="white" size={'56px'} /> :
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
                    >
                      Drop your file here or browse
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              <Text c="red" size="xs" mt={5}>
                {form.errors.nida_img}
              </Text>
            </div>
            <div>
              <Text c="" size="xs" fw={600} mb={5}>
                Profile Image
              </Text>

              <Dropzone
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,

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
                  wrap="nowrap"
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
                    ) : driver?.profile_img && update && !form.values.profile_img ?

                      < Avatar src={driver?.profile_img} color="white" size={'56px'} /> :
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
                    >
                      Drop your file here or browse
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              <Text c="red" size="xs" mt={5}>
                {form.errors.profile_img}
              </Text>
            </div>
          </SimpleGrid>
          <Space h="md" />

          <Button
            type="submit"
            color={Color.PrimaryBlue}
            loading={isLoading}
            disabled={isLoading}
            onClick={() => {
              // console.log(form.errors);
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>

      {update ? <ActionIcon variant="default" onClick={open} radius="md">
        <MdEdit color={Color.TextSecondary2} />
      </ActionIcon> :
        <Button
          variant="filled"
          onClick={() => {
            open();
            switchTab ? switchTab() : null;
          }}
        >
          Add Driver
        </Button>}
    </>
  );
}
