"""create_stocks_table

Revision ID: 0596240a924c
Revises: 
Create Date: 2026-07-05 15:54:48.466334

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0596240a924c'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create users and stocks tables."""
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('username', sa.String(length=150), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(length=256), nullable=False),
        sa.Column('full_name', sa.String(length=256), nullable=True),
        sa.Column('bio', sa.String(length=512), nullable=True),
    )

    op.create_table(
        'stocks',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('name', sa.String(length=256), nullable=False),
        sa.Column('symbol', sa.String(length=100), nullable=False, unique=True, index=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='active'),
    )


def downgrade() -> None:
    """Drop users and stocks tables."""
    op.drop_table('stocks')
    op.drop_table('users')
