import {
  Group,
  ScrollArea,
  SimpleGrid,
  Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUtilities } from "../../../hooks/utils";
import { useJobServices } from "../services";
import { useJobParameters } from "../stores";
import { IJobPost } from "../types";
import JobCard from "./JobCard";
import { JobCardSkeleton } from "./Loaders";

export default function PostedJobsTab() {
  const parameters = useJobParameters();
  const { getJobs,  } =
    useJobServices();
  const { getFormattedDate } = useUtilities();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Set up Intersection Observer (following NotificationSection pattern)
  const lastJobRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            fetchJobs();
          }
        },
        {
          root: null,
          rootMargin: "100px",
          threshold: 0.1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, lastDoc]
  );


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


  const fetchJobs = () => {
    const params = useJobParameters.getState();
    console.log("Fetching jobs with parameters: 2", params);
    if (isLoading) return;
    console.log("Fetching jobs with parameters: 3", params);

    setIsLoading(true);
    // On initial load, lastDoc is null, so fetch first page
    // On next page, pass direction 'next' and lastDoc
    getJobs(params, lastDoc ? "next" : undefined, lastDoc ?? undefined)
      .then((response) => {
        setIsLoading(false);
        setJobs((prev) => {
          const existingIds = new Set(prev.map((job) => job.id));
          const newJobs = response.data.filter((job) => !existingIds.has(job.id));
          return [...prev, ...newJobs];
        });
        setLastDoc(response.lastDoc ?? null);
        setHasMore(response.data.length > 0 && !!response.lastDoc);
      })
      .catch((error) => {
        console.error("Error fetching filter data:", error);

        setIsLoading(false);
        setHasMore(false);
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

  

  const fetchData = async () => {
    setJobs([]);
    setLastDoc(null);
    setHasMore(true);
    fetchJobs();
  }




  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <JobCardSkeleton key={index} />
  ));
  
  const cards = jobs.map((item, index) => (
    <div
      key={index}
      ref={index === jobs.length - 1 ? lastJobRef : undefined}
    >
      <JobCard job={item} />
    </div>
  ));

  return (
    <div>
      <ScrollArea
        mt={"md"}
        ref={containerRef}
        style={{ height: "calc(100vh - 120px)" }}
        scrollbars="y"
      >
        <SimpleGrid cols={{ sm: 3, xs: 1 }} >
          {cards}
          {isLoading && skeletons}
        </SimpleGrid>
        {!hasMore && !isLoading && (
          <Group justify="center" mt="md">
            <Text c="dimmed" size="md">No more jobs to show</Text>
          </Group>
        )}
      </ScrollArea>
    </div>
  );
}



