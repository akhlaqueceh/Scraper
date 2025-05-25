'use client';

import { Box } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  );
} 