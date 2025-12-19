from mongoengine import Document, StringField, EmailField,ReferenceField, ObjectIdField,BooleanField,DateField,FloatField,DictField,ListField

class Employee(Document):
    name = StringField(required=True, max_length=200)
    emp_id = StringField(required=True, max_length=200)
    email = EmailField(required=True, unique=True)
    designation = ObjectIdField(required=True)
    department = ObjectIdField(required=True)
    location = ObjectIdField(required=True)
    branch = ObjectIdField(required=True)
    emp_status = BooleanField(default=True)

    meta = {
        'collection': 'employees',
        'indexes': [
            'email',
            'name'
        ]
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'emp_id': self.emp_id,
            'email': self.email,
            'designation': str(self.designation) if self.designation else None,
            'department': str(self.department) if self.department else None,
            'location': str(self.location) if self.location else None,
            'branch': str(self.branch) if self.branch else None,
            'emp_status': self.emp_status
        }
class Department(Document):
    name = StringField(required=True, max_length=200)
    description = StringField(max_length=100)
    manager = StringField(max_length=100)
    location = StringField(max_length=100)

    meta = {
        'collection': 'departments',
        'indexes': ['name'],
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description or '',
            'manager': self.manager or '',
            'location': self.location or '',
        }

class Designation(Document):
    designation_name = StringField(required=True, max_length=200)
    department_name = ReferenceField('Department', required=True)

    meta = {
        'collection': 'designations',
        'indexes': ['designation_name'],
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'designation_name': self.designation_name,
            'department_name': str(self.department_name.id) if self.department_name else None,
            'department_data': {
                'id': str(self.department_name.id),
                'name': self.department_name.name
            } if self.department_name else None
        }

class Location(Document):
    location_name = StringField(required=True, max_length=200)

    meta = {
        'collection': 'locations',
        'indexes': ['location_name'],
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'location_name': self.location_name,
        }

class Branch(Document):
    branch_name = StringField(required=True)
    location_name = ReferenceField('Location', required=True)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'branch_name': self.branch_name,
            'location_name': str(self.location_name.id) if self.location_name else None,
            'location_data': {
                'id': str(self.location_name.id),
                'name': self.location_name.location_name
            } if self.location_name else None
        }

class EmployeeAttendanceDaily(Document):
    emp_id = StringField(required=True)
    date = DateField(required=True)
    status = StringField(choices=["Present", "Absent", "Halfday"])
    records = DictField(default=dict)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'emp_id': str(self.emp_id),
            'date': self.date,
            'status': self.status,
            'records': self.records  # Now matches the model's structure
        }
