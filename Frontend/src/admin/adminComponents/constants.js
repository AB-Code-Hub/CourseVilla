import { AcademicCapIcon, BookOpenIcon, ChartBarIcon, CogIcon, DocumentTextIcon, UsersIcon } from "@heroicons/react/24/outline";

export const userRoles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' }
  ];


export  const navItems = [
    { name: "Dashboard", icon: ChartBarIcon, path: "/admin" },
    { name: "Users", icon: UsersIcon, path: "/admin/users" },
    { name: "Courses", icon: BookOpenIcon, path: "/admin/courses" },
    {
      name: "Certificates",
      icon: DocumentTextIcon,
      path: "/admin/certificates",
    },
    { name: "Instructors", icon: AcademicCapIcon, path: "/admin/instructors" },
    { name: "Settings", icon: CogIcon, path: "/admin/settings" },
  ];