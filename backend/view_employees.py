"""
Simple script to view all employees in MongoDB.
Run with: python view_employees.py
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Employee


def view_employees():
    """Display all employees from MongoDB"""
    print("\n" + "=" * 60)
    print("EMPLOYEES IN DATABASE")
    print("=" * 60)
    
    employees = Employee.objects.all()
    count = employees.count()
    
    if count == 0:
        print("\nNo employees found in database.")
        return
    
    print(f"\nTotal Employees: {count}\n")
    print("-" * 60)
    
    for idx, emp in enumerate(employees, 1):
        print(f"\n{idx}. ID: {emp.id}")
        print(f"   Name: {emp.name}")
        print(f"   Email: {emp.email}")
        print(f"   Role: {emp.role or 'N/A'}")
        print(f"   Department: {emp.department or 'N/A'}")
        print("-" * 60)
    
    print("\n")


if __name__ == '__main__':
    try:
        view_employees()
    except Exception as e:
        print(f"\nError: {e}")
        print("\nMake sure MongoDB is running and connection settings are correct.")


