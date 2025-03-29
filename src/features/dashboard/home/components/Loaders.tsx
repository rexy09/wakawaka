import { Paper, Group, Space, Skeleton, Flex, Grid } from "@mantine/core";

export  function OrderStatisticCardSkeleton() {
    return (
        <Paper
            p="20px"
            radius="10px"
            style={{ border: "2px solid #1A2F570F" }}
        >
            <Flex gap="xs" align="flex-start" direction="row">
                <div
                    style={{
                        border: "1px solid #292D3214",
                        borderRadius: "8px",
                        padding: 10,
                        width: "40px",
                        height: "40px",
                    }}
                >
                    <Skeleton circle height={20} width={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <Group justify="flex-start" align="flex-start">
                        <Skeleton height={14} width={80} />
                        <Skeleton height={14} width={14} circle />
                    </Group>
                    <Space h="sm" />
                    <Skeleton height={26} width={50} />
                    <Space h="sm" />
                    <Group>
                        <Skeleton height={14} width={60} />
                        <div
                            className="py-[2px] px-2"
                            style={{
                                borderRadius: "38px",
                                backgroundColor: "#E0E0E0", // Neutral background for skeleton
                                padding: "4px 8px",
                            }}
                        >
                            <Group gap={2}>
                                <Skeleton height={12} width={30} />
                                <Skeleton height={12} width={12} circle />
                            </Group>
                        </div>
                    </Group>
                </div>
            </Flex>
        </Paper>
    );
}


export const MapSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-gray-300"></div>
            <div className="h-4 w-20 rounded bg-gray-300"></div>
        </div>
        <div className="h-[400px] w-full rounded-lg bg-gray-300"></div>
        <div className="space-y-2">
            <div className="h-10 rounded bg-gray-300"></div>
            <div className="h-10 rounded bg-gray-200"></div>
        </div>
    </div>
);

export const OrderSkeleton = () => (
    <Paper p="md" mb="sm" radius="10px" w="100%" withBorder>
        <Group justify="space-between">
            <div>
                <Skeleton height={14} width={100} />
                <Space h="xs" />
                <Skeleton height={18} width={150} />
            </div>
            <Group>
                <Skeleton height={49} width={49}  />
                <div>
                    <Skeleton height={18} width={100} />
                    <Space h="xs" />
                    <Skeleton height={12} width={80} />
                </div>
            </Group>
        </Group>
        <Space h="xs" />
        <Grid>
            <Grid.Col span={6}>
                <Skeleton height={12} width="80%" />
            </Grid.Col>
            <Grid.Col span={6}>
                <Skeleton height={12} width="80%" />
            </Grid.Col>
        </Grid>
    </Paper>
);
