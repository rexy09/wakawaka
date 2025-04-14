import {  Group, Paper, Skeleton, Space } from "@mantine/core";

export default function JobCardSkeleton() {
    return (
        <Paper p="md" radius="md">
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