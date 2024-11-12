/**
 * SearchBar.js
 * Description: Component that displays a search bar with a search icon.
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange, onClick, onKeyDown, onClickSearchIcon }) {
    return (
    <div className="w-full flex items-center input-wrapper rounded-md border border-gray-300 p-1 mx-2 z-50">
        <input placeholder="Search" className=" px-2 w-full outline-none focus:border-none" type="text" value={value} onChange={onChange} onClick={onClick} onKeyDown={onKeyDown}/>
        <FaSearch className="search-icon mx-1" onClick={onClickSearchIcon}/>

    </div>
  );
}