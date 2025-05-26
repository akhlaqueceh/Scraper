import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.goto('https://www.indeed.com/jobs?q=software+engineer&l=remote');

    // Wait for job listings to load
    await page.waitForSelector('.job_seen_beacon');

    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.job_seen_beacon');
      return Array.from(jobElements).map((job) => {
        const titleElement = job.querySelector('.jobTitle');
        const companyElement = job.querySelector('.companyName');
        const locationElement = job.querySelector('.companyLocation');
        const descriptionElement = job.querySelector('.job-snippet');
        const urlElement = job.querySelector('a.jcs-JobTitle');

        let url = urlElement?.getAttribute('href') || '';
        // If the URL is relative, prepend the Indeed domain
        if (url && url.startsWith('/')) {
          url = 'https://www.indeed.com' + url;
        }

        return {
          title: titleElement?.textContent?.trim() || '',
          company: companyElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || '',
          url,
          postedDate: new Date().toISOString(),
          source: 'Indeed',
        };
      });
    });

    await browser.close();

    // Save jobs to Firestore
    const jobsRef = collection(db, 'jobs');
    let savedCount = 0;

    for (const job of jobs) {
      // Check if job already exists
      const q = query(jobsRef, where('url', '==', job.url));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new job document
        const newJobRef = doc(jobsRef);
        await setDoc(newJobRef, {
          ...job,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        savedCount++;
      }
    }

    return NextResponse.json({ 
      message: 'Jobs scraped successfully', 
      count: savedCount 
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape jobs' },
      { status: 500 }
    );
  }
} 