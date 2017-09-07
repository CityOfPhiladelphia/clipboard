from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB, INET

db = SQLAlchemy()

class BaseMixin(object):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,
                           nullable=False,
                           server_default=func.now())
    updated_at = db.Column(db.DateTime,
                           nullable=False,
                           server_default=func.now(),
                           onupdate=func.now())
    ## TODO: updated_by ??

## TODO: origins ? for CORS
class Form(BaseMixin, db.Model):
    __tablename__ = 'forms'

    slug = db.Column(db.String(128), unique=True, nullable=False)
    title = db.Column(db.String(128))
    description = db.Column(db.String(500))
    public = db.Column(db.Boolean, nullable=False)

## TODO: own PK or compound of form_id + version ?
## TODO: unique form_id + version
class FormVersion(BaseMixin, db.Model):
    __tablename__ = 'form_versions'

    form_id = db.Column(db.Integer,
                        db.ForeignKey('forms.id', ondelete='CASCADE'),
                        nullable=False)
    version = db.Column(db.Integer)
    published = db.Column(db.Boolean, nullable=False)
    schema = db.Column(JSONB)

class FormSubmission(BaseMixin, db.Model):
    __tablename__ = 'form_submissions'

    form_version_id = db.Column(db.Integer,
                                db.ForeignKey('form_versions.id', ondelete='CASCADE'),
                                nullable=False)
    submitter_user_id = db.Column(db.Integer)
    data = db.Column(JSONB)
    email = db.Column(db.String(255))
    email_verified = db.Column(db.Boolean)
    ip = db.Column(INET)
    user_agent = db.Column(db.String(2048))
    referrer = db.Column(db.String(8192))
    status = db.Column(db.String(255))
