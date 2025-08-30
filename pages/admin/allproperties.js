import { useState, useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import { useRouter } from 'next/router';
import { db } from '@/Firebase/firestore';
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    doc, 
    updateDoc, 
    deleteDoc,
    getDoc 
} from 'firebase/firestore';
import { 
    Eye, 
    Edit, 
    Trash2, 
    CheckCircle, 
    XCircle, 
    Search, 
    Loader,
    MapPin,
    DollarSign,
    Home,
    Building,
    User,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Link from 'next/link';

const AllProperties = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    
    // Sorting state
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    // Check if user is admin
    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch user data by email
    const fetchUserData = async (email) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', email));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Fetch all properties
    const fetchProperties = async () => {
        try {
            setLoading(true);
            const propertiesRef = collection(db, 'properties');
            const q = query(propertiesRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const propertiesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setProperties(propertiesData);

            // Fetch user data for all properties
            const userEmails = [...new Set(propertiesData.map(item => item.createdBy?.email).filter(Boolean))];
            const usersData = {};
            
            for (const email of userEmails) {
                const userData = await fetchUserData(email);
                if (userData) {
                    usersData[email] = userData;
                }
            }
            
            setUsers(usersData);

        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            fetchProperties();
        }
    }, [user]);

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort properties
    const sortedProperties = [...properties].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle nested objects
        if (sortField === 'createdBy') {
            aValue = a.createdBy?.name || '';
            bValue = b.createdBy?.name || '';
        }

        // Handle dates
        if (aValue?.toDate && bValue?.toDate) {
            aValue = aValue.toDate();
            bValue = bValue.toDate();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Filter properties based on search and filters
    const filteredProperties = sortedProperties.filter(property => {
        const matchesSearch = searchTerm === '' || 
            property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
        const matchesType = typeFilter === 'all' || property.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Handle property actions
    const handleApprove = async (propertyId) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'properties', propertyId), {
                status: 'approved',
                approvedAt: new Date(),
                approvedBy: user.email
            });
            await fetchProperties();
        } catch (error) {
            console.error('Error approving property:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (propertyId) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'properties', propertyId), {
                status: 'rejected',
                rejectedAt: new Date(),
                rejectedBy: user.email
            });
            await fetchProperties();
        } catch (error) {
            console.error('Error rejecting property:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (propertyId) => {
        setActionLoading(true);
        try {
            await deleteDoc(doc(db, 'properties', propertyId));
            await fetchProperties();
            setShowDeleteModal(false);
            setPropertyToDelete(null);
        } catch (error) {
            console.error('Error deleting property:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteModal = (property) => {
        setPropertyToDelete(property);
        setShowDeleteModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
            approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
                {status || 'pending'}
            </span>
        );
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <ChevronDown className="w-4 h-4 text-gray-400" />;
        }
        return sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4 text-gray-600" /> : 
            <ChevronDown className="w-4 h-4 text-gray-600" />;
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (user?.role !== "admin") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
                    <p className="text-gray-600">Manage and review all properties in the system</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="plot">Plot</option>
                                <option value="building">Building</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Properties Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('title')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Property</span>
                                            {getSortIcon('title')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('price')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Price</span>
                                            {getSortIcon('price')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('location')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Location</span>
                                            {getSortIcon('location')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('type')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Type</span>
                                            {getSortIcon('type')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Status</span>
                                            {getSortIcon('status')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('createdBy')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Owner</span>
                                            {getSortIcon('createdBy')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Date</span>
                                            {getSortIcon('createdAt')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProperties.map((property) => {
                                    const userData = users[property.createdBy?.email];
                                    return (
                                        <tr key={property.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                            src={property.photos?.[0] || "https://via.placeholder.com/48x48?text=No+Image"}
                                                            alt={property.title}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {property.title || 'Untitled Property'}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {property.description?.substring(0, 50) || 'No description'}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${property.price?.toLocaleString() || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                    {property.location || 'Location not specified'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {property.type === 'building' ? (
                                                        <Building className="w-4 h-4 mr-1 text-gray-400" />
                                                    ) : (
                                                        <Home className="w-4 h-4 mr-1 text-gray-400" />
                                                    )}
                                                    <span className="capitalize">{property.type || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(property.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        {userData?.img ? (
                                                            <img
                                                                className="h-8 w-8 rounded-full object-cover"
                                                                src={userData.img}
                                                                alt={userData.name}
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-gray-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {userData?.name || property.createdBy?.name || 'Unknown'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {property.createdBy?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {property.createdAt?.toDate?.()?.toLocaleDateString() || 'Date not available'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {/* View Button */}
                                                    <Link
                                                        href={`/singleproperty/${property.id}`}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View
                                                    </Link>

                                                    {/* Edit Button */}
                                                    <Link
                                                        href={`/addproperty/${property.id}`}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors"
                                                    >
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Link>

                                                    {/* Approve/Reject Buttons */}
                                                    {property.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(property.id)}
                                                                disabled={actionLoading}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Approve
                                                            </button>
                                                            
                                                            <button
                                                                onClick={() => handleReject(property.id)}
                                                                disabled={actionLoading}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50"
                                                            >
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => openDeleteModal(property)}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredProperties.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Home className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                            <p className="text-gray-600">
                                {properties.length === 0 ? 'No properties have been added yet.' : 'No properties match your current filters.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {filteredProperties.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredProperties.length} of {properties.length} properties
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && propertyToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Trash2 className="w-6 h-6 text-red-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Delete Property</h2>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{propertyToDelete.title}"? This action cannot be undone.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setPropertyToDelete(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(propertyToDelete.id)}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProperties;