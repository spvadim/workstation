from typing import List

from fastapi import APIRouter, Depends
from fastapi_versioning import version
from odmantic import ObjectId

from ..db.events import add_events, get_events, mark_event_processed
from ..models.event import (
    Event,
    EventFilters,
    EventOutput,
    EventsOutput,
    InterventionEventInput,
)
from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@light_logger_router.get("/events", response_model=EventsOutput)
@version(1, 0)
async def list_events(filters: EventFilters = Depends()) -> EventsOutput:
    return await get_events(filters=filters)


@deep_logger_router.put("/events", response_model=List[EventOutput])
@version(1, 0)
async def add_manual_intervention_event(event: InterventionEventInput) -> List[Event]:
    return await add_events(
        "manual_intervention", event.message, camera_numbers=[event.camera_number]
    )


@deep_logger_router.patch("/events/{id}", response_model=EventOutput)
@version(1, 0)
async def process_event(id: ObjectId) -> Event:
    return await mark_event_processed(id)
