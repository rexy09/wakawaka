import {
  Center,
  Paper,
  SimpleGrid, Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import JobCard from "../../jobs/components/JobCard";
import { JobCardSkeleton } from "../../jobs/components/Loaders";
import { useJobServices } from "../../jobs/services";
import { IJobPost, PaginatedResponse } from "../../jobs/types";

export default function ExploreSection() {
  const { getExploreJobs } = useJobServices();
  const [jobs, setJobs] = useState<PaginatedResponse<IJobPost>>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = (next?: string) => {
    setIsLoading(true);

    getExploreJobs(next, jobs?.lastDoc, jobs?.firstDoc)
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

    fetchJobs();
  }, []);

  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <JobCardSkeleton key={index} />
  ));
  
  const cards = jobs?.data.map((item, index) => (
    <JobCard job={item} key={index} />
  ));

  return (
    <div>
      <SimpleGrid cols={{ sm: 4, xs: 2 }}>{isLoading ? skeletons : cards}
<Paper
  radius="0"
  style={{
    background: "linear-gradient(180deg, #26366F 0%, #4968D5 100%)",
  }}
>
  <Center h={"100%"} >

   <Text c="white" size="23px" fw={700} >
            Explore more
          </Text>
  </Center>
</Paper>

      </SimpleGrid>


    </div>
  );
}
