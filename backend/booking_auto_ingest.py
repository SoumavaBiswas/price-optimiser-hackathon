# ingest_bookings_async.py

import pandas as pd
import asyncio
from datetime import datetime
from models.booking import BookingMetadata
from database.config import get_db, Base, engine

async def ingest_bookings(csv_path: str):
    df = pd.read_csv(csv_path, parse_dates=["check_in_date", "check_out_date"])

    # Convert DataFrame rows to ORM model instances
    bookings = [
        BookingMetadata(
            booking_id=row["booking_id"],
            check_in_date=row["check_in_date"].date(),
            check_out_date=row["check_out_date"].date(),
            guest_count=int(row["guest_count"]),
            room_number=str(row["room_number"])
        )
        for _, row in df.iterrows()
    ]

    async for session in get_db():
        async with session.begin():
            session.add_all(bookings)

    print("✅ Async ingestion complete.")

async def setup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        # If there's already a running loop (e.g., in Jupyter or a threaded server)
        task = loop.create_task(ingest_bookings("booking_metadata.csv"))
        loop.run_until_complete(task)
    else:
        asyncio.run(ingest_bookings("booking_metadata.csv"))

