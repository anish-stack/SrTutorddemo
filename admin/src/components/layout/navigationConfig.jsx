import {
    LayoutDashboard,
    Users,
    GraduationCap,
    School,
    MessageSquare,
    UserPlus,
    Search,
    Star,
    Image,
    MapPin,
    Mail,
    Phone,
    Settings,
    BellElectric,
    Activity
  } from 'lucide-react';
  
  export const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Manage Teachers',
      path: '/manage-teacher',
      icon: Users
    },
    {
      name: 'Manage Students',
      path: '/manage-student',
      icon: GraduationCap
    },
    {
      name: 'Manage Classes',
      path: '/manage-class',
      icon: School
    },
    {
      name: 'Manage Leads',
      path: '/manage-leads',
      icon: MessageSquare
    },
    {
      name: 'Manage Request',
      path: '/Manage-All-Requests',
      icon: MessageSquare
    },
    {
      name: 'Manage JdLeads',
      path: '/Manage-Justdial',
      icon: BellElectric
    },
    
    {
      name: 'Create Teacher',
      path: '/Create-Teacher-Profile',
      icon: UserPlus
    },
    {
      name: 'Search Teacher',
      path: '/search-teacher',
      icon: Search
    },
    {
      name: 'Reviews',
      path: '/manage-reviews',
      icon: Star
    },
    {
      name: 'Banners',
      path: '/manage-banners',
      icon: Image
    },
    {
      name: 'Add Request',
      path: '/Add-request',
      icon: UserPlus
    },
    {
      name: 'Seo Pages',
      path: '/manage-pages',
      icon: Activity
    },
    {
      name: 'Cities',
      path: '/manage-city',
      icon: MapPin
    },
    {
      name: 'Newsletter',
      path: '/all-subscribers',
      icon: Mail
    },
    {
      name: 'Contact',
      path: '/manage-contact',
      icon: Phone
    },
    // {
    //   name: 'Settings',
    //   path: '/settings',
    //   icon: Settings
    // }
  ];