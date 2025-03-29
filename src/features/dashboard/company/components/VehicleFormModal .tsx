import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { Color } from "../../../../common/theme";
import { useCompanyServices } from "../services";
import {
  IDriverVehicle,
  IVehicle,
  IVehicleBodyType,
  IVehicleForm,
  IVehicleMake,
  IVehicleModel,
} from "../types";
import { useSearchParams } from "react-router-dom";
interface Props {
  fetchData: (page: number) => void;
  switchTab?: () => void;
  update?: boolean;
  truck?: IDriverVehicle;
  vehicles: IVehicle[];
  vehicleMake: IVehicleMake[];
  vehicleModels: IVehicleModel[];
  vehicleBodyTypes: IVehicleBodyType[];
}

export default function VehicleFormModal({
  fetchData,
  switchTab,
  update,
  truck,
  vehicles,
  vehicleMake,
  vehicleModels,
  vehicleBodyTypes,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { postVehicle, updateVehicle } = useCompanyServices();
  const form = useForm<IVehicleForm>({
    initialValues: {
      vehicle: "",
      make: "",
      model: "",
      body_type: "",
      plate_no: "",
      vehicle_img: null,
    },

    validate: {
      vehicle: isNotEmpty("Vehicle is required"),
      make: isNotEmpty("Make is required"),
      model: isNotEmpty("Model is required"),
      body_type: isNotEmpty("Body Type is required"),
      plate_no: isNotEmpty("Plate No is required"),
      ...!update && {
        vehicle_img: (value) => (value == null ? "Vehicle image required" : null),
      }
    },
  });

  const createAction = () => {
    setIsLoading(true);

    postVehicle(form.values)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData(1);
        searchParams.delete('page');
        setSearchParams(searchParams);
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
  const udateAction = () => {
    setIsLoading(true);

    updateVehicle(form.values, truck?.id!)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData(1);
        searchParams.delete('page');
        setSearchParams(searchParams);
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
      vehicle: truck?.vehicle.id ?? "",
      make: vehicleMake.find((item) => item.name == truck?.make)?.id ?? "",
      model: vehicleModels.find((item) => item.name == truck?.model)?.id ?? "",
      body_type: vehicleBodyTypes.find((item) => item.name == truck?.body_type)?.id ?? "",
      plate_no: truck?.plate_no ?? "",
    };
    form.setValues(values);
  };

  useEffect(() => {
    if (update == true) {
      setValues();
    }
  }, []);

  return (
    <>
      <Modal
        size={"lg"}
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        centered
        title={
          <Text size="16px" fw={700} c={Color.TextTitle3} mb={"xs"}>
            {update ? "Update Trucks" : "Add Trucks"}
          </Text>
        }
      >
        <form
          onSubmit={form.onSubmit(() => {
            update ? udateAction() :
              createAction();
          })}
        >
          <TextInput
            label="Plate No"
            placeholder="Enter Plate No"
            key={form.key("plate_no")}
            {...form.getInputProps("plate_no")}
            error={form.errors.plate_no}
          />
          <Space h="md" />
          <Select
            label="Vehicle"
            placeholder="Select Vehicle"
            searchable
            clearable
            value={form.values.vehicle}
            data={[
              ...vehicles.map((item) => ({
                value: item.id,
                label: item.vehicle_type,
              })),
            ]}
            onChange={(value) => {
              form.setValues({
                vehicle: value ?? "",
              });
            }}
            error={form.errors.vehicle}
          />
          <Space h="md" />
          <Select
            label="Make"
            placeholder="Select Make"
            searchable
            clearable
            value={form.values.make}
            data={[
              ...vehicleMake.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onChange={(value) => {
              form.setValues({
                make: value ?? "",
              });
            }}
            error={form.errors.make}
          />
          <Space h="md" />
          <Select
            label="Model"
            placeholder="Select Model"
            searchable
            clearable
            value={form.values.model}
            disabled={!form.values.make}
            data={[
              ...vehicleModels
                .filter((item) => item.make == form.values.make)
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
            ]}
            onChange={(value) => {
              form.setValues({
                model: value ?? "",
              });
            }}
            error={form.errors.model}
          />
          <Space h="md" />
          <Select
            label="Body Type"
            placeholder="Select Body Type"
            searchable
            clearable
            value={form.values.body_type}
            data={[
              ...vehicleBodyTypes.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onChange={(value) => {
              form.setValues({
                body_type: value ?? "",
              });
            }}
            error={form.errors.body_type}
          />
          <Space h="md" />

          <Dropzone
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
            onDrop={(files) => {
              if (files.length > 0) {
                form.setValues({
                  vehicle_img: files[0] ?? null,
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
            bg={"#F2F5F980"}
            style={{ border: "dashed 2px #1361E366", borderRadius: "10px" }}
          >
            <Group wrap="nowrap" mih={50} style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <LuImagePlus size={40} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IoMdClose size={40} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                {form.values.vehicle_img ? (
                  <Avatar
                    src={URL.createObjectURL(form.values.vehicle_img)}
                    color="white"
                    size={"56px"}
                  />
                ) : truck?.vehicle_img && update && !form.values.vehicle_img ? (
                  <Avatar
                    src={truck?.vehicle_img}
                    color="white"
                    size={"56px"}
                  />
                ) : (
                  <Avatar variant="filled" color="white" size={"56px"}>
                    <LuImagePlus size={24} color={Color.PrimaryBlue} />
                  </Avatar>
                )}
              </Dropzone.Idle>

              <div>
                <Text size="12px" fw={500} inline c={Color.PrimaryBlue}>
                  Upload
                </Text>
                <Text size="12px" fw={300} c={Color.PrimaryBlue} inline mt={7}>
                  Drop your file here or browse
                </Text>
              </div>
            </Group>
          </Dropzone>
          <Text c="red" size="xs" mt={5}>
            {form.errors.vehicle_img}
          </Text>
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
      {update ? (
        <ActionIcon variant="default" onClick={open} radius="md">
          <MdEdit color={Color.TextSecondary2} />
        </ActionIcon>
      ) : (
        <Button
          variant="filled"
          onClick={() => {
            open();
            switchTab ? switchTab() : null;
          }}
        >
          Add Truck
        </Button>
      )}
    </>
  );
}
