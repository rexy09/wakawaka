import {
  ActionIcon,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Loader,
  NumberFormatter,
  Paper,
  RangeSlider,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useUtilities } from "../../../hooks/utils";
import { useJobServices } from "../services";
import { useDashboardParameters } from "../stores";
import { IJobPost, PaginatedResponse } from "../types";
import moment from "moment";
import { notifications } from "@mantine/notifications";
import { PaginationComponent } from "../../../../common/components/PaginationComponent";

export default function Jobs() {
  const parameters = useDashboardParameters();
  const { getFormattedDate } = useUtilities();
  const { getJobs } = useJobServices();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<PaginatedResponse<IJobPost>>();
  // const [openStartDate, setOpenStartDate] = useState(false);
  // const [openEndDate, setOpenEndDate] = useState(false);

  const getFirstDayOfCurrentMonth = (): Date => {
    const today = new Date();
    const value = new Date(today.getFullYear(), today.getMonth(), 1);

    return value;
  };

  const getLastDayOfCurrentMonth = (): Date => {
    const today = new Date();
    const value = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return value;
  };

  const [startDate, _setStartDate] = useState<Date | null>(() =>
    getFirstDayOfCurrentMonth()
  );
  const [endDate, _setEndDate] = useState<Date | null>(() =>
    getLastDayOfCurrentMonth()
  );

  const fetchData = () => {
    setIsLoading(true);
    // const params = useDashboardParameters.getState();
    // getOrdersStatistics(params)
    //   .then((response) => {
    //     setIsLoading(false);
    //     setOrderStatistics(response.data);
    //   })
    //   .catch((_error) => {
    //     setIsLoading(false);
    //     // notifications.show({
    //     //   color: "red",
    //     //   title: "Error",
    //     //   message: "Something went wrong!",
    //     // });
    //   });

    fetchJobs();
  };
  const fetchJobs = (next?: string) => {
    setIsLoading(true);
    const params = useDashboardParameters.getState();

    getJobs(params, next, jobs?.lastDoc, jobs?.firstDoc)
      .then((response) => {
        setIsLoading(false);

        console.log(response);

        setJobs(response);
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
    parameters.updateText("startDate", getFormattedDate(startDate));
    parameters.updateText("endDate", getFormattedDate(endDate));
    fetchData();
  }, []);

  // const skeletons = Array.from({ length: 4 }, (_, index) => (
  //   <OrderStatisticCardSkeleton key={index} />
  // ));
  const cards = jobs?.data.map((item, index) => (
    <Paper p={"md"} radius={"md"} key={index}>
      <Group wrap="nowrap">

        <Avatar w="50px" h="50px" radius={"sm"} src={"https://s3-alpha-sig.figma.com/img/5bd9/002a/9ba0307b78bc4047049119169f90d89f?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=m4jAhON27OSFoNogUXpDsm8Q02TVBe1Ow~ZM2ZVClSACtHVOaBpYBgSWgrepZD8ljtHjH8hbX~bQvkMaIFmKeG8G5lBrp49XI8uABfgfOSsTzhCF2EuKOhj5DfqWjTJ28x-6MZW1KyQDORk05oH3WKQtT9J4IcTDhZt5Op8whWXJ9sJsWYMLr0GFy9q4CDUYeZ~RrvLic8MVKgVJ2vlLuv4QNokOVLulhcjcCuXnow2GhwS6KBFS60V3m5MvZdEQqhi-q8jKyLC4jpSbZvwkAL3uZqi0YIX2jMta~dTRq4DGpeifDL2NPXihEAGoSL8xufuRxNFswjBPeTi0ePU0RA__"} />

        <div>
          <Text size="20px" fw={500} c="#151F42" lineClamp={1}>
            {item.category}
          </Text>
          <Space h="xs" />

          <Group wrap="nowrap">

            <Text size="10px" fw={500} c="#044299">
              {item.category}
            </Text>
            <Group wrap="nowrap" gap={3}>
              {Icons.location2}
              <Text size="10px" fw={500} c="#596258">
                {item.location.address}
              </Text>
              <Text size="10px" fw={500} c="#596258">
                {moment(item.datePosted).startOf('day').fromNow()}
              </Text>
            </Group>
          </Group>
        </div>
      </Group>
      <Space h="xs" />

      <Text size="12px" fw={400} c="#596258" lineClamp={3}>
        {item.description}
      </Text>
      <Space h="md" />
      <Group wrap="wrap">

        <span className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">Freelance</span>
        <span className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">Remote</span>
        <span className="inline-flex items-center rounded-0 bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">Intermediate</span>
      </Group>
      <Space h="md" />
      <Text size="20px" fw={400} c="#151F42" >
    
        <NumberFormatter prefix="TZS " value={item.budget} thousandSeparator />
        {/* <span style={{ color: "#C7C7C7" }}>/month</span> */}
      </Text>
      <Space h="md" />
      <Group wrap="wrap" justify="space-between">
        <Group wrap="wrap">

          <Button variant="outline" color="#C7C7C7" bg={"#F9F9F9"} c="black" radius={"4px"} fw={500} w={115}>Detail</Button>
          <Button variant="outline" color="#C7C7C7" bg={"#F9F9F9"} c="black" radius={"4px"} fw={500} >Apply Now</Button>
        </Group>
        <ActionIcon variant="subtle" color="#C7C7C7" size={"md"}>
          {Icons.archive}
        </ActionIcon>
      </Group>

    </Paper>
  ));

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Paper p={"md"} radius={"md"}>
            <Group justify="space-between">
              <Text size="18px" fw={700} c="#040404">
                Filter Job
              </Text>
              <Text size="14px" fw={400} c="#F25454">
                Reset Filter
              </Text>
            </Group>
            <Space h="lg" />
            <div>
              <Group justify="space-between">
                <Text size="16px" fw={500} c="#040404">
                  Job Type
                </Text>
                {Icons.arrow_up}
              </Group>
              <Space h="md" />

              <SimpleGrid cols={2}>
                <Checkbox
                  defaultChecked
                  label="Freelance"
                  color={Color.DarkBlue}
                />
                <Checkbox
                  defaultChecked
                  label="Full Time"
                  color={Color.DarkBlue}
                />
                <Checkbox label="Part Time" color={Color.DarkBlue} />
                <Checkbox
                  defaultChecked
                  label="Contract"
                  color={Color.DarkBlue}
                />
              </SimpleGrid>
            </div>
            <Divider my="lg" />
            <div>
              <Group justify="space-between">
                <Text size="16px" fw={500} c="#040404">
                  Work Type
                </Text>
                {Icons.arrow_up}
              </Group>
              <Space h="md" />

              <SimpleGrid cols={2}>
                <Checkbox label="Onsite" color={Color.DarkBlue} />
                <Checkbox
                  defaultChecked
                  label="Remote"
                  color={Color.DarkBlue}
                />
              </SimpleGrid>
            </div>
            <Divider my="lg" />
            <div>
              <Group justify="space-between">
                <Text size="16px" fw={500} c="#040404">
                  Experience Level
                </Text>
                {Icons.arrow_up}
              </Group>
              <Space h="md" />

              <SimpleGrid cols={2}>
                <Checkbox label="Beginner" color={Color.DarkBlue} />
                <Checkbox
                  defaultChecked
                  label="Intermediate"
                  color={Color.DarkBlue}
                />
                <Checkbox label="Advance" color={Color.DarkBlue} />
                <Checkbox
                  defaultChecked
                  label="Profesional"
                  color={Color.DarkBlue}
                />
              </SimpleGrid>
            </div>
            <Divider my="lg" />
            <div>
              <Group justify="space-between">
                <Text size="16px" fw={500} c="#040404">
                  Budget Range
                </Text>
                {Icons.arrow_up}
              </Group>
              <Space h="md" />

              <SimpleGrid cols={2}>
                <Checkbox label="$0 - $100" color={Color.DarkBlue} />
                <Checkbox label="$100 - $1000" color={Color.DarkBlue} />
                <Checkbox label="$1000 - $2000" color={Color.DarkBlue} />
                <Checkbox label="$2000 - $5000" color={Color.DarkBlue} />
                <Checkbox defaultChecked label="Custom" color={Color.DarkBlue} />

              </SimpleGrid>
              <Space h="md" />

              <RangeSlider color={Color.DarkBlue} minRange={0.2} min={0} max={1} step={0.0005} defaultValue={[0.1245, 0.5535]} />
            </div>
          </Paper>
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
              <Button size="md" variant="filled" color={Color.PrimaryBlue} fw={400}>
                Find Job
              </Button>
            </Group>
          </Paper>
          <Space h="md" />

          <SimpleGrid cols={2}>
            {cards}

          </SimpleGrid>
          <Group justify="flex-center" mt="lg">

          {isLoading && (<Loader color="blue" type="bars" />)}
          </Group>
          <Group justify="flex-center" mt="lg">
            {jobs && (
              <PaginationComponent data={jobs} total={jobs.count} fetchData={fetchJobs} showPageParam={false} />
            )}
          </Group>

        </Grid.Col>
      </Grid>
    </div>
  );
}
