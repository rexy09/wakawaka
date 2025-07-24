import {
  Box,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Color } from "../../theme";
import "./table.css";

interface TableProps {
  columns: React.ReactNode;
  summary?: JSX.Element;
  rows: JSX.Element[];
  title?: string;
  subtitle?: string;
  colSpan: number;
  totalData: number;
  isLoading: boolean;
  showPagination?: boolean;
  showPageParam?: boolean;
  fetchData?: (offset: number) => void;
  downloadData?: () => void;
  downloading?: boolean;
  exporData?: boolean;
}

export function CustomTable({
  rows,
  columns,
  colSpan,
  isLoading,
  totalData,
  fetchData,
  showPagination,
  showPageParam,
  title,
  subtitle,
  summary,
}: TableProps) {
  const totalPages = () => Math.ceil(totalData / 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setPage] = useState<number>(1);
  useEffect(() => {
    if (showPageParam) {
      if (searchParams.get("page")) {
        setPage(Number(searchParams.get("page")));
      } else {
        setPage(1);
      }
    }
  }, [rows]);

  return (
    <Card
      radius="md"
      p={0}
      withBorder
      style={{ border: `1px solid ${Color.Border}` }}
    >
      {(title != null || subtitle != null || summary != null) && (
        <Box p={"lg"}>
          <Group justify="space-between">
            <Group>
              {/* <div
                style={{
                  border: "1px solid #292D3214",
                  borderRadius: "8px",
                  padding: 10,
                  width: "40px",
                  height: "40px",
                }}
              >
                {Icons.box2}
              </div> */}
              <div>
                <Text fz="18px" fw={500} c={Color.TextTitle}>
                  {title}
                </Text>
                <Text fz="14px" fw={500} c={"#13131399"}>
                  {subtitle}
                </Text>
              </div>
            </Group>
            <Group>{summary}</Group>
          </Group>
        </Box>
      )}
      <ScrollArea
        p={"10px"}
        style={{
          background: "#ffffff",
          borderRadius: "7px",
        }}
      >
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" fz="xs">
            <Table.Thead>{columns}</Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={colSpan}>
                    <Center maw={400} h={100} mx="auto">
                      <Loader variant="dots" />
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={colSpan}>
                    <Text fw={400} ta="center">
                      Nothing found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
          {/* </div> */}
        </Table.ScrollContainer>
        {showPagination ? (
          <Group justify="flex-start">
            <Pagination
              size="sm"
              style={() => ({
                control: {
                  "&[data-active]": {
                    backgroundColor: Color.PrimaryBlue,
                    border: 0,
                  },
                },
              })}
              value={showPageParam ? activePage : undefined}
              total={totalPages()}
              onChange={(value: number) => {
                if (showPageParam) {
                  if (value == 1) {   
                    searchParams.delete("page");
                  } else {
                    searchParams.set("page", value.toString());
                  }
                  setSearchParams(searchParams);
                }
                fetchData ? fetchData(value) : null;
              }}
              radius="md"
            />{" "}
            <Text fw={500} fz="14px">
              Total Count: {totalData}
            </Text>
          </Group>
        ) : null}
      </ScrollArea>
    </Card>
  );
}
