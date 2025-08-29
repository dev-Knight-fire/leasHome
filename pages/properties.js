
import { Carousel } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineApartment, MdOutlineBathroom, MdOutlineBedroomChild } from 'react-icons/md';
import { TfiLocationPin } from 'react-icons/tfi';
import { db } from '@/Firebase/firestore';
import { collection, getDocs, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import { Loader } from 'lucide-react';

const properties = () => {
    const router = useRouter();
    const divisionId = router.query.divisionId;
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState({}); // Store user data by email
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Search state
    const [searchLocation, setSearchLocation] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchLeaseType, setSearchLeaseType] = useState('');
    
    // Parse search data from URL query
    useEffect(() => {
        if (router.query.data) {
            try {
                const searchData = JSON.parse(router.query.data);
                setSearchLocation(searchData.location || '');
                setSearchType(searchData.areaType || '');
                setSearchLeaseType(searchData.purpose || '');
            } catch (error) {
                console.error('Error parsing search data:', error);
            }
        }
    }, [router.query.data]);

    // For dropdown options
    const [locationOptions, setLocationOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [leaseTypeOptions, setLeaseTypeOptions] = useState([]);

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

    // Fetch properties from Firebase
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

            // Extract unique values for dropdowns
            const locations = Array.from(new Set(propertiesData.map(item => item.location).filter(Boolean)));
            setLocationOptions(locations);

            const types = Array.from(new Set(propertiesData.map(item => item.type).filter(Boolean)));
            setTypeOptions(types);

            const leaseTypes = Array.from(new Set(propertiesData.map(item => item.leaseType).filter(Boolean)));
            setLeaseTypeOptions(leaseTypes);

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
        fetchProperties();
    }, []);

    // Filtered items based on search
    const filteredItems = useMemo(() => {
        return properties.filter(item => {
            // Location matching (case-insensitive partial match)
            const matchesLocation = searchLocation 
                ? item.location?.toLowerCase().includes(searchLocation.toLowerCase()) 
                : true;
            
            // Type matching (exact match)
            const matchesType = searchType ? item.type === searchType : true;
            
            // Lease type matching (case-insensitive and flexible matching)
            let matchesLeaseType = true;
            if (searchLeaseType && item.leaseType) {
                const searchValue = searchLeaseType.toLowerCase();
                const itemValue = item.leaseType.toLowerCase();
                
                switch (searchValue) {
                    case 'lease':
                        matchesLeaseType = itemValue.includes('lease');
                        break;
                    case 'rental':
                        matchesLeaseType = itemValue.includes('rental with') || itemValue.includes('option');
                        break;
                    case 'long_term':
                        matchesLeaseType = itemValue.includes('long') || itemValue.includes('term');
                        break;
                    default:
                        matchesLeaseType = itemValue.includes(searchValue);
                }
            }
            
            return matchesLocation && matchesType && matchesLeaseType;
        });
    }, [properties, searchLocation, searchType, searchLeaseType]);

    const itemsPerPage = 6;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredItems.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredItems.length;
        setItemOffset(newOffset);
        setCurrentPage(Math.floor(newOffset / itemsPerPage));
    };

    // Reset pagination when search changes
    useEffect(() => {
        setItemOffset(0);
        setCurrentPage(0);
    }, [searchLocation, searchType, searchLeaseType]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setItemOffset(0);
        setCurrentPage(0);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchLocation('');
        setSearchType('');
        setSearchLeaseType('');
        setItemOffset(0);
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <div className='max-w-[1440px] w-[95%] mx-auto text-center'>
                <div className="flex justify-center items-center min-h-screen">
                    <Loader className='w-10 h-10 animate-spin' />
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-[1440px] w-[95%] mx-auto text-center my-12'>
            <h1 className='my-12 text-3xl font-bold'>Properties</h1>

            {/* Search Engine */}
            <form className="mb-8" onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-4">
                    <div className="w-full md:w-1/4">
                        <label htmlFor="searchLocation" className="block text-left mb-1 font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="searchLocation"
                            value={searchLocation}
                            onChange={e => setSearchLocation(e.target.value)}
                            placeholder="Enter location..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            aria-label="Enter location"
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <label htmlFor="searchType" className="block text-left mb-1 font-medium text-gray-700">Property Type</label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={e => setSearchType(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            aria-label="Select property type"
                        >
                            <option value="">All Types</option>
                            <option value="plot">Plot</option>
                            <option value="building">Building</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/4">
                        <label htmlFor="searchLeaseType" className="block text-left mb-1 font-medium text-gray-700">Purpose</label>
                        <select
                            id="searchLeaseType"
                            value={searchLeaseType}
                            onChange={e => setSearchLeaseType(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            aria-label="Select purpose"
                        >
                            <option value="">All Purposes</option>
                            <option value="lease">Lease</option>
                            <option value="rental">Rental with Option to Buy</option>
                            <option value="long_term">Long-Term Rental</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto flex gap-2">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary/90 transition"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </form>

            {/* Results count and search info */}
            <div className="text-left mb-4">
                <p className="text-gray-600">
                    Showing {currentItems.length} of {filteredItems.length} properties
                    {(searchLocation || searchType || searchLeaseType) && (
                        <span className="ml-2 text-sm text-gray-500">
                            (filtered)
                        </span>
                    )}
                </p>
                
                {/* Show active search filters */}
                {(searchLocation || searchType || searchLeaseType) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {searchLocation && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                Location: {searchLocation}
                            </span>
                        )}
                        {searchType && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                Type: {searchType}
                            </span>
                        )}
                        {searchLeaseType && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                Purpose: {searchLeaseType === 'lease' ? 'Lease' : 
                                         searchLeaseType === 'rental' ? 'Rental with Option to Buy' : 
                                         searchLeaseType === 'long_term' ? 'Long-Term Rental' : searchLeaseType}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    currentItems.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500 text-lg">
                                {filteredItems.length === 0 ? "No properties found." : "No properties match your current filters."}
                            </div>
                        </div>
                    ) : (
                        currentItems.map(property => (
                            <Link
                                key={property?.id}
                                href={`/singleproperty/${property?.id}`}
                                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                            >
                                {/* Property Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                        src={property?.photos[0] || "https://via.placeholder.com/400x300?text=Property+Image"} 
                                        alt={property?.title} 
                                    />
                                    {/* Price Badge */}
                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        ${property?.price?.toLocaleString() || 'N/A'}
                                    </div>
                                    {/* Type Badge */}
                                    <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                        {property?.type || 'N/A'}
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                        {property?.title || 'Property Title'}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <TfiLocationPin className="w-4 h-4 mr-2 text-primary" />
                                        <span className="text-sm">{property?.location || 'Location not specified'}</span>
                                    </div>

                                    {/* Lease Type */}
                                    <div className="mb-3">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                            {property?.leaseType || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {property?.description 
                                            ? (property.description.length > 50 
                                                ? property.description.substring(0, 50) + '...' 
                                                : property.description)
                                            : 'No description available'
                                        }
                                    </p>

                                    {/* Owner and Date */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center">
                                            {(() => {
                                                const userEmail = property?.createdBy?.email;
                                                const userData = users[userEmail];
                                                const userPhotoURL = userData?.photoURL || userData?.img;
                                                const userName = userData?.name || property?.createdBy?.name || 'Owner';
                                                
                                                return (
                                                    <>
                                                        {userPhotoURL ? (
                                                            <img
                                                                src={userPhotoURL}
                                                                alt={userName}
                                                                className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                                                                {userName.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {userName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {property?.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) || 'Date not available'}
                                                            </p>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        
                                        {/* View Details Arrow */}
                                        <div className="text-primary group-hover:translate-x-1 transition-transform duration-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )
                }
            </div>
            {/* Pagination */}
            {pageCount > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav aria-label="Property pagination" className="flex items-center space-x-2">
                        <button
                            className="flex items-center justify-center w-11 h-11 rounded-full shadow-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            onClick={() => handlePageClick({ selected: currentPage - 1 })}
                            disabled={currentPage === 0}
                            aria-label="Previous"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {Array.from({ length: pageCount }, (_, idx) => (
                            <button
                                key={idx}
                                className={`flex items-center justify-center w-11 h-11 rounded-full shadow-md font-semibold text-lg transition-all duration-200 ${
                                    currentPage === idx 
                                        ? "bg-primary text-white shadow-lg" 
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => handlePageClick({ selected: idx })}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        
                        <button
                            className="flex items-center justify-center w-11 h-11 rounded-full shadow-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            onClick={() => handlePageClick({ selected: currentPage + 1 })}
                            disabled={currentPage === pageCount - 1}
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default properties;