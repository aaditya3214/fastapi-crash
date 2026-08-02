# pyrefly: ignore [missing-import]
from pydantic import BaseModel, ConfigDict
from typing import Any

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str | None = None
    bio: str | None = None

class UserData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    full_name: str | None = None
    bio: str | None = None

class StandardResponse(BaseModel):
    status: str
    message: str
    data: Any = None

class PasswordResetRequest(BaseModel):
    username: str
    old_password: str
    new_password: str

class StockData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    symbol: str
    status: str
    created_at: Any = None
    updated_at: Any = None

class SymbolSchedulerCreate(BaseModel):
    stocks_symbol: str
    year: int = 2020
    quarter: int = 4
    is_data_process: bool = False

class SymbolSchedulerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    stocks_symbol: str
    year: int
    quarter: int
    is_data_process: bool
    created_at: Any = None
    updated_at: Any = None