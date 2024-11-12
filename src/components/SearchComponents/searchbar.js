/**
 * SearchBar.js
 * Description: Component that displays a search bar with a search icon.
 * Frontend Author: Lilian Huh
 * Date: 2024-10-23
 */

import ReactSearchBox from "react-search-box";
import { FaSearch } from "react-icons/fa";

// This is the SearchBar component that will be used in the Search and MapSearch pages of the application
export default function SearchBar() {
  return (
  <div className="p-2 fixed top-0 mt-10 px-8 mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <ReactSearchBox placeholder="Search" inputFontColor="black" inputBorderColor="black" leftIcon={<FaSearch className="text-gray-500" />}/>
    </div>

  );
}