export type UserRole =
  | "SUPER_ADMIN"
  | "HR_MANAGER"
  | "EMPLOYEE";

export type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  profileImage?: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: EmployeeStatus;
  role: UserRole;
  reportingManager?: {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    designation: string;
  } | null;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationEmployee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: EmployeeStatus;
  role: UserRole;
  profileImage?: string;
  reportingManager?: string | null;
  reportees: OrganizationEmployee[];
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCount: number;
}