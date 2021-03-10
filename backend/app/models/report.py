from typing import List, Optional
from .production_batch import ProductionBatchNumber
from datetime import datetime
from pydantic import BaseModel
from .model_config import ModelConfig


class PackReportItem(BaseModel):
    created_at: Optional[datetime]
    qr: str
    barcode: str

    Config = ModelConfig


class MPackReportItem(BaseModel):
    created_at: Optional[datetime]
    qr: Optional[str]
    barcode: Optional[str]
    packs: List[PackReportItem] = []

    Config = ModelConfig


class CubeReportItem(BaseModel):
    created_at: datetime
    batch_number: ProductionBatchNumber
    qr: Optional[str]
    barcode: Optional[str]
    multipacks_in_cubes: int
    packs_in_multipacks: int
    multipacks: List[MPackReportItem] = []

    Config = ModelConfig


class ReportRequest(BaseModel):
    report_begin: Optional[datetime]
    report_end: Optional[datetime]

    Config = ModelConfig


class ReportResponse(ReportRequest):
    cubes: List[CubeReportItem] = []
