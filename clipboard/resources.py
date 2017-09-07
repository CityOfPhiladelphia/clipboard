from marshmallow import fields
from marshmallow_sqlalchemy import ModelSchema, field_for
from flask_login import login_required
from restful_ben.resources import (
    RetrieveUpdateDeleteResource,
    QueryEngineMixin,
    CreateListResource
)

from .models import (
    db,
    Form,
    FormVersion,
    FormSubission
)

## Form

class FormSchema(ModelSchema):
    class Meta:
        model = Form

    id = field_for(User, 'id', dump_only=True)
    created_at = field_for(Form, 'created_at', dump_only=True)
    updated_at = field_for(Form, 'updated_at', dump_only=True)

form_schema = FormSchema()
forms_schema = FormSchema(many=True)

## TODO: `public` allows for unauthenticated GET
## TODO: include current version of the form?

class FormResource(RetrieveUpdateDeleteResource):
    method_decorators = [login_required]

    single_schema = form_schema
    model = Form
    session = db.session

class FormListResource(QueryEngineMixin, CreateListResource):
    method_decorators = [login_required]

    single_schema = form_schema
    many_schema = forms_schema
    model = Form
    session = db.session

# FormVersion

## TODO: GET does not require login
## TODO: public GET only return published?

# FormSubmission

## TODO: POST does not require login for public forms
## TODO: Google ReCAPTCHA check
