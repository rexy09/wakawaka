import {
  Center,
  Paper,
  SimpleGrid, Stack, Text,
  UnstyledButton
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import JobCard from "../../jobs/components/JobCard";
import { JobCardSkeleton } from "../../jobs/components/Loaders";
import { useJobServices } from "../../jobs/services";
import { IJobPost, PaginatedResponse } from "../../jobs/types";
import { useNavigate } from "react-router-dom";

export default function ExploreSection() {
  const { getExploreJobs } = useJobServices();
  const [jobs, setJobs] = useState<PaginatedResponse<IJobPost>>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = (next?: string) => {
    setIsLoading(true);

    getExploreJobs(next, jobs?.lastDoc, jobs?.firstDoc)
      .then((response) => {
        setIsLoading(false);
        setJobs(response);
      })
      .catch((_error) => {
        console.log("Error fetching jobs:", _error);

        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Something went wrong!",
        });
      });
  };




  useEffect(() => {

    fetchJobs();
  }, []);

  const skeletons = Array.from({ length: 3 }, (_, index) => (
    <JobCardSkeleton key={index} />
  ));

  const cards = jobs?.data.map((item, index) => (
    <JobCard job={item} key={index} />
  ));

  return (
    <div>
      <SimpleGrid cols={{ sm: 2, md: 4, xs: 2 }}>{isLoading ? skeletons : cards}
        <Paper
          radius="0"
          style={{
            background: "linear-gradient(180deg, #26366F 0%, #4968D5 100%)",
          }}
          mih={240}
        >

          <Stack h={"100%"} justify="center" >
          <UnstyledButton onClick={() => navigate("jobs")} >
            <Text c="white" size="23px" fw={700} ta={"center"} >
              Explore more
            </Text>
            <Center ml={10} >
              <FaArrowRight color="#ffffff" />
            </Center>
          </UnstyledButton>
          </Stack>
        </Paper>

      </SimpleGrid>


    </div>
  );
}
