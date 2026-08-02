# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, UniqueConstraint, Boolean
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
# pyrefly: ignore [missing-import]
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(256), nullable=False)
    full_name = Column(String(256), nullable=True)
    bio = Column(String(512), nullable=True)

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    symbol = Column(String(100), nullable=False, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(String(50), nullable=False, default="active")

class SavedConcallSummary(Base):
    __tablename__ = "saved_concall_summaries"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(100), nullable=False, index=True)
    concall_period = Column(String(100), nullable=True)
    ppt_url = Column(String(512), nullable=True)
    summary_data = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# --- Corporate Financial Intelligence 7-Table Schema ---

class CorporateReport(Base):
    __tablename__ = "corporate_reports"

    report_id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False)
    sector = Column(String(50), nullable=True)
    fiscal_year = Column(String(10), nullable=False)
    quarter = Column(String(5), nullable=False)
    report_date = Column(DateTime, nullable=True)
    currency = Column(String(10), default="INR")
    unit = Column(String(20), default="crore")
    source_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint('company_name', 'fiscal_year', 'quarter', name='_company_fy_q_uc'),)

    financials = relationship("CorporateFinancial", back_populates="report", cascade="all, delete-orphan")
    segments = relationship("BusinessUnitSegment", back_populates="report", cascade="all, delete-orphan")
    operational_metrics = relationship("OperationalMetric", back_populates="report", cascade="all, delete-orphan")
    events = relationship("StrategicEvent", back_populates="report", cascade="all, delete-orphan")
    esg_metrics = relationship("EsgMetric", back_populates="report", cascade="all, delete-orphan")
    text_chunks = relationship("DocumentTextChunk", back_populates="report", cascade="all, delete-orphan")


class CorporateFinancial(Base):
    __tablename__ = "corporate_financials"

    financial_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    statement_scope = Column(String(50), default="Consolidated")
    total_revenue = Column(Float, nullable=True)
    net_interest_income = Column(Float, nullable=True)
    operating_expenses = Column(Float, nullable=True)
    ebitda = Column(Float, nullable=True)
    provisions = Column(Float, nullable=True)
    profit_before_tax = Column(Float, nullable=True)
    profit_after_tax = Column(Float, nullable=True)
    total_assets = Column(Float, nullable=True)
    total_liabilities = Column(Float, nullable=True)
    equity_and_reserves = Column(Float, nullable=True)

    report = relationship("CorporateReport", back_populates="financials")

    __table_args__ = (UniqueConstraint('report_id', 'statement_scope', name='_report_scope_uc'),)


class BusinessUnitSegment(Base):
    __tablename__ = "business_units_segments"

    unit_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    unit_name = Column(String(150), nullable=False)
    unit_type = Column(String(50), nullable=True)
    revenue = Column(Float, nullable=True)
    ebitda_or_pat = Column(Float, nullable=True)
    margin_or_stake_pct = Column(Float, nullable=True)
    unit_metadata = Column(JSON, nullable=True)

    report = relationship("CorporateReport", back_populates="segments")

    __table_args__ = (UniqueConstraint('report_id', 'unit_name', name='_report_unit_uc'),)


class OperationalMetric(Base):
    __tablename__ = "operational_metrics"

    metric_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False)
    metric_name = Column(String(150), nullable=False)
    metric_value = Column(Float, nullable=True)
    metric_unit = Column(String(50), nullable=True)
    yoy_change_pct = Column(Float, nullable=True)
    qoq_change_pct = Column(Float, nullable=True)
    additional_data = Column(JSON, nullable=True)

    report = relationship("CorporateReport", back_populates="operational_metrics")

    __table_args__ = (UniqueConstraint('report_id', 'metric_name', name='_report_metric_uc'),)


class StrategicEvent(Base):
    __tablename__ = "strategic_and_operational_events"

    event_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    domain = Column(String(100), nullable=True)
    category = Column(String(50), nullable=False)
    headline = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    page_number = Column(Integer, nullable=True)

    report = relationship("CorporateReport", back_populates="events")


class EsgMetric(Base):
    __tablename__ = "esg_and_sustainability"

    esg_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    pillar = Column(String(20), nullable=False)
    framework_or_agency = Column(String(100), nullable=True)
    score_or_status = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)

    report = relationship("CorporateReport", back_populates="esg_metrics")


class DocumentTextChunk(Base):
    __tablename__ = "document_text_chunks"

    chunk_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("corporate_reports.report_id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=False)
    raw_text = Column(Text, nullable=False)

    report = relationship("CorporateReport", back_populates="text_chunks")


class SymbolScheduler(Base):
    __tablename__ = "symbol_scheduler"
    __table_args__ = (
        UniqueConstraint('stocks_symbol', 'year', 'quarter', name='uq_symbol_year_quarter'),
    )

    id = Column(Integer, primary_key=True, index=True)
    stocks_symbol = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False, default=2020)
    quarter = Column(Integer, nullable=False, default=4)
    is_data_process = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())