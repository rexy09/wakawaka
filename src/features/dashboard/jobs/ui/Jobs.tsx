import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Paper,
  RangeSlider,
  SimpleGrid,
  Space,
  Text,
  TextInput
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { PaginationComponent } from "../../../../common/components/PaginationComponent";
import { Icons } from "../../../../common/icons";
import { Color } from "../../../../common/theme";
import { useUtilities } from "../../../hooks/utils";
import JobCard from "../components/JobCard";
import { useJobServices } from "../services";
import { useJobParameters } from "../stores";
import { IJobPost, PaginatedResponse } from "../types";
import { JobCardSkeleton } from "../components/Loaders";

export default function Jobs() {
  const parameters = useJobParameters();
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
    const params = useJobParameters.getState();

    getJobs(params, next, jobs?.lastDoc, jobs?.firstDoc)
      .then((response) => {
        setIsLoading(false);
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

  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <JobCardSkeleton key={index} />
  ));

  const cards = jobs?.data.map((item, index) => (
    <JobCard job={item} key={index} />
  ));

  return (
    <div>
      <Space h="md" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }} visibleFrom="lg">
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
                <Checkbox
                  defaultChecked
                  label="Custom"
                  color={Color.DarkBlue}
                />
              </SimpleGrid>
              <Space h="md" />

              <RangeSlider
                color={Color.DarkBlue}
                minRange={0.2}
                min={0}
                max={1}
                step={0.0005}
                defaultValue={[0.1245, 0.5535]}
              />
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
          <Group justify="flex-end" my="md">
            {jobs && (
              <PaginationComponent
                data={jobs}
                total={jobs.count}
                fetchData={fetchJobs}
                showPageParam={false}
              />
            )}
          </Group>
          <SimpleGrid cols={{ sm: 2, xs: 2 }}>{isLoading ? skeletons : cards}

          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
