import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Space,
  Spoiler,
  Text,
  TextInput
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaMoneyBills } from "react-icons/fa6";
import { FiBookmark } from "react-icons/fi";
import {
  IoLocationOutline,
  IoTimeOutline
} from "react-icons/io5";
import { MdBusinessCenter, MdOutlineClear } from "react-icons/md";
import { TbUser, TbUsers } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import JobCard from "../components/JobCard";
import { JobCardSkeleton, JobDetailsCardSkeleton } from "../components/Loaders";
import { useJobServices } from "../services";
import { useJobParameters } from "../stores";
import { IJobPost, PaginatedResponse } from "../types";

export default function JobDetails() {
  const parameters = useJobParameters();

  const { getJob, getRelatedJobs } = useJobServices();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [_loadingJobs, setLoadingJobs] = useState(false);
  const [jobs, setJobs] = useState<PaginatedResponse<IJobPost>>();
  const [job, setJob] = useState<IJobPost>();

  // const form = useForm<IBidForm>({
  //   initialValues: { price: 0 },

  //   validate: {
  //     price: (value) =>
  //       value < order?.price!
  //         ? `Amount should be greater or equal to Tshs ${order?.price.toLocaleString()}`
  //         : null,
  //   },
  // });

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
  };
  const fetchRelatedJobs = (next?: string) => {
    setLoadingJobs(true);

    getRelatedJobs(job?.category!, id!, next, jobs?.lastDoc, jobs?.firstDoc)
      .then((response) => {
        setLoadingJobs(false);
        setJobs(response);
      })
      .catch((_error) => {
        setLoadingJobs(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  useEffect(() => {
    if (job) {
      fetchRelatedJobs();
    }
  }, [job]);
  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <JobCardSkeleton key={index} />
  ));
  const cards = jobs?.data.map((item, index) => (
    <JobCard job={item} key={index} />
  ));
  return (
    <div>
      <Space h="md" />

      <Paper p={"md"} radius={"md"}>
        <Group justify="space-between">
          <Group>
            <TextInput
              leftSection={Icons.search}
              placeholder="UI UX Designer"
              radius={"md"}
              value={parameters.search}
              onChange={(value) => {
                parameters.updateText("search", value.currentTarget.value);
                // fetchOrders(1);
              }}
              rightSection={
                parameters.search.length != 0 ? (
                  <ActionIcon
                    variant="transparent"
                    color="black"
                    onClick={() => {
                      parameters.updateText("search", "");
                      // fetchOrders(1);
                    }}
                  >
                    <MdOutlineClear />
                  </ActionIcon>
                ) : null
              }
            />
            <Divider orientation="vertical" />
            <TextInput
              leftSection={Icons.location}
              placeholder="Dar es salaam, Tanzania"
              radius={"md"}
              value={parameters.search}
              onChange={(value) => {
                parameters.updateText("search", value.currentTarget.value);
                // fetchOrders(1);
              }}
              rightSection={
                parameters.search.length != 0 ? (
                  <ActionIcon
                    variant="transparent"
                    color="black"
                    onClick={() => {
                      parameters.updateText("search", "");
                      // fetchOrders(1);
                    }}
                  >
                    <MdOutlineClear />
                  </ActionIcon>
                ) : null
              }
            />
          </Group>
          <Button
            size="md"
            variant="filled"
            color={Color.PrimaryBlue}
            fw={400}
          >
            Find Job
          </Button>
        </Group>
      </Paper>
      <Space h="md" />
      <Group justify="space-between">
        <Text size="28px" fw={700}>
          Related Jobs
        </Text>
      </Group>
      <Space h="md" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          {/* <Group justify="space-between">
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
                Related Jobs
              </Text>
            </Group>
            <UnstyledButton onClick={() => navigate("/jobs")}>
              <Text size="14px" fw={500} c={Color.PrimaryBlue}>
                View More
              </Text>
            </UnstyledButton>
          </Group> */}
          <SimpleGrid cols={1}>{isLoading ? skeletons : cards}</SimpleGrid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
     
          {job ? (
            <Card p={"md"} radius={"md"}>
              <Group wrap="wrap" justify="space-between">
                <Text size="24px" fw={700} c="#141514">
                  Job Details
                </Text>
                <Group>
                  <Button
                    variant="filled"
                    color="#E5E5E5"
                    c={"black"}
                    size="md"
                    radius={"md"}
                    fw={500}
                    leftSection={<FiBookmark size={16} />}
                  >
                    Save job
                  </Button>
                  <Button
                    variant="filled"
                    color="#151F42"
                    size="md"
                    radius={"md"}
                    fw={500}
                  >
                    Apply Now
                  </Button>
                </Group>
              </Group>
              <Space h="md" />
              <div>
                <Text size="18px" fw={600} c="#141514">
                  {job.title ? job.title : job.category}
                </Text>
                <Group wrap="nowrap" gap={2} mt={"xs"}>
                  <IoTimeOutline size={12} />
                  <Text size="12px" fw={500} c="#596258">
                    {moment(job.datePosted).startOf("day").fromNow()}
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
                  {(job.numberOfPositions ?? 1) > 1 ? <TbUsers /> : <TbUser />}
                </div>
              </Group>
              <Space h="xs" />

              <Spoiler maxHeight={146} showLabel="Show more" hideLabel="Hide">
                <Text size="16px" fw={400} c="#7F7D7D">
                  {job.description}
                </Text>

                {/* <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </TypographyStylesProvider> */}
              </Spoiler>
              <Space h="lg" />
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
              <Space h="lg" />

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
                        prefix={`${job.currency ? job.currency.code : "TZS"} `}
                        value={job.budget}
                        thousandSeparator
                      />
                      {job.maxBudget > 0 && (
                        <NumberFormatter
                          prefix={` - ${job.currency ? job.currency.code : "TZS"
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


              {job.imageUrls.length > 0 && (
                <div>
                  <Space h="lg" />
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
                </div>
              )}
              <Space h="lg" />

              <div>
                <Text size="20px" fw={500} c="#141514">
                  About Employer
                </Text>
                <Space h="xs" />
                <Group wrap="nowrap">
                  <Avatar
                    w="50px"
                    h="50px"
                    radius={"xl"}
                    src={
                      job.avatarUrl
                    }
                  />
                  <Text size="16px" fw={500} c="#000000"  >
                    {job.fullName}
                  </Text>
                </Group>
              </div>

            </Card>
          ) : (
            <JobDetailsCardSkeleton />
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
