
import { Carousel } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineApartment, MdOutlineBathroom, MdOutlineBedroomChild } from 'react-icons/md';
import { TfiLocationPin } from 'react-icons/tfi';

const properties = () => {
    const router = useRouter();
    const divisionId = router.query.divisionId;
    const [divisions, setDivision] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    // Search state
    const [searchLocation, setSearchLocation] = useState('');
    const [searchType, setSearchType] = useState('');

    // For dropdown options
    const [locationOptions, setLocationOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);

    useEffect(() => {
        fetch(`https://server-fare-bd.vercel.app/property`)
            .then((res) => res.json())
            .then((data) => {
                setDivision(data);

                // Extract unique locations and property types for dropdowns
                const locations = Array.from(new Set(data.map(item => item.location).filter(Boolean)));
                setLocationOptions(locations);

                const types = Array.from(new Set(data.map(item => item.property_type).filter(Boolean)));
                setTypeOptions(types);
            });
    }, []);

    // Filtered items based on search
    const filteredItems = useMemo(() => {
        return divisions.filter(item => {
            const matchesLocation = searchLocation ? item.location === searchLocation : true;
            const matchesType = searchType ? item.property_type === searchType : true;
            return matchesLocation && matchesType;
        });
    }, [divisions, searchLocation, searchType]);

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
    }, [searchLocation, searchType]);

    // Handle search form submit (optional, for button)
    const handleSearch = (e) => {
        e.preventDefault();
        setItemOffset(0);
    };

    return (
        <div className='max-w-[1440px] w-[95%] mx-auto text-center'>
            <h1 className='my-12 text-3xl font-bold'>Properties of {divisionId} Division</h1>

            {/* Search Engine */}
            <form className="mb-8" onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-4">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="searchLocation" className="block text-left mb-1 font-medium text-gray-700">Location</label>
                        <select
                            id="searchLocation"
                            value={searchLocation}
                            onChange={e => setSearchLocation(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            aria-label="Select location"
                        >
                            <option value="">All Locations</option>
                            {locationOptions.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/3">
                        <label htmlFor="searchType" className="block text-left mb-1 font-medium text-gray-700">Property Type</label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={e => setSearchType(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            aria-label="Select property type"
                        >
                            <option value="">All Types</option>
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary/90 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            <div className='gap-8 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
                <div className='lg:col-span-3 md:col-span-2 col-span-1 mx-auto mb-8'>
                    <div className='min-h-screen'>
                        {
                            currentItems.length === 0 ? (
                                <div className="text-center text-gray-500 mt-5">No properties found.</div>
                            ) : (
                                currentItems.map(division =>
                                    <Link
                                        key={division?._id}
                                        href={`/singleproperty/${division?._id}`}
                                        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 h-64 my-4 transition"
                                    >
                                        <img className="h-full w-96 object-cover rounded-l-lg" src={division?.property_picture} alt="img" />
                                        <div className="flex flex-col justify-start ml-8 p-4 leading-normal my-4 w-full">
                                            <div className='grid gap-1.5'>
                                                <p ><span className='flex font-bold text-xl'>$ {division?.price}</span></p>
                                                <p className='font-bold text-start'>{division?.property_type}</p>
                                                <p><span className='flex text-xs items-center'><TfiLocationPin className='mt-1 mr-1' /> {division?.location} </span></p>
                                            </div>
                                            <h2 className='text-sm mt-4 text-start'>{division?.property_heading}</h2>
                                            <div className='flex justify-start gap-8 mt-4 font-bold text-secondary'>
                                                <div className='flex gap-1 items-center'><MdOutlineApartment className='mt-1' /><p>{division?.flat_feature?.[0]?.floor}</p></div>
                                                <div className='flex gap-1 items-center'><MdOutlineBedroomChild className='mt-1' /><p>{division?.flat_feature?.[0]?.room}</p></div>
                                                <div className='flex gap-1 items-center'><MdOutlineBathroom className='mt-1' /><p>{division?.flat_feature?.[0]?.bathroom}</p></div>
                                                <div className='flex gap-1 items-center'><HiOutlineSquares2X2 className='mt-1' /><p>{division?.size}</p></div>
                                            </div>
                                            <div className='flex justify-start gap-5 mt-4'>
                                                <img className='h-10 w-10 rounded-full' src={division?.user_image} alt="" />
                                                <img className='h-12' src="https://lh3.googleusercontent.com/pw/AMWts8D7jqd4R67XBB7IKs6Hi8jRKjgJ-2XmxdiU66iGxHdTNdqGNjtsTaPNYu-xcXf7ZOzAvzwtf_zJZzKfA0H7MFaNGFwcuEBsK1nQBXSC6Uxk_lz5eCCKOnf8MsAA0URa3-TL3W-88iNp0tN5eEK94LRq=w538-h274-no?authuser=0" alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            )
                        }
                    </div>
                    {/* Cool UI Pagination using react-bootstrap, horizontal layout */}
                    <div className="mt-6 d-flex justify-content-center">
                        <nav aria-label="Property pagination">
                            <div className="d-flex flex-row align-items-center gap-2">
                                <button
                                    className="btn btn-light d-flex align-items-center justify-content-center rounded-circle shadow"
                                    style={{ width: 44, height: 44 }}
                                    onClick={() => handlePageClick({ selected: currentPage - 1 })}
                                    disabled={currentPage === 0}
                                    aria-label="Previous"
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                                {Array.from({ length: pageCount }, (_, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn d-flex align-items-center justify-content-center rounded-circle shadow ${currentPage === idx ? "btn-primary text-green-500 border-primary" : "btn-light"}`}
                                        style={{ width: 44, height: 44, fontWeight: 600, fontSize: 18 }}
                                        onClick={() => handlePageClick({ selected: idx })}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-light d-flex align-items-center justify-content-center rounded-circle shadow"
                                    style={{ width: 44, height: 44 }}
                                    onClick={() => handlePageClick({ selected: currentPage + 1 })}
                                    disabled={currentPage === pageCount - 1}
                                    aria-label="Next"
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className=''>
                    <div className="h-64 sm:h-64 xl:h-80 2xl:h-96">
                        <Carousel slide={false}>
                            <img
                                src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                                alt="..."
                            />
                            <img
                                src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
                                alt="..."
                            />
                            <img
                                src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
                                alt="..."
                            />
                            <img
                                src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
                                alt="..."
                            />
                            <img
                                src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
                                alt="..."
                            />
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default properties;