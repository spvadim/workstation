from typing import List, Optional
from .production_batch import ProductionBatchNumber
from datetime import datetime
from pydantic import BaseModel


class PackReportItem(BaseModel):
    created_at: Optional[datetime]
    batch_number: Optional[ProductionBatchNumber]
    qr: str
    barcode: str

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%Y %H:%M")}


class MPackReportItem(BaseModel):
    created_at: Optional[datetime]
    batch_number: Optional[ProductionBatchNumber]
    qr: Optional[str]
    barcode: Optional[str]
    packs: List[PackReportItem] = []

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%Y %H:%M")}


class CubeReportItem(BaseModel):
    created_at: datetime
    batch_number: ProductionBatchNumber
    qr: Optional[str]
    barcode: Optional[str]
    multipacks_in_cubes: int
    packs_in_multipacks: int
    multipacks: List[MPackReportItem] = []

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%Y %H:%M")}


class ReportRequest(BaseModel):
    report_begin: Optional[datetime]
    report_end: Optional[datetime]

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%Y %H:%M")}


class ReportResponse(ReportRequest):
    cubes: List[CubeReportItem] = []
