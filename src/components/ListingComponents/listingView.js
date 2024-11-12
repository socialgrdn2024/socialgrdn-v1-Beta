/**
 * ListingView.js
 * Description: Component that displays the listings on View Listings page
 * Frontend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import ExampleImage from "../../assets/exampleAssets/imgExample.jpg";

export default function ListingView() {
    return (
        <div className="w-96 h-40 rounded-lg border-2 border-gray-200 bg-main-background">
            <div className="flex flex-row w-auto h-auto m-4 gap-5">
                <div className="w-auto h-32">
                    <img src={ExampleImage} alt="Garden" className="w-48 h-32 rounded-lg border-2 border-gray-200" />
                </div>
                <div className="flex flex-col w-auto gap-1">
                    <div className="w-40 h-24">
                        <h1 className="text-lg font-bold">Listing Title</h1>
                        <h2 className="text-sm">Listing Address </h2>
                    </div>
                    <div className="ml-28">
                        <button className="text-green-600 font-bold text-lg">View</button>
                    </div>
                </div>

            </div>
        </div>

  );
}