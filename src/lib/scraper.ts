import puppeteer from 'puppeteer';
import { adminDb } from './firebase-admin';

export async function scrapeJobs() {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.indeed.com/jobs?q=software+developer&l=remote', {
      waitUntil: 'networkidle0',
    });

    // Wait for job cards to load
    await page.waitForSelector('.job_seen_beacon');

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job_seen_beacon');
      return Array.from(jobCards).map((card) => {
        const titleElement = card.querySelector('.jobTitle');
        const companyElement = card.querySelector('.companyName');
        const locationElement = card.querySelector('.companyLocation');
        const descriptionElement = card.querySelector('.job-snippet');
        const urlElement = card.querySelector('a.jcs-JobTitle');

        return {
          title: titleElement?.textContent?.trim() || '',
          company: companyElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || '',
          url: urlElement?.getAttribute('href') || '',
          postedDate: new Date().toISOString(),
        };
      });
    });

    // Save jobs to Firebase
    const batch = adminDb.batch();
    jobs.forEach((job) => {
      const docRef = adminDb.collection('jobs').doc();
      batch.set(docRef, job);
    });
    await batch.commit();

    return jobs;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
} 