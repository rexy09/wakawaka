import { Grid, Group, Paper, Skeleton, Space } from "@mantine/core";



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
