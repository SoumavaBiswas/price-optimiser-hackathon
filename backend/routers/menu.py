from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from models.menu import MenuItem
from schemas.menu import MenuCreate, MenuResponse
from services.menu_optimizer import run_menu_pricing_for_date
from database.config import get_db
from models.user import User
from utils.dependencies import get_current_user, has_role
from typing import List

router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/", response_model=MenuResponse, dependencies=[Depends(has_role(["admin", "supplier"]))])
async def create_menu_item(
    menu: MenuCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Call optimizer service
        optimized_result = run_menu_pricing_for_date(
            target_date=menu.date.isoformat(),
            csv_path="backend/booking_metadata.csv",
            menu_items=[menu.dict()]
        )[0]

        db_item = MenuItem(
            name=menu.name,
            meal_type=menu.meal_type,
            base_price=menu.base_price,
            optimized_price=optimized_result["optimized_price"],
            expected_demand=optimized_result["expected_demand"],
            revenue=optimized_result["revenue"],
            date=menu.date,
            supplier_id=current_user.id
        )

        db.add(db_item)
        await db.commit()
        await db.refresh(db_item)
        return db_item

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[MenuResponse], dependencies=[Depends(has_role(["admin", "supplier"]))])
async def list_menu_items(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(MenuItem))
    return result.scalars().all()

