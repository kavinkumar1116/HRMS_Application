from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .auth_views import LoginView, LogoutView
from .views import employee_list_create, health_check, get_employee_by_id, update_employee_by_id, delete_employee_by_id,department_list_create,get_department_by_id,update_department_by_id,delete_department_by_id,designation_list_create,get_designation_by_id,update_designation_by_id,delete_designation_by_id,location_list_create,get_location_by_id,update_location_by_id,delete_location_by_id,branch_list_create,get_branch_by_id,update_branch_by_id,delete_branch_by_id,get_employee_attendance,check_in_attendance,check_out_attendance

urlpatterns = [
    path('health', health_check, name='health-check'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    #---------------------Employee Function START-----------------------#
    path('employees/', employee_list_create, name='employee-list-create'),
    path('employees/<str:id>/', get_employee_by_id, name='get-employee-by-id'),
    path('employees/update/<str:id>', update_employee_by_id, name='update-employee-by-id'),
    path('employees/delete/<str:id>', delete_employee_by_id, name='delete-employee-by-id'),
    #---------------------Employee Function END-----------------------#

    #---------------------Department Function START-----------------------#
    path('departments/', department_list_create, name='department-list-create'),
    path('departments/<str:id>/', get_department_by_id, name='get-department-by-id'),
    path('departments/update/<str:id>/', update_department_by_id, name='update-department-by-id'),
    path('departments/delete/<str:id>/', delete_department_by_id, name='delete-department-by-id'),
    #---------------------Department Function END-----------------------#

    #---------------------Designation Function START-----------------------#
    path('designations/', designation_list_create, name='designation-list-create'),
    path('designations/<str:id>/', get_designation_by_id, name='get-designation-by-id'),
    path('designations/update/<str:id>/', update_designation_by_id, name='update-designation-by-id'),
    path('designations/delete/<str:id>/', delete_designation_by_id, name='delete-designation-by-id'),
    #---------------------Designation Function END-----------------------#

    #---------------------Location Function START-----------------------#
    path('locations/', location_list_create, name='location-list-create'),
    path('locations/<str:id>/', get_location_by_id, name='location-by-id'),
    path('locations/update/<str:id>/', update_location_by_id, name='update-location-by-id'),
    path('locations/delete/<str:id>/', delete_location_by_id, name='delete-location-by-id'),
    #---------------------Location Function END-----------------------#

    #---------------------Branch Function START-----------------------#
    path('branches/', branch_list_create, name='branch-list-create'),
    path('branches/<str:id>/', get_branch_by_id, name='branch-by-id'),
    path('branches/update/<str:id>/', update_branch_by_id, name='update-branch-by-id'),
    path('branches/delete/<str:id>/', delete_branch_by_id, name='delete-branch-by-id'),
    #---------------------Branch Function END-----------------------#

    #---------------------Employee Attendance Function START-----------------------#
    path('get_employee_attendance/',get_employee_attendance, name='get_employee_attendance'),
    path('employee_attendance-check_in/', check_in_attendance, name='employee_attendance-check_in'),
    path('employee_attendance-check_out/', check_out_attendance, name='employee_attendance-check_out')
   
    #---------------------Employee Attendance Function END-----------------------#
]

