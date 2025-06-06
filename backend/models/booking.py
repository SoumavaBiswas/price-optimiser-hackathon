# models/booking.py

from sqlalchemy import Column, String, Date, Integer
from database.config  import Base  # wherever Base is declared

class BookingMetadata(Base):
    __tablename__ = "booking_metadata"

    booking_id = Column(String, primary_key=True)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    guest_count = Column(Integer, nullable=False)
    room_number = Column(String, nullable=False)
