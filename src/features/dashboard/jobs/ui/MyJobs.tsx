import {
  Group,
  Space,
  Tabs,
  Text
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppliedJobsTab from "../components/AppliedJobsTab";
import PostedJobsTab from "../components/PostedJobsTab";
import SavedJobsTab from "../components/SavedJobsTab";

export default function MyJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("applied");

  const tabs = [
    { id: "applied", label: "Applied" },
    { id: "saved", label: "Saved" },
    { id: "posted", label: "Posted" },
  ];

  // Initialize tab from URL params on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };


  return (
    <div>
      <Space h="md" />
      <Text fw={600} fz={40}>
        My Jobs
      </Text>
      <Text fw={400} fz={21} c={"#7F7D7D"}>
        Here are the jobs you’ve applied for- good luck!
      </Text>
      <Space h="md" />
      <Group justify="end">
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

      <Tabs value={activeTab} keepMounted={false}>
        <Tabs.Panel value="applied">
          <AppliedJobsTab />
        </Tabs.Panel>
        <Tabs.Panel value="saved">
          <SavedJobsTab />
        </Tabs.Panel>
        <Tabs.Panel value="posted">
          <PostedJobsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
