import React from 'react';
import { Group, Avatar, Chip, Text } from '@osuresearch/ui';

export type ProfileProps = {
  node: Annotation;
  showRole?: boolean;
};

export function Profile({ node, showRole }: ProfileProps) {
  // Get the creator's role from the annotation body if we can
  const body = node.body.find((b) => b.type === 'RippleReply' || b.type === 'RippleThread') as {
    role: string;
  };
  const role = body ? body.role : '';

  return (
    <Group align="center" gap="xxs">
      <Avatar
        alt={node.creator.name}
        size={24}
        name={node.creator.name}
        opicUsername={node.creator.nickname}
        style={{
          marginLeft: -28
        }}
      />

      <Text fw="bold" fs="sm">
        {node.creator.name}
      </Text>

      {showRole && role && (
        <Chip variant="outline" c="blue">
          {role}
        </Chip>
      )}
    </Group>
  );
}
