"""Initial migration for records table

Revision ID: 544829aab0df
Revises:
Create Date: 2025-01-27 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# Revision identifiers, used by Alembic.
revision = "544829aab0df"
down_revision = None
branch_labels = None
depends_on = None


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


def downgrade():
    # Drop the records table
    op.drop_table("records")
