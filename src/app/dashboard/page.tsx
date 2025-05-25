'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Heading,
  Spinner,
  Input,
  HStack,
  Text,
  Select,
  Flex,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  url: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [sort, setSort] = useState('-postedDate');
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchJobs();
  }, [page, search, sort]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`/api/jobs?page=${page}&search=${search}&sort=${sort}`);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      toast({
        title: 'Error fetching jobs',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      await axios.post('/api/scrape');
      await fetchJobs();
      toast({
        title: 'Jobs scraped successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error scraping jobs',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setScraping(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="calc(100vh - 64px)">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto">
      <Box mb={8}>
        <Heading mb={4}>Job Listings Dashboard</Heading>
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
          <form onSubmit={handleSearch}>
            <HStack>
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                w="300px"
              />
              <Button type="submit" colorScheme="blue">
                Search
              </Button>
            </HStack>
          </form>
          <Button
            colorScheme="blue"
            onClick={handleScrape}
            isLoading={scraping}
            loadingText="Scraping..."
          >
            Scrape Now
          </Button>
        </Flex>
        <HStack mb={4}>
          <Text>Sort by:</Text>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            w="200px"
          >
            <option value="-postedDate">Newest First</option>
            <option value="postedDate">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="-title">Title Z-A</option>
          </Select>
        </HStack>
      </Box>

      <Box overflowX="auto" bg="white" borderRadius="lg" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Company</Th>
              <Th>Location</Th>
              <Th>Posted Date</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => (
              <Tr key={job._id}>
                <Td>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                    {job.title}
                  </a>
                </Td>
                <Td>{job.company}</Td>
                <Td>{job.location}</Td>
                <Td>{new Date(job.postedDate).toLocaleDateString()}</Td>
                <Td>{job.description.substring(0, 100)}...</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="center" mt={4}>
        <HStack spacing={2}>
          <Button
            onClick={() => setPage(page - 1)}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Text>
            Page {page} of {pagination.pages}
          </Text>
          <Button
            onClick={() => setPage(page + 1)}
            isDisabled={page === pagination.pages}
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
} 