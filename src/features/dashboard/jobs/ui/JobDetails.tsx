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
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoPeople, IoPerson, IoTimeOutline } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import JobCard from "../components/JobCard";
import { JobCardSkeleton, JobDetailsCardSkeleton } from "../components/Loaders";
import { useJobServices } from "../services";
import { useJobParameters } from "../stores";
import { IJobPost, PaginatedResponse } from "../types";

export default function JobDetails() {
  const navigate = useNavigate();
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
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
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
                Related Jobs
              </Text>
            </Group>
            <UnstyledButton onClick={() => navigate("/jobs")}>
              <Text size="14px" fw={500} c={Color.PrimaryBlue}>
                View More
              </Text>
            </UnstyledButton>
          
          </Group>
          <Space h="md" />

          <SimpleGrid cols={1}>{isLoading ? skeletons : cards}</SimpleGrid>
          

        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
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
          {job ?  (
            <Card p={"md"} radius={"md"}>
              <div>
                <Group wrap="nowrap" justify="space-between">
                  <Group wrap="nowrap">
                    <Avatar
                      w="50px"
                      h="50px"
                      radius={"sm"}
                      src={
                        "https://s3-alpha-sig.figma.com/img/5bd9/002a/9ba0307b78bc4047049119169f90d89f?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=m4jAhON27OSFoNogUXpDsm8Q02TVBe1Ow~ZM2ZVClSACtHVOaBpYBgSWgrepZD8ljtHjH8hbX~bQvkMaIFmKeG8G5lBrp49XI8uABfgfOSsTzhCF2EuKOhj5DfqWjTJ28x-6MZW1KyQDORk05oH3WKQtT9J4IcTDhZt5Op8whWXJ9sJsWYMLr0GFy9q4CDUYeZ~RrvLic8MVKgVJ2vlLuv4QNokOVLulhcjcCuXnow2GhwS6KBFS60V3m5MvZdEQqhi-q8jKyLC4jpSbZvwkAL3uZqi0YIX2jMta~dTRq4DGpeifDL2NPXihEAGoSL8xufuRxNFswjBPeTi0ePU0RA__"
                      }
                    />
                    <div>
                      <Text size="16px" fw={700} c="#151F42">
                        Jane Doe
                      </Text>
                      <Space h="xs" />
                      <Group wrap="nowrap">
                        <Text size="10px" fw={500} c="#044299">
                          {job.category}
                        </Text>
                        <Group wrap="nowrap" gap={3}>
                          {Icons.location2}
                          <Text size="10px" fw={500} c="#596258">
                            {job.location.address}
                          </Text>
                        </Group>
                        <Group wrap="nowrap" gap={2}>
                          <IoTimeOutline size={10} />
                          <Text size="10px" fw={500} c="#596258">
                            {moment(job.datePosted).startOf("day").fromNow()}
                          </Text>
                        </Group>
                      </Group>
                    </div>
                  </Group>
                  <Group>
                    <Button
                      variant="filled"
                      color="#151F42"
                      // bg={"#F9F9F9"}
                      size="xs"
                      // c="black"
                      radius={"4px"}
                      fw={500}
                    >
                      Apply Now
                    </Button>

                    <ActionIcon
                      variant="transparent"
                      color="#C7C7C7"
                      size={"md"}
                    >
                      {Icons.archive}
                    </ActionIcon>
                  </Group>
                </Group>
                <div>
                  <Space h="xs" />

                  <Group wrap="nowrap">
                    <Text size="24px" fw={600} c="#141514">
                      {job.category}
                    </Text>
                  </Group>
                </div>
              </div>
              <Space h="xs" />
              <Group wrap="wrap">
                <span className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">
                  {job.commitment}
                </span>
                <span className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">
                  {job.urgency}
                </span>
                <div className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">
                  <span className="mr-1">
                    {(job.numberOfPositions ?? 1) > 1
                      ? `${job.numberOfPositions ?? 1}`
                      : `${job.numberOfPositions ?? 1}`}
                  </span>
                  {(job.numberOfPositions ?? 1) > 1 ? (
                    <IoPeople />
                  ) : (
                    <IoPerson size={10} />
                  )}
                </div>
              </Group>
              <Space h="xs" />

              <Text size="14px" fw={500} c="#596258">
                {job.description}
              </Text>

              <Space h="md" />
              <Text size="20px" fw={400} c="#151F42">
                <NumberFormatter
                  prefix="TZS "
                  value={job.budget}
                  thousandSeparator
                />
                {/* <span style={{ color: "#C7C7C7" }}>/month</span> */}
              </Text>
              <Space h="lg" />

              {job.imageUrls.length > 0 && (
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
              )}
            </Card>
          ) : <JobDetailsCardSkeleton />}
        </Grid.Col>
      </Grid>
    </div>
  );
}
