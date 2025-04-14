import { Group, Pagination, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Color } from "../theme";
import { PaginatedResponse } from "../../features/dashboard/jobs/types";

interface Props {
    data: PaginatedResponse<any>;
    total: number;
    showPageParam?: boolean;
    fetchData: (next?: any) => void;
}

export function PaginationComponent({
    data,
    total,
    fetchData,
    showPageParam,
}: Props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);
    const limit = 6;

    const totalPages = Math.ceil(total / limit);
    const message = `Showing ${limit * (page - 1) + 1} – ${Math.min(
        total,
        limit * page
    )} of ${total}`;

    useEffect(() => {
        if (showPageParam) {
            if (searchParams.get("page")) {
                setPage(Number(searchParams.get("page")));
            } else {
                setPage(1);
            }
        }
    }, [data]);

    return (
        <Group justify="flex-end">
            <Text size="sm">{message}</Text>
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
                total={totalPages}
                value={page}
                withPages={false}
                onChange={(value: number) => {
                    console.log("value", value);
                    console.log("page", page);
                    if (value == 1) {
                        fetchData();
                    } else if (value > page) {
                        fetchData("next");
                    } else if (value < page) {
                        fetchData("prev");
                    }
                    setPage(value);
                    if (showPageParam) {
                        if (value == 1) {
                            searchParams.delete("page");
                        } else {
                            searchParams.set("page", value.toString());
                        }
                        setSearchParams(searchParams);
                    }
                    // fetchData ? fetchData() : null;
                }}
            />
        </Group>
    );
}
