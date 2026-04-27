from playwright.async_api import async_playwright

async def fill_application_form(job_url: str, user_data: dict):
    """
    Placeholder Playwright script for auto-filling application forms (e.g., Workday, Lever).
    user_data should contain name, email, resume_path, etc.
    """
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False) # Headless=False so user can see it
            page = await browser.new_page()
            
            await page.goto(job_url)
            
            # Simple heuristic for common forms (Lever / Greenhouse)
            try:
                # E.g. fill name
                if await page.locator("input[name='name']").count() > 0:
                    await page.locator("input[name='name']").fill(user_data.get("name", ""))
                
                # E.g. fill email
                if await page.locator("input[name='email']").count() > 0:
                    await page.locator("input[name='email']").fill(user_data.get("email", ""))
                
                # E.g. upload resume
                if await page.locator("input[type='file']").count() > 0 and user_data.get("resume_path"):
                    await page.locator("input[type='file']").first.set_input_files(user_data["resume_path"])
                    
                print("Form filled! Waiting for user to click submit.")
                
            except Exception as e:
                print(f"Could not auto-fill this specific form: {e}")
            
            # Keep browser open for User to review (Human in the loop)
            # In a real app, you might wait for a signal or just leave it running
            # await browser.close()
    except Exception as e:
        print(f"Automation error: {e}")
