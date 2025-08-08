import SearchResult from "@/Components/SearchResult/SearchResult";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/Contexts/AuthContext";
import Loader from "@/Components/Shared/Loader/Loader";

function searchResult() {
  const { user, loading } = useAuth();
  const [searchData, setSearchData] = useState([]);
  const router = useRouter();
  //   const data = router.query;
    // loading
  if (loading) {
    return <Loader></Loader>;
  }
  useEffect(() => {
    setSearchData(JSON.parse(router.query.data));
  }, [router.query]);
  return <SearchResult searchData={searchData} />;
}

export default searchResult;
