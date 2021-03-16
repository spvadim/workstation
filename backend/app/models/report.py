from typing import List, Optional
from .production_batch import ProductionBatchNumber
from datetime import datetime
from pydantic import BaseModel
from .model_config import ReportModelConfig


class PackReportItem(BaseModel):
    created_at: datetime
    qr: str
    barcode: str

    Config = ReportModelConfig


class MPackReportItem(BaseModel):
    created_at: datetime
    qr: Optional[str]
    barcode: Optional[str]
    packs: List[PackReportItem] = []

    Config = ReportModelConfig


class CubeReportItem(BaseModel):
    created_at: datetime
    batch_number: ProductionBatchNumber
    qr: Optional[str]
    barcode: Optional[str]
    multipacks_in_cubes: int
    packs_in_multipacks: int
    multipacks: List[MPackReportItem] = []

    Config = ReportModelConfig


class ReportRequest(BaseModel):
    report_begin: datetime
    report_end: datetime

    Config = ReportModelConfig


class ReportResponse(ReportRequest):
    cubes: List[CubeReportItem] = []
