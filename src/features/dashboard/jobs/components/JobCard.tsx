import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  NumberFormatter,
  Space,
  Text
} from "@mantine/core";
import moment from "moment";
import { FaImage, FaImages } from "react-icons/fa";
import {
  IoPeople,
  IoPerson,
  IoTimeOutline
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../../common/icons";
import { IJobPost } from "../types";
interface Props {
  job: IJobPost;
}
export default function JobCard({ job }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="group relative mx-auto w-[100%] overflow-hidden rounded-[13px] bg-gray-300 p-[1px] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#151F42] hover:via-[#170645] hover:to-[#044299]">
        <div className="group-hover:animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:visible"></div>

        <div className="relative rounded-[12px] bg-white h-[100%] w-[100%]">
          <Card p={"md"} radius={"12px"} onClick={() => { navigate("/jobs/" + job.id) }} >
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
                <Text size="20px" fw={500} c="#151F42" lineClamp={1} style={{ lineHeight: 1.2 }}>
                  {job.category}
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
            <Space h="xs" />

            <Text size="12px" fw={400} c="#596258" lineClamp={3}>
              {job.description}
            </Text>
            <Space h="md" />
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
            <Space h="md" />
            <Text size="20px" fw={400} c="#151F42">
              <NumberFormatter prefix="TZS " value={job.budget} thousandSeparator />
              {/* <span style={{ color: "#C7C7C7" }}>/month</span> */}
            </Text>
            <Space h="md" />
            <Group wrap="nowrap" justify="space-between">
              <Group wrap="wrap">
                <Button
                  variant="outline"
                  color="#C7C7C7"
                  bg={"#F9F9F9"}
                  c="black"
                  radius={"4px"}
                  fw={500}
                  w={115}
                  onClick={() => { navigate("/jobs/" + job.id) }}
                >
                  Detail
                </Button>
              </Group>
              <Group wrap="wrap">
                {job.imageUrls.length > 0 && (
                  <div className="inline-flex items-center rounded-sm bg-gray-50 px-3 py-2 text-xs font-medium text-[#151F42] ring-0 ring-gray-500/10 ring-inset">
                    <span className="mr-1 text-sm">{job.imageUrls.length}</span>
                    {job.imageUrls.length > 1 ? <FaImages /> : <FaImage />}
                  </div>
                )}
                <ActionIcon variant="subtle" color="#C7C7C7" size={"md"}>
                  {Icons.archive}
                </ActionIcon>
              </Group>
            </Group>
          </Card>

        </div>

      </div>

     

    </>
  );
}

