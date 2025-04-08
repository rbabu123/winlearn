from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from pytz import timezone
import datetime
import asyncio
import httpx

# Create the scheduler
scheduler = BackgroundScheduler()

def scheduled_task():
    now = datetime.datetime.now(timezone("Asia/Kolkata"))
    print(f"Executing Scheduled Tasks : {now.strftime('%Y-%m-%d %H:%M:%S')} IST")

    async def call_api():
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post("http://127.0.0.1:8000/api/courses/send_overdue_course_email")
                response.raise_for_status()
                print(f"Triggered overdue email task. Response: {response.json()}")
        except httpx.HTTPStatusError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except httpx.RequestError as req_err:
            print(f"Request error occurred: {req_err}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
        else:
            print("✅ Sent Overdue Emails Successfully!")

    asyncio.run(call_api())

# Start the scheduler
def start_scheduler():
    scheduler.add_job(scheduled_task, CronTrigger(hour=10, minute=00, timezone="Asia/Kolkata"))
    scheduler.start()
    print("Scheduler started...")

# Stop the scheduler
def stop_scheduler():
    scheduler.shutdown()
    print("Scheduler stopped...")
