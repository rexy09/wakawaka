import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  CopyButton,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCheckbox, IoCopyOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Color } from "../../../../common/theme";
import { getColorForStateMui } from "../../../hooks/utils";

// Import the main pdf component
import { Viewer, Worker } from "@react-pdf-viewer/core";
// Import the pdf styles
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";
import moment from "moment";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { FaCheck } from "react-icons/fa";
import Env from "../../../../config/env";
import { IUserResponse } from "../../../auth/types";
import OrderDetails from "../../bids/components/OrderDetails";
import { parseLocationFromJson } from "../../home/types";
import CommissionPaymentForm from "../components/CommissionPaymentForm";
import PaymentConfirmationModal from "../components/PaymentConfirmationModal";
import { useBillingServices } from "../services";
import {
  IBilling,
  IBillingConfirmation,
  IPaymentForm,
  PaginatedResponse,
} from "../types";
export default function BillingDetails() {
  const navigate = useNavigate();
  const authUser = useAuthUser<IUserResponse>();

  const { getBillingDetails, postBillingPayment, getBillingPayments } =
    useBillingServices();
  const { id } = useParams();
  const authHeader = useAuthHeader();
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [pdf, setPDF] = useState<any>();
  const [billing, setBilling] = useState<IBilling>();
  const [percent, setPercent] = useState<number>(1);

  const [payments, setPayments] =
    useState<PaginatedResponse<IBillingConfirmation>>();

  const form = useForm<IPaymentForm>({
    initialValues: { amount: 0, confim: false },

    validate: {
      amount: (value) =>
        value < 1 ? `Amount should be greater or equal to Tshs 1` : null,
      confim: isNotEmpty("Confim is required"),
    },
  });

  const addBillingPayment = () => {
    setIsLoading(true);
    postBillingPayment(form.values, id!)
      .then((_response) => {
        setIsLoading(false);
        close();
        fetchData();
        setPDF(undefined);
        form.reset();
        notifications.show({
          color: "green",
          title: "Successfuly",
          message: "Your payment has been added",
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
  };

  const fetchData = () => {
    setLoadingBilling(true);

    getBillingDetails(id!)
      .then((response) => {
        setLoadingBilling(false);
        setBilling(response.data);
      })
      .catch((_error) => {
        setLoadingBilling(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    getBillingPayments(id!)
      .then((response) => {
        setLoadingBilling(false);
        setPayments(response.data);
      })
      .catch((_error) => {
        setLoadingBilling(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  const getPDFData = () => {
    setIsLoading(true);
    const url = `/operation/billing_invoice/${billing?.invoice_id}/`;
    axios
      .get(Env.baseURL + url, {
        headers: {
          Authorization: authHeader,
        },
        responseType: "blob",
        onDownloadProgress: function (progressEvent) {
          setPercent(
            parseInt(
              (
                (progressEvent.loaded / (progressEvent.total ?? 1)) *
                100
              ).toFixed()
            )
          );
        },
        params: {},
      })
      .then(function (response) {
        const responseData = response.data;
        console.log(responseData);

        const blobUrl = window.URL.createObjectURL(responseData);
        console.log(blobUrl);
        setPDF(blobUrl);
        setIsLoading(false);
        setPercent(1);
      })
      .catch(function (_error) {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (billing && pdf == undefined) {
      getPDFData();
    }
  }, [billing]);

  return (
    <div>
      <Group justify="space-between">
        <Group>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoMdArrowRoundBack />
          </ActionIcon>
          <Text size="18px" fw={500}>
            Billing Details
          </Text>
        </Group>
      </Group>
      <Space h="md" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
          <Box pos="relative">
            <LoadingOverlay
              visible={loadingBilling}
              loaderProps={{ children: "Loading..." }}
            />
            <Paper
              bg={"white"}
              p={"md"}
              radius={"md"}
              style={{ border: "1px solid #1A2F570F" }}
            >
              <div>
                <Group justify="space-between">
                  <Text size="22px" fw={600} c={Color.TextTitle3} mb={"xs"}>
                    {billing?.invoice_id}
                  </Text>
                  <Badge
                    variant="light"
                    color={getColorForStateMui(billing?.status ?? "")}
                    size="sm"
                    radius="sm"
                  >
                    {billing?.status}
                  </Badge>
                </Group>
                <Text size="18px" fw={400} c={Color.TextTitle3} mb={"xs"}>
                  {moment(billing?.due_date).format("Do MMM YYYY")}
                </Text>
                <Space h="xs" />
                <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
                  <Text size="18px" fw={700} c={Color.TextTitle4} mb={"xs"}>
                    Cargo & Payment Details
                  </Text>
                  <Space h="md" />

                  <div>
                    <SimpleGrid cols={1}>
                      <Group justify="space-between">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Cargo ID
                        </Text>
                        <Group gap={0}>
                          <Text
                            size="18px"
                            tt={"uppercase"}
                            c={Color.Text3}
                            fw={500}
                          >
                            #{billing?.order.tracking_id}
                          </Text>
                          <CopyButton
                            value={billing?.order.tracking_id ?? ""}
                            timeout={2000}
                          >
                            {({ copied, copy }) => (
                              <Tooltip
                                label={copied ? "Copied" : "Copy"}
                                withArrow
                                position="right"
                              >
                                <ActionIcon
                                  color={copied ? "teal" : "gray"}
                                  variant="subtle"
                                  onClick={copy}
                                >
                                  {copied ? <FaCheck /> : <IoCopyOutline />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </Group>
                      <Group justify="space-between">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Cargo Type
                        </Text>
                        <Text
                          size="18px"
                          tt={"capitalize"}
                          c={Color.Text3}
                          fw={500}
                        >
                          {billing?.order.category}
                        </Text>
                      </Group>
                      <Group justify="space-between" wrap="nowrap">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Pickup Location
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          {billing &&
                            parseLocationFromJson(billing.order.sender_location)
                              .senderLocation}
                        </Text>
                      </Group>
                      <Group justify="space-between" wrap="nowrap">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Drop-off Location
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          {billing &&
                            parseLocationFromJson(
                              billing.order.receiver_location
                            ).receiverLocation}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Cargo Owner
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          {billing?.owner.company}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Truck License Plate
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          {billing?.order.driver.current_vehicle.plate_no}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text
                          size="18px"
                          fw={400}
                          c={Color.TextSecondary3}
                          mb={"xs"}
                        >
                          Total Transport Cost
                        </Text>
                        <Text size="18px" c={Color.Text3} fw={500}>
                          <NumberFormatter
                            prefix="Tsh "
                            value={billing?.amount}
                            thousandSeparator
                          />
                        </Text>
                      </Group>
                    </SimpleGrid>
                  </div>
                </Paper>
              </div>
            </Paper>
          </Box>
          <Space h="md" />
          <Box pos="relative">
            <LoadingOverlay
              visible={isLoading}
              loaderProps={{ children: percent + "% Loading..." }}
            />
            <Paper
              bg={"white"}
              p={"md"}
              radius={"md"}
              style={{ border: "1px solid #1A2F570F" }}
            >
              <Text size="22px" fw={600} c={Color.TextTitle3} mb={"xs"}>
                Invoice
              </Text>
              {pdf && (
                <ScrollArea h={700} scrollbars="y">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={pdf} />
                  </Worker>
                </ScrollArea>
              )}
            </Paper>
          </Box>
          <Space h="md" />

          <Paper
            bg={"white"}
            p={"md"}
            radius={"md"}
            style={{ border: "1px solid #1A2F570F" }}
          >
            <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
              <Text size="18px" fw={700} c={Color.TextTitle4} mb={"xs"}>
                Payment Status Updates
              </Text>
              <Space h="md" />

              <div>
                <SimpleGrid cols={1}>
                  <Group justify="space-between">
                    <Text
                      size="18px"
                      fw={400}
                      c={Color.TextSecondary3}
                      mb={"xs"}
                    >
                      Current Status
                    </Text>
                    {billing && billing.status !== "paid" && (
                      <Button type="submit" color={Color.Yellow}>
                        Pending Payment
                      </Button>
                    )}
                    {billing && billing.status == "paid" && (
                      <Button type="submit" color={Color.Green}>
                        Paid
                      </Button>
                    )}
                  </Group>
                </SimpleGrid>
              </div>
            </Paper>
            <Space h="md" />

            <Paper bg={"#F6F6F6"} p={"md"} radius={"md"}>
              <Text size="18px" fw={700} c={Color.TextTitle4} mb={"xs"}>
                Previous Updates
              </Text>
              <Space h="md" />

              <div>
                <SimpleGrid cols={1}>
                  {billing?.history.map((item, index) => (
                    <Group justify="space-start" key={index}>
                      <Text
                        size="16px"
                        fw={400}
                        c={Color.TextSecondary3}
                        fs="italic"
                      >
                        {moment(item.created_at).format(
                          "Do MMM YYYY, h:mm:ss A"
                        )}
                        :
                      </Text>
                      <Text size="16px" c={Color.Text2} fw={400}>
                        {item.description}
                      </Text>
                    </Group>
                  ))}
                </SimpleGrid>
              </div>
            </Paper>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {authUser?.user_type == "owner" &&
            (payments?.results?.length ?? 0) > 0 && (
              <Paper
                pt="md"
                px="md"
                mb={"md"}
                radius="10px"
                style={{ border: "2px solid #1A2F570F" }}
              >
                <Text size="16px" fw={500} c={Color.TextTitle4}>
                  Payment Confirmation
                </Text>
                <Space h="md" />
                {payments?.results.map((item, index) => (
                  <Paper key={index} mb={"md"}>
                    <Text size="16px" fw={500} c={Color.Text3}>
                      <NumberFormatter
                        prefix="Tsh "
                        value={item?.amount}
                        thousandSeparator
                      />
                    </Text>
                    <Space h="xs" />

                    <Group>
                      <IoCheckbox color={Color.Green} size={16} />
                      <Text size="14px" fw={400} c={Color.Text8}>
                        Confirm Receipt of Advance Payment
                      </Text>
                    </Group>
                    <Space h="md" />
                    <PaymentConfirmationModal
                      payment={item}
                      fetchData={() => {
                        fetchData();
                        setPDF(undefined);
                      }}
                    />
                  </Paper>
                ))}
              </Paper>
            )}
          {authUser?.user_type == "sender" && (
            <Paper
              p="md"
              mb={"md"}
              radius="10px"
              style={{ border: "2px solid #1A2F570F" }}
            >
              <Text size="16px" fw={500} c={Color.TextTitle4}>
                Payment Confirmation
              </Text>
              <Space h="md" />
              <form
                onSubmit={form.onSubmit(() => {
                  addBillingPayment();
                })}
              >
                <NumberInput
                  prefix="Tshs "
                  label="Amount"
                  placeholder="Enter amount"
                  thousandSeparator=","
                  min={1}
                  inputWrapperOrder={["label", "input", "description", "error"]}
                  key={form.key("amount")}
                  {...form.getInputProps("amount")}
                />
                <Space h="md" />

                <Group>
                  <Checkbox
                    {...form.getInputProps("confim")}
                    label={
                      "I have sent the advance payment"
                    }
                    color={Color.Green}
                  />
                </Group>

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
                  Confirm
                </Button>
              </form>
            </Paper>
          )}
          <Paper p="md" radius="10px" style={{ border: "2px solid #1A2F570F" }}>
            <Text size="16px" fw={500} c={Color.TextTitle4}>
              Quick Actions
            </Text>
            <Space h="md" />
            <Group justify="space-between">
              <Modal
                opened={opened}
                onClose={close}
                title={
                  <Text size="22px" fw={600} c={Color.TextTitle3} mb={"xs"}>
                    Cargo Details
                  </Text>
                }
                size="auto"
              >
                <OrderDetails
                  loadingOrder={loadingBilling}
                  order={billing?.order}
                />
              </Modal>

              <Button
                size="lg"
                variant="outline"
                radius={"md"}
                color={Color.PrimaryBlue}
                onClick={open}
              >
                Cargo Details
              </Button>
              <Button
                leftSection={<FiDownload />}
                size="lg"
                radius={"md"}
                color={Color.PrimaryBlue}
                onClick={() => {
                  if (pdf && billing) {
                    const a = document.createElement("a");
                    a.href = pdf;
                    a.download = billing?.invoice_id + "-invoice.pdf";
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(pdf);
                  }
                }}
              >
                Download
              </Button>
            </Group>
          </Paper>
          <Space h="md" />

          {authUser?.user_type == "owner" && billing?.status !== "paid" && billing?.category =="commission"&& (
            <>
              <CommissionPaymentForm billing={billing} fetchData={() => {
                fetchData();
                setPDF(undefined);
              }} />
            </>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
