import React from 'react';
import { Group, Avatar, Chip, Text, Stack } from '@osuresearch/ui';
import dayjs from 'dayjs'

export type ProfileProps = {
  node: Annotation;
  showRole?: boolean;
};

export function Profile({ node, showRole }: ProfileProps) {
  // Get the creator's role from the annotation body if we can
  const body = node.body.find((b) => b.type === 'ThreadReply' || b.type === 'Thread') as {
    role: string;
  };
  const role = body ? body.role : '';

  return (
    <Group align="center" gap="xs" fs="sm" w="100%">
      <Avatar
        alt={node.creator.name}
        size={40}
        name={node.creator.name}
        opicUsername={node.creator.nickname}
        style={{
          marginLeft: -36
        }}
      />

      <Stack gap={0} w="100%">
        <Group w="100%" justify="apart">
          <Text fw="bold">
            {node.creator.name}
          </Text>
        </Group>
        <Text fs="xs" c="dark">
          {dayjs(node.created).format('h:mm A MMM D')}
        </Text>
      </Stack>

      {showRole && role && (
      <Chip variant="outline" c="secondary">
        {role}
      </Chip>
      )}
    </Group>
  );
}
