from abc import ABC
from typing import List, Optional, Union
from pydantic import BaseModel


class PackReportItem(BaseModel):
    created_at: Optional[str]
    batch_number: Optional[int]
    qr: str
    barcode: str


class MPackReportItem(BaseModel):
    created_at: Optional[str]
    batch_number: Optional[int]
    qr: Optional[str]
    barcode: Optional[str]
    packs: List[PackReportItem] = []


class CubeReportItem(BaseModel):
    created_at: str
    batch_number: int
    qr: Optional[str]
    barcode: Optional[str]
    multipacks_in_cubes: int
    packs_in_multipacks: int
    multipacks: List[MPackReportItem] = []


class ReportRequest(BaseModel):
    report_begin: Optional[str]
    report_end: Optional[str]


class ReportResponse(ReportRequest):
    cubes: List[CubeReportItem] = []
