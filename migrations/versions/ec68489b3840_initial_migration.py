"""Initial migration.

Revision ID: ec68489b3840
Revises: 237bc99775b3
Create Date: 2023-10-18 23:20:32.034404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ec68489b3840'
down_revision = '237bc99775b3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cities', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ua_name', sa.String(length=100), nullable=True))

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_index('events_cities_id_fk')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.create_index('events_cities_id_fk', ['city_id'], unique=False)

    with op.batch_alter_table('cities', schema=None) as batch_op:
        batch_op.drop_column('ua_name')

    # ### end Alembic commands ###
