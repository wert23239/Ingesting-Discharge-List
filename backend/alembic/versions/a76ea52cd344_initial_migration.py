"""initial migration

Revision ID: a76ea52cd344
Revises: 544829aab0df
Create Date: 2025-01-27 16:45:26.632584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a76ea52cd344'
down_revision: Union[str, None] = '544829aab0df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create the records table
    op.create_table(
        "records",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("epic_id", sa.String(255), nullable=True),
        sa.Column("phone_number", sa.String(20), nullable=True),
        sa.Column("insurance", sa.String(255), nullable=True),
        sa.Column("provider", sa.String(255), nullable=True),
        sa.Column("status", sa.String(50), server_default="non-verified", nullable=True),
        sa.Column("created_at", sa.TIMESTAMP, server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP, server_default=sa.text("CURRENT_TIMESTAMP"), onupdate=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )



def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
