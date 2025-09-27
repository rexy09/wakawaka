import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  NumberFormatter,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/FirebaseAuthContext";
import { FaMoneyBills, FaWandMagicSparkles } from "react-icons/fa6";
import { IoArrowBack, IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { MdBusinessCenter, MdOutlineCall, MdVerified } from "react-icons/md";
import { TbUser, TbUsers } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import AuthModal from "../../../auth/components/AuthModal";
import { JobDetailsCardSkeleton } from "../components/Loaders";
import { useJobServices } from "../services";
import {
  IApplicant,
  IHiredApplication,
  IJobApplication,
  IJobBid,
  IJobPost,
  ISmartHireStatus,
} from "../types";
import UserAvatar from "../components/UserAvatar";
import { timestampToISO } from "../../../hooks/utils";

export default function PostedJobDetails() {
  const navigate = useNavigate();

  const { user: authUser } = useAuth();

  const {
    getJob,
    getJobBids,
    getJobApplications,
    getAllHiredJobApplications,
    unemployApplicantFromJob,
    employApplicantFromJob,
    smartHireTrigger,
    smartHireStatus,
    getSmartHireResults,
  } = useJobServices();
  const { id } = useParams();

  const [_isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState<IJobPost>();
  const [loadingApplication, setLoadingApplication] = useState(false);
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [smartHire, setSmartHire] = useState<ISmartHireStatus>();
  const [smartHireResults, setSmartHireResults] = useState<IApplicant[]>([]);
  const [bids, setBids] = useState<IJobBid[]>([]);
  const [hiredApplications, setHiredApplications] = useState<
    IHiredApplication[]
  >([]);
  const [loadingHired, setLoadingHired] = useState(false);
  const [loadingUnemployment, setLoadingUnemployment] = useState("");
  const [loadingSmartHire, setLoadingSmartHire] = useState(false);
  const [authModalStatus, openAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("applicants");
  const [modalApplicant, setModalApplicant] = useState<IApplicant | null>(null);

  const tabs = [
    { id: "applicants", label: "Applicants" },
    { id: "smartHired", label: "Smart Hire" },
    { id: "hired", label: "Hired" },
  ];

  const handleUnemployApplicantFromJob = async (applicantUid: string) => {
    setLoadingUnemployment(applicantUid);
    unemployApplicantFromJob(job?.id!, applicantUid)
      .then((_response) => {
        setLoadingUnemployment("");
        fetchJobApplications();
      })
      .catch((error) => {
        setLoadingUnemployment("");
        console.log(error);
      });
  };
  const handleEmployApplicantFromJob = async (applicantUid: string) => {
    setLoadingUnemployment(applicantUid);
    employApplicantFromJob(job?.id!, applicantUid)
      .then((_response) => {
        setLoadingUnemployment("");
        fetchJobApplications();
      })
      .catch((error) => {
        setLoadingUnemployment("");
        console.log(error);
      });
  };

  const handleSmartHireTrigger = async () => {
    if (!authUser) {
      openAuthModal(true);
      return;
    }

    if (!job?.id) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Job ID is missing!",
      });
      return;
    }

    setLoadingSmartHire(true);
    try {
      const response = await smartHireTrigger(job.id);
      console.log(response);
      notifications.show({
        color: "green",
        title: "Success",
        message: "Smart hire process has been triggered successfully.",
      });
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Error",
        message:
          "Failed to trigger smart hire process. Please try again later.",
      });
    } finally {
      setLoadingSmartHire(false);
    }
  };

  const fetchJobApplications = async () => {
    if (!job || !authUser?.uid) return;
    setLoadingApplication(true);
    if (job.hasBidding) {
      try {
        const bids = await getJobBids({ jobId: job.id });
        setBids(bids);
      } catch (error) {
        setLoadingApplication(false);

        console.error("Error fetching job bids:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to fetch job bids. Please try again later.",
        });
      } finally {
        setLoadingApplication(false);
      }
    } else {
      try {
        const application = await getJobApplications({ jobId: job.id });
        setApplications(application);
      } catch (error) {
        setLoadingApplication(false);

        console.error("Error checking user application:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message:
            "Failed to check your application status. Please try again later.",
        });
      } finally {
        setLoadingApplication(false);
      }
    }

    try {
      setLoadingHired(true);
      const application = await getAllHiredJobApplications({ jobId: job.id });
      setHiredApplications(application);
    } catch (error) {
      setLoadingHired(false);

      console.error("Error checking user application:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message:
          "Failed to check your application status. Please try again later.",
      });
    } finally {
      setLoadingHired(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    getJob(id!)
      .then((response) => {
        setIsLoading(false);
        setJob(response);
      })
      .catch((_error) => {
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
    smartHireStatus(id!)
      .then((response) => {
        setIsLoading(false);
        setSmartHire(response.data);
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
  const fetchSmartHireResults = () => {
    if (!smartHire?.execution?.execution_id) {
      return;
    }

    setLoadingSmartHire(true);

    getSmartHireResults(id!, smartHire.execution.execution_id)
      .then((response) => {
        setLoadingSmartHire(false);
        // Parse ai_recruiter JSON string to object for each applicant
        const parsedResults = response.map((applicant: IApplicant) => ({
          ...applicant,
          ai_recruiter:
            typeof applicant.ai_recruiter === "string"
              ? JSON.parse(applicant.ai_recruiter)
              : applicant.ai_recruiter,
        }));
        setSmartHireResults(parsedResults);
      })
      .catch((_error) => {
        setLoadingSmartHire(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    fetchSmartHireResults();
  }, [smartHire]);
  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (job && authUser?.uid) {
      fetchJobApplications();
    }
  }, [job, authUser?.uid]);
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const openModal = (applicant: IApplicant) => {
    setModalApplicant(applicant);
  };

  const closeModal = () => {
    setModalApplicant(null);
  };

  const applicationsCards = applications.map((application) => (
    <Paper withBorder p={"xs"} radius={"md"} mb={"sm"} key={application.id}>
      <Group wrap="nowrap" align="center" justify="space-between">
        <Group wrap="nowrap" gap={"xs"}>
          <Avatar w="50px" h="50px" radius={"xl"} src={application.avatarURL} />
          <div>
            <Text size="16px" fw={500} c="#000000">
              {application.applicantName}
            </Text>
            <Space h="5px" />
            <Group wrap="nowrap" gap={3}>
              {/* <IoTimeOutline size={14} color="#596258" /> */}
              <Text size="14px" fw={400} c="#596258">
                Applied at{" "}
                {moment(
                  typeof application.dateAdded === "string"
                    ? new Date(application.dateAdded)
                    : application.dateAdded.toDate()
                ).format("DD MMMM YYYY")}
              </Text>
            </Group>
          </div>
        </Group>
        {application.status != "accepted" && (
          <Button
            variant="filled"
            color="#151F42"
            size="xs"
            radius={"xl"}
            fw={500}
            disabled={loadingUnemployment === application.uid}
            loading={loadingUnemployment === application.uid}
            onClick={() => handleEmployApplicantFromJob(application.uid)}
          >
            Employ
          </Button>
        )}
      </Group>
    </Paper>
  ));
  const bidsCards = bids.map((bid) => (
    <Paper withBorder p={"xs"} radius={"md"} mb={"sm"} key={bid.id}>
      <Group wrap="nowrap" align="center" justify="space-between">
        <Group wrap="nowrap" gap={"xs"}>
          <Avatar w="50px" h="50px" radius={"xl"} src={job?.avatarUrl} />
          <div>
            <Text size="16px" fw={500} c="#000000">
              {bid.bidderName}
            </Text>
            <Space h="5px" />
            <Group wrap="nowrap" gap={3}>
              {/* <IoTimeOutline size={14} color="#596258" /> */}
              <Text size="14px" fw={400} c="#596258">
                Bid at{" "}
                {moment(
                  typeof bid?.dateAdded === "string"
                    ? new Date(bid.dateAdded)
                    : bid?.dateAdded.toDate()
                ).format("D MMM YYYY  hh:mm A")}
              </Text>
            </Group>
            <Badge
              mt={"xs"}
              variant="light"
              color="#6247BA"
              size="md"
              radius={"xl"}
              fw={500}
            >
              <NumberFormatter
                prefix={`${job?.currency ? job.currency.code : "TZS"} `}
                value={bid.amount}
                thousandSeparator
              />
            </Badge>
          </div>
        </Group>
        <Stack align="end">
          {bid.status != "accepted" && (
            <Button
              variant="filled"
              color="#151F42"
              size="xs"
              radius={"xl"}
              fw={500}
            >
              Employ
            </Button>
          )}
        </Stack>
      </Group>
    </Paper>
  ));
  const hiredCards = hiredApplications.map((applicant, index) => (
    <Paper withBorder p={"xs"} radius={"md"} mb={"sm"} key={index}>
      <Group wrap="nowrap" align="center" justify="space-between">
        <Group wrap="nowrap" gap={"xs"}>
          <UserAvatar userId={applicant.applicantUid} />
          <div>
            <Text size="16px" fw={500} c="#000000">
              {applicant.applicantName}
            </Text>
            <Space h="5px" />
            <Group wrap="nowrap" gap={3}>
              <Text size="sm" fw={400} c="#596258">
                Hired at{" "}
                {moment(
                  typeof applicant?.dateHired === "string"
                    ? new Date(applicant.dateHired)
                    : applicant?.dateHired.toDate()
                ).format("D MMM YYYY")}
              </Text>
            </Group>

            {job?.hasBidding && (
              <Badge
                mt={"xs"}
                variant="light"
                color="#6247BA"
                size="md"
                radius={"xl"}
                fw={500}
              >
                <NumberFormatter
                  prefix={`${job?.currency ? job.currency.code : "TZS"} `}
                  value={applicant.amount}
                  thousandSeparator
                />
              </Badge>
            )}
          </div>
        </Group>
        <Group wrap="nowrap" gap={8}>
          <ActionIcon color="#43A047" radius={"xl"} size={"lg"}>
            <MdOutlineCall color="white" />
          </ActionIcon>
          <Button
            variant="filled"
            color="#E53935"
            size="xs"
            radius={"xl"}
            fw={500}
            disabled={loadingUnemployment === applicant.applicantUid}
            loading={loadingUnemployment === applicant.applicantUid}
            onClick={() =>
              handleUnemployApplicantFromJob(applicant.applicantUid)
            }
          >
            Unemploy
          </Button>
        </Group>
      </Group>
    </Paper>
  ));

  return (
    <div>
      <AuthModal
        opened={authModalStatus}
        onClose={() => {
          openAuthModal(false);
        }}
      />
      <Space h="md" />
      <Group wrap="wrap" justify="space-between" align="start">
        <Group justify="start">
          <UnstyledButton onClick={() => navigate(-1)}>
            <IoArrowBack size={20} />
          </UnstyledButton>
          <Text size="28px" fw={700} c="#141514">
            Job Details
          </Text>
        </Group>
      </Group>
      <Divider my="md" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }} order={{ base: 2, md: 1 }}>
          {job ? (
            <>
              <Card p={"md"} radius={"md"}>
                <div>
                  <Group justify="space-between" wrap="nowrap" align="start">
                    <Text size="18px" fw={600} c="#141514">
                      {job.title ? job.title : job.category}
                    </Text>
                    {job && (
                      <Badge
                        color={!job?.isActive ? "#E53935" : "#044299"}
                        radius="sm"
                        size="lg"
                      >
                        <Text size="xs" fw={500} c="#FFFFFF" tt={"capitalize"}>
                          {!job?.isActive ? "Closed" : "Active"}
                        </Text>
                      </Badge>
                    )}
                  </Group>
                  <Group wrap="nowrap" gap={2} mt={"xs"}>
                    <IoTimeOutline size={12} />
                    <Text size="12px" fw={500} c="#596258">
                      {moment(
                        typeof job.datePosted === "string"
                          ? new Date(job.datePosted)
                          : job.datePosted.toDate()
                      )
                        .startOf("day")
                        .fromNow()}
                    </Text>
                  </Group>
                </div>
                <Space h="xs" />
                <Group wrap="wrap" gap={5}>
                  <span className="inline-flex items-center rounded-[7px] bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-[#151F42]  ">
                    {job.commitment}
                  </span>
                  <span className="inline-flex items-center rounded-[7px] bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-[#151F42]  ">
                    {job.urgency}
                  </span>
                  <span className="inline-flex items-center rounded-[7px] bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-[#151F42]  ">
                    {job.workLocation}
                  </span>

                  <div className="inline-flex items-center rounded-[7px] bg-[#F0F0F0] px-2 py-1 text-xs font-medium text-[#151F42] ">
                    <span className="mr-1">
                      {(job.numberOfPositions ?? 1) > 1
                        ? `${job.numberOfPositions ?? 1}`
                        : `${job.numberOfPositions ?? 1}`}
                    </span>
                    {(job.numberOfPositions ?? 1) > 1 ? (
                      <TbUsers />
                    ) : (
                      <TbUser />
                    )}
                  </div>
                </Group>
                <Space h="xs" />

                <Spoiler maxHeight={146} showLabel="Show more" hideLabel="Hide">
                  <Text size="md" fw={400} c="#7F7D7D">
                    {job.description}
                  </Text>

                  {/* <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </TypographyStylesProvider> */}
                </Spoiler>
              </Card>
              <Space h="md" />

              <Card p={"md"} radius={"md"}>
                <div>
                  <Text size="20px" fw={500} c="#141514">
                    Location
                  </Text>
                  <Group wrap="nowrap" gap={3} mt={"xs"}>
                    <IoLocationOutline />
                    <Text size="14px" fw={400} c="#596258">
                      {job.location.address}
                    </Text>
                  </Group>
                </div>
              </Card>
              <Space h="md" />
              <Card p={"md"} radius={"md"}>
                <div>
                  <Text size="20px" fw={500} c="#141514">
                    Budget
                  </Text>
                  <Group wrap="nowrap" mt={"xs"}>
                    <Avatar color="#EBEBEB" radius="xl" variant="filled">
                      <FaMoneyBills color="#141514" />
                    </Avatar>
                    <div>
                      <Text size="12px" fw={700} c="#7F7D7D" mb={"5px"}>
                        Budget
                      </Text>
                      <Text size="16px" fw={700} c="#151F42">
                        <NumberFormatter
                          prefix={`${
                            job.currency ? job.currency.code : "TZS"
                          } `}
                          value={job.budget}
                          thousandSeparator
                        />
                        {job.maxBudget > 0 && (
                          <NumberFormatter
                            prefix={` - ${
                              job.currency ? job.currency.code : "TZS"
                            } `}
                            value={job.maxBudget}
                            thousandSeparator
                          />
                        )}
                      </Text>
                    </div>
                  </Group>
                  <Group wrap="nowrap" mt={"xs"}>
                    <Avatar color="#EBEBEB" radius="xl" variant="filled">
                      <MdBusinessCenter color="#141514" />
                    </Avatar>
                    <div>
                      <Text size="12px" fw={700} c="#7F7D7D" mb={"5px"}>
                        Job Type
                      </Text>
                      <Text size="16px" fw={700} c="#151F42">
                        {job.commitment}
                      </Text>
                    </div>
                  </Group>
                </div>
              </Card>
              {job.imageUrls.length > 0 && (
                <Card p={"md"} radius={"md"} mt={"md"}>
                  <Text size="20px" fw={500} c="#141514">
                    Photos
                  </Text>
                  <Space h="xs" />
                  <SimpleGrid cols={4}>
                    {job.imageUrls.map((item, index) => (
                      <div key={index}>
                        <Image
                          radius="md"
                          h={150}
                          w="100%"
                          fit="cover"
                          src={item}
                        />
                      </div>
                    ))}
                  </SimpleGrid>
                </Card>
              )}
              <Space h="md" />
              <Card p={"md"} radius={"md"}>
                <div>
                  <Text size="20px" fw={500} c="#141514">
                    About Employer
                  </Text>
                  <Space h="xs" />
                  <Group wrap="nowrap" align="start">
                    <Avatar
                      w="50px"
                      h="50px"
                      radius={"xl"}
                      src={authUser?.avatarURL}
                    />
                    <div style={{ flex: 1 }}>
                      <Text size="16px" fw={500} c="#000000">
                        {authUser?.fullName}
                      </Text>
                      <Space h="xs" />
                      <Group wrap="nowrap" gap={3}>
                        <IoTimeOutline size={14} color="#596258" />
                        <Text size="14px" fw={400} c="#596258">
                          Joined{" "}
                          {job.userDateJoined
                            ? moment(
                                typeof job.userDateJoined === "string"
                                  ? new Date(job.userDateJoined)
                                  : timestampToISO(
                                      job.userDateJoined.seconds ?? 0,
                                      job.userDateJoined.nanoseconds ?? 0
                                    )
                              ).format("MMMM YYYY")
                            : "NA"}
                        </Text>
                      </Group>
                      <Group wrap="nowrap" gap={3} mt={4}>
                        <MdBusinessCenter size={14} color="#596258" />
                        <Text size="14px" fw={400} c="#596258">
                          {job.numberOfPostedJobsByUser}{" "}
                          {job.numberOfPostedJobsByUser === 1 ? "job" : "jobs"}{" "}
                          posted
                        </Text>
                      </Group>
                      {job.isUserVerified && (
                        <Group wrap="nowrap" gap={3} mt={4}>
                          <MdVerified size={14} color="#44A047" />
                          <Text size="14px" fw={400} c="#44A047">
                            Verified employer
                          </Text>
                        </Group>
                      )}
                    </div>
                  </Group>
                </div>
              </Card>
            </>
          ) : (
            <JobDetailsCardSkeleton />
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }} order={{ base: 1, md: 2 }}>
          {!job?.hasBidding && (
            <Paper radius={"md"} p={"md"}>
              <Group justify="space-between">
                <Text size="28px" fw={700}>
                  Applications
                </Text>
              </Group>
              <Space h="lg" />
              <Group justify="center">
                <div className="flex bg-[#F4F4F4C9] rounded-lg p-1 w-fit gap-2 border border-[#C7C7C72B]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-[#151F42] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Group>
              <Space h="lg" />
              <Tabs value={activeTab} keepMounted={false}>
                <Tabs.Panel value="applicants">
                  {loadingApplication ? (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Center>
                        <Loader color="violet" size={"sm"} />
                      </Center>
                    </Paper>
                  ) : applicationsCards.length > 0 ? (
                    applicationsCards
                  ) : (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Text size="sm" c="#7F7D7D" ta={"center"}>
                        No applications yet.
                      </Text>
                    </Paper>
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="smartHired">
                  {smartHire?.execution == null && (
                    <Center>
                      <Button
                        variant="filled"
                        color="#151F42"
                        leftSection={<FaWandMagicSparkles />}
                        size="md"
                        fw={500}
                        w={"90%"}
                        loading={loadingSmartHire}
                        disabled={loadingSmartHire}
                        onClick={handleSmartHireTrigger}
                      >
                        {loadingSmartHire ? "Processing..." : "Analyze with AI"}
                      </Button>
                    </Center>
                  )}

                  {smartHire?.execution != null && (
                    <>
                      <Group
                        justify="space-between"
                        align="center"
                        mb={"md"}
                        mt={"-md"}
                      >
                        <Text size="16px" fw={600} c="#141514">
                          Smart Hire Results
                        </Text>
                        <Badge
                          color={
                            smartHire.execution.status === "completed"
                              ? "#43A047"
                              : smartHire.execution.status === "failed"
                              ? "#E53935"
                              : "#FF9800"
                          }
                          radius="sm"
                          size="lg"
                        >
                          <Text
                            size="xs"
                            fw={500}
                            c="#FFFFFF"
                            tt={"capitalize"}
                          >
                            {smartHire.execution.status}
                          </Text>
                        </Badge>
                      </Group>
                      {smartHire.execution.status === "completed" && (
                        <>
                          {loadingSmartHire || smartHireResults.length === 0 ? (
                            <Paper withBorder p={"xs"} radius={"md"}>
                              <Text size="sm" c="#7F7D7D" ta={"center"}>
                                No results found.
                              </Text>
                            </Paper>
                          ) : (
                            <ScrollArea
                              style={{ height: "calc(100vh - 50vh)" }}
                              scrollbars="y"
                            >
                              {smartHireResults.map((applicant) => {
                                // Remove isExpanded logic for modal approach

                                return (
                                  <Paper
                                    withBorder
                                    p={"md"}
                                    radius={"md"}
                                    mb={"md"}
                                    key={applicant.uid}
                                  >
                                      <Group
                                        justify="space-between"
                                        align="start"
                                      >
                                        <Group gap="sm">
                                          <Avatar
                                            size="lg"
                                            radius="xl"
                                            src={applicant.avatarURL}
                                          />
                                          <div>
                                            <Text
                                              size="lg"
                                              fw={600}
                                              c="#000000"
                                            >
                                              {applicant.applicantName}
                                            </Text>
                                            {applicant.ai_recruiter && (
                                                <Group
                                                  justify="space-between"
                                                  align="center"
                                                >
                                                  <Group gap="xs">
                                                    <Badge
                                                      size="sm"
                                                      radius="md"
                                                      variant="filled"
                                                      color={
                                                        applicant.ai_recruiter
                                                          .risk_score >= 75
                                                          ? "green"
                                                          : applicant
                                                              .ai_recruiter
                                                              .risk_score >= 50
                                                          ? "yellow"
                                                          : "red"
                                                      }
                                                    >
                                                      Risk:{" "}
                                                      {
                                                        applicant.ai_recruiter
                                                          .risk_score
                                                      }
                                                      %
                                                    </Badge>
                                                    <Badge
                                                      size="sm"
                                                      radius="md"
                                                      variant="outline"
                                                      color="blue"
                                                    >
                                                      Hire:{" "}
                                                      {
                                                        applicant.ai_recruiter
                                                          .employability_score
                                                      }
                                                      %
                                                    </Badge>
                                                  </Group>

                                                  <Button
                                                  
                                                  size="compact-xs"
                                                    variant="light"
                                                    color="blue"
                                                    onClick={() =>
                                                      openModal(applicant)
                                                    }
                                                  >
                                                    View Details
                                                  </Button>
                                                </Group>
                                            )}
                                          </div>
                                        </Group>
                                      </Group>

                                  </Paper>
                                );
                              })}
                            </ScrollArea>
                          )}
                        </>
                      )}
                      {smartHire.execution.status === "in_progress" && (
                        <Paper withBorder p={"xs"} radius={"md"}>
                          <Center>
                            <Loader color="violet" size={"sm"} />
                          </Center>
                          <Text size="sm" c="#7F7D7D" ta={"center"} mt={"sm"}>
                            AI is analyzing the applications. Please check back
                            later.
                          </Text>
                        </Paper>
                      )}
                      {smartHire.execution.status === "failed" && (
                        <Paper withBorder p={"xs"} radius={"md"}>
                          <Text size="sm" c="#E53935" ta={"center"}>
                            Failed to analyze applications. Please try again
                            later.
                          </Text>
                        </Paper>
                      )}
                    </>
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="hired">
                  {loadingHired ? (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Center>
                        <Loader color="violet" size={"sm"} />
                      </Center>
                    </Paper>
                  ) : hiredCards.length > 0 ? (
                    hiredCards
                  ) : (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Text size="sm" c="#7F7D7D" ta={"center"}>
                        No hired applications yet.
                      </Text>
                    </Paper>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Paper>
          )}
          {job?.hasBidding && (
            <Paper radius={"md"} p={"md"}>
              <Group justify="space-between">
                <Text size="28px" fw={700}>
                  Bid Applications
                </Text>
              </Group>
              <Space h="lg" />
              <Group justify="center">
                <div className="flex bg-[#F4F4F4C9] rounded-lg p-1 w-fit gap-2 border border-[#C7C7C72B]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-[#151F42] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Group>
              <Space h="lg" />
              <Tabs value={activeTab} keepMounted={false}>
                <Tabs.Panel value="applicants">
                  <ScrollArea
                    style={{ height: "calc(100vh - 45vh)" }}
                    scrollbars="y"
                  >
                    {bidsCards.length > 0 ? (
                      bidsCards
                    ) : (
                      <Paper withBorder p={"xs"} radius={"md"}>
                        <Text size="sm" c="#7F7D7D" ta={"center"}>
                          No bid applications yet.
                        </Text>
                      </Paper>
                    )}
                  </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel value="hired">
                  {loadingHired ? (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Center>
                        <Loader color="violet" size={"sm"} />
                      </Center>
                    </Paper>
                  ) : hiredCards.length > 0 ? (
                    hiredCards
                  ) : (
                    <Paper withBorder p={"xs"} radius={"md"}>
                      <Text size="sm" c="#7F7D7D" ta={"center"}>
                        No hired applications yet.
                      </Text>
                    </Paper>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Paper>
          )}
        </Grid.Col>
      </Grid>

      {/* AI Analysis Modal */}
      <Modal
        opened={modalApplicant !== null}
        onClose={closeModal}
        title={
          <Group gap="sm">
            <Avatar size="sm" radius="xl" src={modalApplicant?.avatarURL} />
            <Text size="lg" fw={600}>
              {modalApplicant?.applicantName} - AI Analysis
            </Text>
          </Group>
        }
        size="lg"
        radius="md"
      >
        {modalApplicant?.ai_recruiter && (
          <Stack gap="lg">
            {/* Score Summary */}
            <Group gap="md" justify="center">
              <div style={{ textAlign: "center" }}>
                <Text size="xs" c="#596258" mb="xs">
                  Risk Assessment
                </Text>
                <Group gap="xs" justify="center">
                  <Text
                    size="xl"
                    fw={700}
                    c={
                      modalApplicant.ai_recruiter.risk_score >= 75
                        ? "#43A047"
                        : modalApplicant.ai_recruiter.risk_score >= 50
                        ? "#F9A825"
                        : "#E53935"
                    }
                  >
                    {modalApplicant.ai_recruiter.risk_score}%
                  </Text>
                  <Badge
                    variant="light"
                    color={
                      modalApplicant.ai_recruiter.risk_score >= 75
                        ? "green"
                        : modalApplicant.ai_recruiter.risk_score >= 50
                        ? "yellow"
                        : "red"
                    }
                    size="lg"
                  >
                    {modalApplicant.ai_recruiter.risk_score >= 75
                      ? "Low Risk"
                      : modalApplicant.ai_recruiter.risk_score >= 50
                      ? "Medium Risk"
                      : "High Risk"}
                  </Badge>
                </Group>
              </div>

              <div style={{ textAlign: "center" }}>
                <Text size="xs" c="#596258" mb="xs">
                  Employability Score
                </Text>
                <Group gap="xs" justify="center">
                  <Text size="xl" fw={700} c="#2563eb">
                    {modalApplicant.ai_recruiter.employability_score}%
                  </Text>
                  <Badge variant="light" color="blue" size="lg">
                    {modalApplicant.ai_recruiter.employability_score >= 75
                      ? "Excellent"
                      : modalApplicant.ai_recruiter.employability_score >= 50
                      ? "Good"
                      : "Fair"}
                  </Badge>
                </Group>
              </div>
            </Group>

            <Divider />

            {/* AI Reasoning */}
            <div>
              <Text size="md" fw={600} mb="sm" c="#151F42">
                AI Reasoning
              </Text>
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
              >
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  {modalApplicant.ai_recruiter.short_reason}
                </Text>
              </Paper>
            </div>

            <Divider />

            {/* AI Recommendation */}
            <Group justify="space-between" align="center">
              <div>
                <Text size="sm" c="#596258" mb="xs">
                  AI Recommendation
                </Text>
                <Text
                  size="md"
                  fw={600}
                  c={
                    modalApplicant.ai_recruiter.risk_score >= 75
                      ? "#43A047"
                      : modalApplicant.ai_recruiter.risk_score >= 50
                      ? "#F9A825"
                      : "#E53935"
                  }
                >
                  {modalApplicant.ai_recruiter.risk_score >= 75
                    ? "✅ Strongly Recommended"
                    : modalApplicant.ai_recruiter.risk_score >= 50
                    ? "⚠️ Consider with Caution"
                    : "❌ Not Recommended"}
                </Text>
              </div>

              <Button
                size="md"
                variant={
                  modalApplicant.ai_recruiter.risk_score >= 75
                    ? "filled"
                    : "outline"
                }
                color={
                  modalApplicant.ai_recruiter.risk_score >= 75
                    ? "green"
                    : modalApplicant.ai_recruiter.risk_score >= 50
                    ? "yellow"
                    : "red"
                }
                onClick={() => {
                  if (modalApplicant.ai_recruiter.risk_score >= 50) {
                    handleEmployApplicantFromJob(modalApplicant.uid);
                    closeModal();
                  }
                }}
                disabled={modalApplicant.ai_recruiter.risk_score < 50}
              >
                {modalApplicant.ai_recruiter.risk_score >= 75
                  ? "Hire Now"
                  : modalApplicant.ai_recruiter.risk_score >= 50
                  ? "Consider Hiring"
                  : "Not Recommended"}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
