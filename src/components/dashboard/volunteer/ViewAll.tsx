import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit, UserCheck, UserX, Shield, Crown, Calendar, Mail, Building, X, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
}

interface Organization {
  type: "team" | "department" | "none";
  name?: string;
  role?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  username: string;
  email: string;
  avatar?: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  institution: string;
  educationLevel: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
  address: string;
  organization: Organization;
  socialMedia: SocialMedia;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminType: "departmentAdmin" | "teamAdmin" | "projectAdmin" | "none";
  isVerified: boolean;
  dateJoined: string;
  fullName: string;
}

interface EditingUser extends Partial<User> {
  password?: string;
}

interface Stats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  superAdmins: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, unverified: 0, admins: 0, superAdmins: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateJoined');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search,
        filter,
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admins/user/get?${params}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(data.data.users);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser({
      ...user,
      dateOfBirth: new Date(user.dateOfBirth).toISOString().split('T')[0],
      dateJoined: new Date(user.dateJoined).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
    setErrors({});
  };

  const handleInputChange = (field: keyof EditingUser, value: string | boolean) => {
    if (!editingUser) return;
    
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOrganizationChange = (field: keyof Organization, value: string) => {
    if (!editingUser) return;
    
    setEditingUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        organization: {
          ...prev.organization,
          [field]: value
        } as Organization
      };
    });
  };

  const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
    if (!editingUser) return;
    
    setEditingUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      };
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    setUpdating(true);
    setErrors({});

    try {
      const response = await fetch('/api/admins/user/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingUser._id,
          ...editingUser
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('User updated successfully!');
        setIsModalOpen(false);
        setEditingUser(null);
        fetchUsers(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: data.error || 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (user: User) => {
    const badges = [];
    
    if (user.isSuperAdmin) {
      badges.push(<span key="super" className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
        <Crown size={12} /> Super Admin
      </span>);
    } else if (user.isAdmin) {
      badges.push(<span key="admin" className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
        <Shield size={12} /> Admin
      </span>);
    }
    
    if (user.isVerified) {
      badges.push(<span key="verified" className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
        <UserCheck size={12} /> Verified
      </span>);
    } else {
      badges.push(<span key="unverified" className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
        <UserX size={12} /> Unverified
      </span>);
    }
    
    return badges;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setErrors({});
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all registered users and their permissions</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.unverified}</div>
          <div className="text-sm text-gray-600">Unverified</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.superAdmins}</div>
          <div className="text-sm text-gray-600">Super Admins</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="admin">Admins</option>
            <option value="superAdmin">Super Admins</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="dateJoined-desc">Newest First</option>
            <option value="dateJoined-asc">Oldest First</option>
            <option value="firstName-asc">Name A-Z</option>
            <option value="firstName-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={`${user.fullName}'s avatar`} 
                            width={32}
                            height={32}
                            className="rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-xs text-gray-500">{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3 break-all">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.isSuperAdmin
                        ? "Super Admin"
                        : user.isAdmin
                        ? "Admin"
                        : user.organization?.role || "User"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">{getStatusBadge(user)}</div>
                    </td>
                    <td className="px-4 py-3">{formatDate(user.dateJoined)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        title="Edit User"
                      >
                        <Edit size={16} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
        </div>
        
        <div className="flex items-center gap-2">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`px-3 py-2 rounded transition-colors ${
                  page === pagination.currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit User: {editingUser.fullName}</h2>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  {errors.general}
                </div>
              )}

              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building size={20} />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="firstName">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={editingUser.firstName || ''}
                      onChange={e => handleInputChange('firstName', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="lastName">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={editingUser.lastName || ''}
                      onChange={e => handleInputChange('lastName', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="middleName">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      value={editingUser.middleName || ''}
                      onChange={e => handleInputChange('middleName', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter middle name (optional)"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="username">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={editingUser.username || ''}
                      onChange={e => handleInputChange('username', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter username"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={editingUser.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="phoneNumber">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={editingUser.phoneNumber || ''}
                      onChange={e => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="dateOfBirth">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      value={editingUser.dateOfBirth || ''}
                      onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="gender">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      value={editingUser.gender || ''}
                      onChange={e => handleInputChange('gender', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                </div>
              </div>

              {/* Education & Institution */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Education & Institution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="educationLevel">
                      Education Level *
                    </label>
                    <select
                      id="educationLevel"
                      value={editingUser.educationLevel || ''}
                      onChange={e => handleInputChange('educationLevel', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.educationLevel ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select education level</option>
                      <option value="SSC/O-Level">SSC/O-Level</option>
                      <option value="HSC/A-Level">HSC/A-Level</option>
                      <option value="Undergrad">Undergrad</option>
                    </select>
                    {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="institution">
                      Institution *
                    </label>
                    <input
                      type="text"
                      id="institution"
                      value={editingUser.institution || ''}
                      onChange={e => handleInputChange('institution', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter institution name"
                    />
                    {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="address">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={editingUser.address || ''}
                      onChange={e => handleInputChange('address', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building size={20} />
                  Organization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Organization Type</label>
                    <select
                      value={editingUser.organization?.type || 'none'}
                      onChange={e => handleOrganizationChange('type', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="none">No Organization</option>
                      <option value="team">Team</option>
                      <option value="department">Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Organization Name</label>
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={editingUser.organization?.name || ''}
                      onChange={e => handleOrganizationChange('name', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Role</label>
                    <input
                      type="text"
                      placeholder="Organization Role"
                      value={editingUser.organization?.role || ''}
                      onChange={e => handleOrganizationChange('role', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Mail size={20} />
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Facebook</label>
                    <input
                      type="url"
                      placeholder="Facebook profile URL"
                      value={editingUser.socialMedia?.facebook || ''}
                      onChange={e => handleSocialMediaChange('facebook', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Twitter</label>
                    <input
                      type="url"
                      placeholder="Twitter profile URL"
                      value={editingUser.socialMedia?.twitter || ''}
                      onChange={e => handleSocialMediaChange('twitter', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">LinkedIn</label>
                    <input
                      type="url"
                      placeholder="LinkedIn profile URL"
                      value={editingUser.socialMedia?.linkedin || ''}
                      onChange={e => handleSocialMediaChange('linkedin', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Instagram</label>
                    <input
                      type="url"
                      placeholder="Instagram profile URL"
                      value={editingUser.socialMedia?.instagram || ''}
                      onChange={e => handleSocialMediaChange('instagram', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">GitHub</label>
                    <input
                      type="url"
                      placeholder="GitHub profile URL"
                      value={editingUser.socialMedia?.github || ''}
                      onChange={e => handleSocialMediaChange('github', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      placeholder="Personal website URL"
                      value={editingUser.socialMedia?.website || ''}
                      onChange={e => handleSocialMediaChange('website', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Admin Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={editingUser.isVerified || false}
                        onChange={e => handleInputChange('isVerified', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="isVerified" className="font-medium text-gray-700">
                        Verified User
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isAdmin"
                        checked={editingUser.isAdmin || false}
                        onChange={e => handleInputChange('isAdmin', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="isAdmin" className="font-medium text-gray-700">
                        Admin User
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isSuperAdmin"
                        checked={editingUser.isSuperAdmin || false}
                        onChange={e => {
                          handleInputChange('isSuperAdmin', e.target.checked);
                          if (e.target.checked) {
                            handleInputChange('isAdmin', true);
                          }
                        }}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="isSuperAdmin" className="font-medium text-gray-700">
                        Super Admin
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Admin Type</label>
                    <select
                      value={editingUser.adminType || 'none'}
                      onChange={e => handleInputChange('adminType', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!editingUser.isAdmin}
                    >
                      <option value="none">No Admin Type</option>
                      <option value="departmentAdmin">Department Admin</option>
                      <option value="teamAdmin">Team Admin</option>
                      <option value="projectAdmin">Project Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Security
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
                      New Password (Leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={editingUser.password || ''}
                      onChange={e => handleInputChange('password', e.target.value)}
                      className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password (min 8 characters)"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      Password must be at least 8 characters long and contain at least one letter and one number
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}