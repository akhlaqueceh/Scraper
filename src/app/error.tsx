'use client';

import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      p={4}
    >
      <Heading mb={4}>Something went wrong!</Heading>
      <Text mb={4}>{error.message}</Text>
      <Button colorScheme="blue" onClick={reset}>
        Try again
      </Button>
    </Box>
  );
} 