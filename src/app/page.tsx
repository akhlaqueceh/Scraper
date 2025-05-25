'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} align="center" textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Web Admin Panel
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="600px">
            A powerful cloud-based web admin panel with advanced data scraping capabilities.
            Manage and analyze job listings with ease.
          </Text>
          {status === 'unauthenticated' && (
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => router.push('/login')}
            >
              Get Started
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
} 