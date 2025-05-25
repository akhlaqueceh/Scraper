'use client';

import {
  Box,
  Flex,
  Button,
  Text,
  useColorModeValue,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  CloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <Box
      bg={bgColor}
      px={4}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Link href="/dashboard">
            <Text fontSize="xl" fontWeight="bold">
              Web Admin Panel
            </Text>
          </Link>
        </HStack>
        <Flex alignItems="center">
          {status === 'authenticated' ? (
            <HStack spacing={4}>
              <Text>{session.user?.email}</Text>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box
          pb={4}
          display={{ md: 'none' }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bg={bgColor}
          zIndex={20}
          h="100vh"
        >
          <Flex h={16} alignItems="center" justifyContent="space-between" px={4}>
            <Text fontSize="xl" fontWeight="bold">
              Web Admin Panel
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          <VStack spacing={4} px={4}>
            {status === 'authenticated' ? (
              <>
                <Text>{session.user?.email}</Text>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={handleLogout}
                  w="full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                colorScheme="blue"
                onClick={() => router.push('/login')}
                w="full"
              >
                Login
              </Button>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
} 