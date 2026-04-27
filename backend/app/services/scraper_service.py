import asyncio
from playwright.async_api import async_playwright
from datetime import datetime, timedelta

async def scrape_linkedin_jobs(keywords: list[str], location: str):
    """
    Placeholder Playwright script for scraping LinkedIn.
    In a real scenario, this requires handling cookies/login to bypass auth walls.
    """
    jobs = []
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # This is a placeholder URL for LinkedIn Jobs search
            query = "%20".join(keywords)
            url = f"https://www.linkedin.com/jobs/search/?keywords={query}&location={location}"
            
            await page.goto(url)
            # await page.wait_for_selector(".job-search-card")
            
            # Mock extracted data
            jobs.append({
                "company_name": "Tech Corp GmbH",
                "role": "Senior Full Stack Engineer",
                "job_link": "https://linkedin.com/jobs/view/123",
                "location": location,
                "description": "Looking for a React and .Net developer fluent in German.",
                "posted_at": datetime.now() - timedelta(hours=5)
            })
            
            await browser.close()
    except Exception as e:
        print(f"Scraping error: {e}")
        
    return jobs

def filter_last_24h(jobs: list[dict]) -> list[dict]:
    """Filters jobs that were posted in the last 24 hours."""
    now = datetime.now()
    twenty_four_hours_ago = now - timedelta(hours=24)
    return [job for job in jobs if job.get("posted_at") and job["posted_at"] >= twenty_four_hours_ago]
