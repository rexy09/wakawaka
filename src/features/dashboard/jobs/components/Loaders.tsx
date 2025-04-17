import {  Card, Group, Paper, SimpleGrid, Skeleton, Space, Stack } from "@mantine/core";

export  function JobCardSkeleton() {
    return (
        <Paper p="md" radius="12px">
            <Group wrap="nowrap">
                <Skeleton width={50} height={50} radius="sm" />
                <div style={{ flex: 1 }}>
                    <Skeleton height={20} width="60%" />
                    <Space h="xs" />
                    <Group wrap="nowrap" gap={10}>
                        <Skeleton height={10} width="20%" />
                        <Skeleton height={10} width="30%" />
                        <Skeleton height={10} width="25%" />
                    </Group>
                </div>
            </Group>
            <Space h="xs" />
            <Skeleton height={36} width="100%" />
            <Space h="md" />
            <Group wrap="wrap" gap={8}>
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={80} />
            </Group>
            <Space h="md" />
            <Skeleton height={20} width="30%" />
            <Space h="md" />
            <Group wrap="wrap" justify="space-between">
                <Group wrap="wrap" gap={8}>
                    <Skeleton height={32} width={115} radius={4} />
                    {/* <Skeleton height={32} width={115} radius={4} /> */}
                </Group>
                <Skeleton height={32} width={32} radius={4} />
            </Group>
        </Paper>
    );
}

export  function JobDetailsCardSkeleton() {
    return (
        <Card p="md" radius="md" withBorder>
            <Stack>
                {/* Header: Avatar, User Details, and Actions */}
                <Group wrap="nowrap" justify="space-between">
                    <Group wrap="nowrap">
                        <Skeleton circle height={50} radius="sm" />
                        <Stack gap={0}>
                            <Skeleton height={20} width={120} mt={6} />
                            <Space h="xs" />
                            <Group wrap="nowrap" gap={10}>
                                <Skeleton height={12} width={60} />
                                <Skeleton height={12} width={80} />
                                <Skeleton height={12} width={60} />
                            </Group>
                        </Stack>
                    </Group>
                    <Group>
                        <Skeleton height={28} width={80} radius={4} />
                        <Skeleton circle height={36} />
                    </Group>
                </Group>

                {/* Job Category */}
                <Space h="xs" />
                <Skeleton height={28} width={150} />

                {/* Tags */}
                <Space h="xs" />
                <Group wrap="wrap" gap={8}>
                    <Skeleton height={28} width={80} radius={0} />
                    <Skeleton height={28} width={80} radius={0} />
                    <Skeleton height={28} width={60} radius={0} />
                </Group>

                {/* Description */}
                <Space h="xs" />
                <Stack gap={4}>
                    <Skeleton height={14} width="100%" />
                    <Skeleton height={14} width="80%" />
                    <Skeleton height={14} width="60%" />
                </Stack>

                {/* Budget */}
                <Space h="md" />
                <Skeleton height={24} width={100} />

                {/* Images */}
                <Space h="lg" />
                <SimpleGrid cols={4}>
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} height={150} radius="md" />
                    ))}
                </SimpleGrid>
            </Stack>
        </Card>
    );
};

 