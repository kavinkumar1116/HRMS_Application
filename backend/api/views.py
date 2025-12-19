from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Employee,Department,Designation,Location,Branch,EmployeeAttendanceDaily
from bson import ObjectId 
from datetime import datetime
from dateutil import parser


@api_view(['GET'])
def health_check(request):
    """
    Lightweight health endpoint to confirm the backend is reachable.
    """
    return Response({'status': 'Backend is running'})


#--------------------Employee Function START-----------------------#


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def employee_list_create(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        return Response([emp.to_dict() for emp in employees])

    elif request.method == 'POST':
        name = request.data.get('name')
        emp_id = request.data.get('emp_id')
        email = request.data.get('email')
        designation_id = request.data.get('designation')
        department_id = request.data.get('department')
        location_id = request.data.get('location')
        branch_id = request.data.get('branch')
        emp_status = request.data.get('status')
        
        if not name or not email:
            return Response(
                {'detail': 'Name and email are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if email already exists
        if Employee.objects(email=email).first():
            return Response(
                {'detail': 'Employee with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Employee.object(emp_id=emp_id).first():
            return Response(
                {'details':'Employee with this Emp ID already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Convert string IDs to ObjectId and validate they exist
            from bson import ObjectId
            
            # Validate IDs are valid ObjectIds
            try:
                designation_id = ObjectId(designation_id)
                department_id = ObjectId(department_id)
                location_id = ObjectId(location_id)
                branch_id = ObjectId(branch_id)
            except:
                return Response(
                    {'detail': 'One or more IDs are invalid.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if referenced documents exist
            if not Designation.objects(id=designation_id).first():
                return Response(
                    {'detail': 'Invalid designation ID.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not Department.objects(id=department_id).first():
                return Response(
                    {'detail': 'Invalid department ID.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not Location.objects(id=location_id).first():
                return Response(
                    {'detail': 'Invalid location ID.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not Branch.objects(id=branch_id).first():
                return Response(
                    {'detail': 'Invalid branch ID.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            employee = Employee(
                name=name,
                emp_id=emp_id,
                email=email,
                designation=designation_id,
                department=department_id,
                location=location_id,
                branch=branch_id,
                emp_status=emp_status
            )
            employee.save()
            return Response(employee.to_dict(), status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'Error creating employee: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee_by_id(request, id):
    """
    GET: Get an employee by ID
    """
    employee = Employee.objects(id=id).first()
    if not employee:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(employee.to_dict(), status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_employee_by_id(request, id):
    """
    PUT: Update an employee by ID
    """
    try:
        employee = Employee.objects.get(id=id)
    except (Employee.DoesNotExist, Exception):
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    name = request.data.get('name')
    emp_id = request.data.get('emp_id')
    email = request.data.get('email')
    designation_id = request.data.get('designation')
    department_id = request.data.get('department')
    location_id = request.data.get('location')
    branch_id = request.data.get('branch')
    emp_status = request.data.get('status')

    if not name or not email or not emp_id:
        return Response(
            {'detail': 'Name, Emp ID and email are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if email already exists for another employee
    existing_employee = Employee.objects(email=email).first()
    if existing_employee and str(existing_employee.id) != id:
        return Response(
            {'detail': 'Another employee with this email already exists.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    existing_employee = Employee.objects(emp_id=emp_id).first()
    if existing_employee and str(existing_employee.id) != id:
        return Response(
            {'detail': 'Another employee with this Emp ID already exists.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Validate that all reference IDs exist
        try:
            Department.objects.get(id=department_id)
        except (Department.DoesNotExist, Exception):
            return Response(
                {'detail': 'Invalid department ID.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            Designation.objects.get(id=designation_id)
        except (Designation.DoesNotExist, Exception):
            return Response(
                {'detail': 'Invalid designation ID.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            Location.objects.get(id=location_id)
        except (Location.DoesNotExist, Exception):
            return Response(
                {'detail': 'Invalid location ID.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            Branch.objects.get(id=branch_id)
        except (Branch.DoesNotExist, Exception):
            return Response(
                {'detail': 'Invalid branch ID.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the employee object with string IDs
        employee.name = name
        employee.emp_id = emp_id
        employee.email = email
        employee.designation = designation_id
        employee.department = department_id
        employee.location = location_id
        employee.branch = branch_id
        employee.emp_status = emp_status
        
        employee.save()
        return Response(employee.to_dict(), status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'detail': f'Error updating employee: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employee_by_id(request, id):
    """
    DELETE: Delete an employee by ID
    """
    employee = Employee.objects(id=id).first()
    if not employee:
        return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    employee.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)    


#--------------------Employee Function END-----------------------#


#--------------------Department Function START-----------------------#

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def department_list_create(request):
    """
    GET: List all departments
    POST: Create a new department
    """
    if request.method == 'GET':
        departments = Department.objects.all()
        return Response([dept.to_dict() for dept in departments], status=status.HTTP_200_OK)
    elif request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description', '')
        manager = request.data.get('manager', '')
        location = request.data.get('location', '')
        try:
            department = Department(
                name=name,
                description=description,
                manager=manager,
                location=location,
            )
            department.save()
            return Response(department.to_dict(), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': f'Error creating department: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_department_by_id(request, id):
    """
    GET: Get a department by ID
    """
    department = Department.objects(id=id).first()
    if not department:
        return Response({'detail': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(department.to_dict(), status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_department_by_id(request, id):
    """
    PUT: Update a department by ID
    """
    department = Department.objects(id=id).first()
    if not department:
        return Response({'detail': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
    name = request.data.get('name')
    description = request.data.get('description', '')
    manager = request.data.get('manager', '')
    location = request.data.get('location', '')
    department.name = name
    department.description = description
    department.manager = manager
    department.location = location
    department.save()
    return Response(department.to_dict(), status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_department_by_id(request, id):
    """
    DELETE: Delete a department by ID
    """
    department = Department.objects(id=id).first()
    if not department:
        return Response({'detail': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
    department.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)    


#--------------------Department Function END-----------------------#



#--------------------Designation Function START-----------------------#

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def designation_list_create(request):
    """
    GET: List all designations
    POST: Create a new designation
    """
    if request.method == 'GET':
        designations = Designation.objects.all()
        return Response([designation.to_dict() for designation in designations], status=status.HTTP_200_OK)
    elif request.method == 'POST':
        designation_name = request.data.get('designation_name')
        department_id = request.data.get('department_name')
        try:
            department = Department.objects(id=department_id).first()
            if not department:
                return Response({'detail': 'Department not found.'}, status=status.HTTP_404_NOT_FOUND)
            designation = Designation(
                designation_name=designation_name,
                department_name=department
            )
            designation.save()
            return Response(designation.to_dict(), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': f'Error creating designation: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_designation_by_id(request, id):
    """
    GET: Get a designation by ID
    """
    designation = Designation.objects(id=id).first()
    if not designation:
        return Response({'detail': 'Designation not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(designation.to_dict(), status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_designation_by_id(request, id):
    """
    PUT: Update a designation by ID
    """
    try:
        designation = Designation.objects(id=id).first()
        if not designation:
            return Response({'detail': 'Designation not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        designation_name = request.data.get('designation_name')
        department_id = request.data.get('department_name')
        
        # Get the Department document
        try:
            department = Department.objects.get(id=department_id)
        except (Department.DoesNotExist, Exception) as e:
            return Response(
                {'detail': 'Department not found or invalid department ID.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update fields
        designation.designation_name = designation_name
        designation.department_name = department  # Assign the Department document directly
        designation.save()
        
        return Response(designation.to_dict(), status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'detail': f'Error updating designation: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_designation_by_id(request, id):
    """
    DELETE: Delete a designation by ID
    """
    designation = Designation.objects(id=id).first()
    if not designation:
        return Response({'detail': 'Designation not found.'}, status=status.HTTP_404_NOT_FOUND)
    designation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

#--------------------Designation Function END-----------------------#

#--------------------Location Function START-----------------------#

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def location_list_create(request):
    """
    GET: List all locations
    POST: Create a new location
    """
    if request.method == 'GET':
        locations = Location.objects.all()
        return Response([location.to_dict() for location in locations], status=status.HTTP_200_OK)
    elif request.method == 'POST':
        location_name = request.data.get('location_name')
        try:
            location = Location(
                location_name=location_name
            )
            location.save()
            return Response(location.to_dict(), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': f'Error creating location: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_location_by_id(request, id):
    """
    GET: Get a location by ID
    """
    location = Location.objects(id=id).first()
    if not location:
        return Response({'detail': 'Location not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(location.to_dict(), status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_location_by_id(request, id):
    """
    PUT: Update a location by ID
    """
    location = Location.objects(id=id).first()
    if not location:
        return Response({'detail': 'Location not found.'}, status=status.HTTP_404_NOT_FOUND)
    location_name = request.data.get('location_name')
    location.location_name = location_name
    location.save()
    return Response(location.to_dict(), status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_location_by_id(request, id):
    """
    DELETE: Delete a location by ID
    """
    location = Location.objects(id=id).first()
    if not location:
        return Response({'detail': 'Location not found.'}, status=status.HTTP_404_NOT_FOUND)
    location.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

#--------------------Location Function END-----------------------#


#--------------------Branch Function START-----------------------#

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def branch_list_create(request):
    if request.method == 'GET':
        branches = Branch.objects.all()
        return Response([branch.to_dict() for branch in branches], status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        print(request.data)
        try:
            data = request.data
            # Convert location_id to ObjectId
            from bson import ObjectId
            try:
                location_id = ObjectId(data.get('location_name'))
            except:
                return Response({'detail': 'Invalid location ID format.'}, 
                              status=status.HTTP_400_BAD_REQUEST)
                
            branch = Branch(
                branch_name=data.get('branch_name'),
                location_name=location_id
            )
            branch.save()
            return Response(branch.to_dict(), status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'detail': f'Error creating branch: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def get_branch_by_id(request, id):
    """
    GET: Get a branch by ID
    """
    branch = Branch.objects(id=id).first()
    if not branch:
        return Response({'detail': 'Branch not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(branch.to_dict(), status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_branch_by_id(request, id):
    """
    PUT: Update a branch by ID
    """

    try:
        branch = Branch.objects(id=id).first()
        if not branch:
            return Response({'detail': 'Branch not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        branch_name = request.data.get('branch_name')
        location_id = request.data.get('location_name')
        
        # Get the Location document
        try:
            location = Location.objects.get(id=location_id)
        except (Location.DoesNotExist, Exception) as e:
            return Response(
                {'detail': 'Location not found or invalid location ID.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update fields
        branch.branch_name = branch_name
        branch.location_name = location  # Assign the Location document directly
        branch.save()
        
        return Response(branch.to_dict(), status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'detail': f'Error updating branch: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_branch_by_id(request, id):
    """
    DELETE: Delete a branch by ID
    """
    branch = Branch.objects(id=id).first()
    if not branch:
        return Response({'detail': 'Branch not found.'}, status=status.HTTP_404_NOT_FOUND)
    branch.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


#--------------------Branch Function END-----------------------#

#--------------------Employee Attendance Function START-----------------------#

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def get_employee_attendance(request):
    try:
        # Get query parameters
        if request.method == 'GET':
            emp_id = request.query_params.get('emp_id')
            date_str = request.query_params.get('date')
        else:  # POST
            emp_id = request.data.get('emp_id')
            date_str = request.data.get('date')
        
        # Validate required parameters
        if not emp_id or not date_str:
            return Response(
                {'error': 'emp_id and date are required parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Parse the input date
            target_date = parser.parse(date_str).date()
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid date format. Please use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get all attendance records for the employee on the specified date
            attendance_records = list(EmployeeAttendanceDaily.objects.filter(
                emp_id=emp_id,
                date=target_date
            ).order_by('check_in'))  # Adjust the ordering field as needed

            if not attendance_records:
                return Response(
                    {'message': f'No attendance records found for employee {emp_id} on {target_date}'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the data
            attendance_data = [att.to_dict() for att in attendance_records]

            return Response(attendance_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error querying attendance records: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_in_attendance(request):
    """
    GET: List all employee attendances
    POST: Create a new employee attendance record with check-in/check-out
    """
    if request.method == 'GET':
        attendances = EmployeeAttendanceDaily.objects.all()
        return Response([attendance.to_dict() for attendance in attendances], status=status.HTTP_200_OK)
    
    elif request.method == 'POST':

        try:

            data = request.data
            emp_id = data.get('employee_id')
            date_str = data.get('date')
            check_in = data.get('check_in')
            
            if not all([emp_id, date_str, check_in]):
                return Response(
                    {'error': 'Employee ID, date, and check_in are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
          
            attendance = EmployeeAttendanceDaily(
                emp_id=emp_id,
                date=date_str,
                status="Present",
                records={
                    'check_in': check_in,
                    'check_out': data.get('check_out', '')
                }
            )
        
            attendance.save()
            
            return Response(attendance.to_dict(), status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'Error creating employee attendance: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out_attendance(request):
    """
    Add check-out time to an existing attendance record
    """
   
    try:
        attendance = EmployeeAttendanceDaily.objects.get(id=attendance_id)
        check_out = request.data.get('check_out')
        
        if not check_out:
            return Response(
                {'error': 'check_out time is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the last record's check_out time
        if not attendance.records:
            return Response(
                {'error': 'No check-in record found'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        attendance.records[-1].check_out = check_out
        attendance.save()
        
        return Response(attendance.to_dict())
        
    except EmployeeAttendanceDaily.DoesNotExist:
        return Response(
            {'error': 'Attendance record not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )