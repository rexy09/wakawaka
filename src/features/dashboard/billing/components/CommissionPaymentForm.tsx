import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Paper,
  Space,
  Text,
  TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { CountrySelector, usePhoneInput } from "react-international-phone";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useBillingServices } from "../services";
import { IBilling, ICommissionForm } from "../types";
interface Props {
  billing?: IBilling;
  fetchData: () => void;
}

export default function CommissionPaymentForm({ billing, fetchData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { postCommissionPayment } = useBillingServices();
  const form = useForm<ICommissionForm>({
    initialValues: { phone_number: "", phoneCountry: "", confim: false },

    validate: {
      phone_number: (value) =>
        value.trim().length == 0
          ? "Phone number required"
          : value.trim().length < 9
            ? "Phone number must be atleast 9 digits"
            : null,
      confim: isNotEmpty("Confim is required"),
    },
  });

  const phoneInput = usePhoneInput({
    defaultCountry: "tz",
    value: form.values.phoneCountry,
    onChange: (data) => {
      form.setFieldValue("phoneCountry", data.phone.replace(/^\+/, ""));
    },
  });
  const addPayment = () => {
    setIsLoading(true);
    if (billing) {

      postCommissionPayment(form.values, billing.id)
        .then((_response) => {
          setIsLoading(false);
          fetchData();
          form.reset();
          notifications.show({
            color: "green",
            title: "Successfuly",
            message: "Payment confirmed successfuly",
          });
        })
        .catch((error) => {
          setIsLoading(false);
          if (
            error.response.data.error &&
            typeof error?.response?.data?.error === "string"
          ) {
            notifications.show({
              color: "red",
              title: "Error",
              message: error.response.data.error,
            });
          } else {
            notifications.show({
              color: "red",
              title: "Error",
              message: "Something went wrong!",
            });
          }

        });
    }
  };
  return (
    <>
      <Paper
        p="md"
        radius="10px"
        style={{ border: "2px solid #1A2F570F" }}
      >
        <Text size="16px" fw={500} c={Color.TextTitle4}>
          Payment Section
        </Text>
        <Divider my={"md"} />
        <Group justify="space-between">
          <Text size="16px" fw={400} c={Color.TextSecondary3} mb={"xs"}>
            Amount Due
          </Text>
          <Text size="18px" c={Color.Text3} fw={500}>
            100,000
          </Text>
        </Group>
        <Space h="md" />
        <Text size="16px" fw={500} c={Color.TextSecondary3} mb={"xs"}>
          Payment Methods Available
        </Text>
        <Space h="md" />
        <Group justify="space-start">
          {Icons.creditPay}
          <Text size="14px" c={Color.TextSecondary3} fw={400}>
            Credit Pay
          </Text>
        </Group>
        <Space h="md" />
        <Group justify="space-start">
          {Icons.mobilePay}
          <Text size="14px" c={Color.TextSecondary3} fw={400}>
            Mobile Money
          </Text>
        </Group>
        <Space h="md" />
        <Group justify="space-start">
          {Icons.bankTransfer}
          <Text size="14px" c={Color.TextSecondary3} fw={400}>
            Bank Transfer
          </Text>
        </Group>
        <Space h="md" />
        <form
          onSubmit={form.onSubmit(() => {
            addPayment();
          })}
        >
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
                  selectedCountry={phoneInput.country.iso2}
                  onSelect={(country) => phoneInput.setCountry(country.iso2)}
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
                      {phoneInput.phone}
                    </Text>
                  }
                  leftSectionWidth={50}
                  error={form.errors.phone_number}
                  value={form.values.phone_number}
                  onChange={(phone) =>
                    form.setFieldValue(
                      "phone_number",
                      phone.target.value.replace(/^0+/, "").replace(/\D/g, "")
                    )
                  }
                  onBlur={() => {
                    const isValidInput = /^\d*$/.test(form.values.phone_number);
                    if (!isValidInput) {
                      form.setFieldError("phone_number", "Invalid phone number");
                    }
                  }}
                />
              </Grid.Col>
            </Grid>
          </div>
          <Space h="md" />
          <Checkbox
            {...form.getInputProps("confim")}
            label={
              "I have sent the payment"
            }
            color={Color.Green}
          />
          <Space h="md" />
          <Button
            fullWidth
            size="lg"
            radius={"md"}
            disabled={isLoading}
            loading={isLoading}
            color={Color.PrimaryBlue}
            type="submit"
          >
            Pay Now
          </Button>
        </form>
      </Paper>



    </>
  );
}
