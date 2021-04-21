from datetime import datetime, timedelta
from typing import List, Optional

from app.models.event import Event, EventFilters, EventType
from app.utils.naive_current_datetime import get_naive_datetime
from odmantic import ObjectId

from .engine import engine
from .system_settings import get_system_settings


async def add_events(event_type: EventType,
                     message: str,
                     time: Optional[datetime] = None,
                     camera_numbers: Optional[List[int]] = None,
                     processed: Optional[bool] = False) -> List[Event]:
    if not time:
        time = await get_naive_datetime()

    settings = await get_system_settings()

    event_list = []

    if event_type == EventType.DESYNC:
        camera_numbers = settings.general_settings.camera_list.value

    if camera_numbers:
        delta = settings.general_settings.video_time_delta.value
        lower_bound = time - timedelta(seconds=delta)
        upper_bound = time + timedelta(seconds=delta)

        for camera in camera_numbers:
            lower_event = Event(time=time,
                                message=message,
                                time_on_video=lower_bound,
                                camera_number=camera,
                                event_type=event_type)

            upper_event = Event(time=time,
                                message=message,
                                time_on_video=upper_bound,
                                camera_number=camera,
                                event_type=event_type)

            event_list.append(lower_event)
            event_list.append(upper_event)

    else:
        event = Event(time=time,
                      event_type=event_type,
                      processed=processed,
                      message=message)
        event_list.append(event)

    return await engine.save_all(event_list)


async def mark_event_processed(id: ObjectId) -> Event:
    event = await engine.find_one(Event, Event.id == id)
    event.processed = True
    return await engine.save(event)


async def get_events(filters: EventFilters) -> List[Event]:

    if filters.event_type and filters.processed is not None:
        return await engine.find(Event, Event.event_type == filters.event_type,
                                 Event.processed == filters.processed)

    elif filters.event_type:
        return await engine.find(Event, Event.event_type == filters.event_type)

    elif filters.processed is not None:
        return await engine.find(Event, Event.processed == filters.processed)

    else:
        return await engine.find(Event)
