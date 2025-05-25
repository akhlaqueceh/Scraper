import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '-postedDate';

    const jobsRef = collection(db, 'jobs');
    let q = query(jobsRef);

    // Apply search if provided
    if (search) {
      q = query(
        jobsRef,
        where('title', '>=', search),
        where('title', '<=', search + '\uf8ff')
      );
    }

    // Apply sorting
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
    q = query(q, orderBy(sortField, sortDirection));

    // Apply pagination
    const startAt = (page - 1) * pageSize;
    q = query(q, limit(pageSize));

    if (startAt > 0) {
      // Get the last document from the previous page
      const previousPageQuery = query(
        jobsRef,
        orderBy(sortField, sortDirection),
        limit(startAt)
      );
      const previousPageSnapshot = await getDocs(previousPageQuery);
      const lastDoc = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const jobs = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));

    // Get total count
    const totalSnapshot = await getDocs(jobsRef);
    const total = totalSnapshot.size;

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 