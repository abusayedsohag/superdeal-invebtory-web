export type UserRole = 
  | "Customer"
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Inventory Manager"
  | "Sales Manager"
  | "Delivery Manager"
  | "Accountant";

export interface RoutePermission {
  view: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export type ModulePermissionMap = Record<string, RoutePermission>;

export interface RoleDocument {
  name: UserRole;
  level: number;
  description: string;
  badgeColor: string;
  permissions: ModulePermissionMap;
  isSystemRole?: boolean;
  updatedAt?: string;
}

export interface UserDocument {
  _id?: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  provider?: "credentials" | "google" | "facebook";
  avatar?: string;
  role: UserRole;
  status: "Active" | "Inactive" | "Suspended";
  customPermissions?: ModulePermissionMap;
  address?: string;
  district?: string;
  upazila?: string;
  rewardPoints?: number;
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthJWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
