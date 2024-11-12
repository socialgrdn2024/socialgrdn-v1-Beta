/**
 * FilterButton.js
 * Description: Component that displays the filter button for the search bar
 * Frontend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import { LuListFilter } from "react-icons/lu";

export default function FilterButton({onclick}) {

    return (
        <button type="filter" className="flex items-start justify-start w-auto h-auto z-50" onClick={onclick}>
            <LuListFilter className=" m-1 text-2xl " />
        </button>
    );
}