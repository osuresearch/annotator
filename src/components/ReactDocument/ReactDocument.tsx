import React from 'react';
import { AnchorsContext, useAnchors } from '../../hooks';
import { Box, Group, Paper, Stack } from '@osuresearch/ui';
import { ActionsSidebar } from '../ActionsSidebar';
import { ThreadList } from '../ThreadList';

export type ReactDocumentProps = {
  children: React.ReactNode
}

export function ReactDocument({ children }: ReactDocumentProps) {
  const ctx = useAnchors();

  return (
    <AnchorsContext.Provider value={ctx}>
      <Group gap={0} id="react-document" ref={ctx.ref}>
        <Box className="rui-relative rui-mr-lg">
          {children}
          <ActionsSidebar />
        </Box>
        <Stack align="stretch" w={400} miw={400} className="threads">
          <ThreadList />
        </Stack>
      </Group>
    </AnchorsContext.Provider>
  )
}
