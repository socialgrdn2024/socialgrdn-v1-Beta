/**
 * PopupSearchFilter.js
 * Description: Component that displays the popup filter for the search page
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";

export default function PopupSearchFilter({ isOpen, onClose, onApplyFilters }) {
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [cropType, setCropType] = useState("");
    const [gardenSize, setGardenSize] = useState([0, 1000]);
    const [soilType, setSoilType] = useState("");

    // Handle filter submission
    const handleApplyFilters = (e) => {
        e.preventDefault();

        const filters = {
            priceRange: { min: priceRange[0], max: priceRange[1] },
            cropType,
            gardenSize: { min: gardenSize[0], max: gardenSize[1] },
            soilType,
        };

        onApplyFilters(filters);
        onClose();
    };


    // Reset filters when popup is closed
    useEffect(() => {
        if (!isOpen) {
            setPriceRange([0, 10000]);
            setCropType("");
            setGardenSize([0, 1000]);
            setSoilType("");
        }
    }, [isOpen]);


    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-1/3 bg-white shadow-lg transform transition-transform duration-300 z-10 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="p-4">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    Close
                </button>
                <form className="mt-4" onSubmit={handleApplyFilters}>
                    <h1 className="text-xl font-bold">Filters</h1>

                    {/* Price Range Filter */}
                    <label className="mt-2 text-gray-600">
                        <h2>Price</h2>
                    </label>

                    {/* Dual Range Slider for Price */}
                    <ReactSlider
                        className="horizontal-slider"
                        thumbClassName="example-thumb"
                        trackClassName="example-track"
                        value={priceRange}
                        onChange={(value) => setPriceRange(value)}
                        min={0}
                        max={10000}
                        pearling
                        minDistance={10}
                    />

                    {/* Display price min/max */}
                    <div className="flex flex-row justify-between mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>

                    {/* Other Filters */}

                    {/* Crop Type Filter */}
                    <div className="mt-2">
                        <h2>Type of Crops</h2>
                        <div className="m-1">
                            <input 
                                type="radio" 
                                name="Crops" 
                                value="All" 
                                checked={cropType === "All"}
                                onChange={() => setCropType("All")} 
                            />
                            <label> All</label>
                        </div>
                        <div className="m-1">
                            <input 
                                type="radio" 
                                name="Crops" 
                                value="Fruit" 
                                checked={cropType === "Fruit"}
                                onChange={() => setCropType("Fruit")} 
                            />
                            <label> Fruit</label>
                        </div>
                        <div className="m-1">
                            <input 
                                type="radio" 
                                name="Crops" 
                                value="Vegetable" 
                                checked={cropType === "Vegetable"} 
                                onChange={() => setCropType("Vegetable")} 
                            />
                            <label> Vegetable</label>
                        </div>
                        <div className="m-1">
                            <input 
                                type="radio" 
                                name="Crops" 
                                value="Cereal" 
                                checked={cropType === "Cereal"} 
                                onChange={() => setCropType("Cereal")} 
                            />
                            <label> Cereal</label>
                        </div>
                        <div className="m-1">
                            <input 
                                type="radio" 
                                name="Crops" 
                                value="Spices" 
                                checked={cropType === "Spices"} 
                                onChange={() => setCropType("Spices")} 
                            />
                            <label> Spices</label>
                        </div>
                    </div>
                    
                    {/* Garden Size Filter */}
                    <label className="m-2 text-gray-600">
                        <h2>Garden Size</h2>
                        <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="example-thumb"
                            trackClassName="example-track"
                            value={gardenSize}
                            onChange={(value) => setGardenSize(value)}
                            min={0}
                            max={1000}
                            pearling
                            minDistance={10}
                        />
                        <div className="flex flex-row justify-between mt-2">
                            <span>{gardenSize[0]} sqft</span>
                            <span>{gardenSize[1]} sqft</span>
                        </div>
                    </label>

                    {/* Soil Type Filter */}
                    <h2>Soil Types</h2>
                    <div className="flex flex-row gap-10 mt-2">
                        <div className="flex flex-col">
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Loamy" 
                                    checked={soilType === "Loamy"} 
                                    onChange={() => setSoilType("Loamy")} 
                                />
                                <label> Loamy</label>
                            </div>
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Clay" 
                                    checked={soilType === "Clay"} 
                                    onChange={() => setSoilType("Clay")} 
                                />
                                <label> Clay</label>
                            </div>
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Sandy" 
                                    checked={soilType === "Sandy"} 
                                    onChange={() => setSoilType("Sandy")} 
                                />
                                <label> Sandy</label>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Silty" 
                                    checked={soilType === "Silty"} 
                                    onChange={() => setSoilType("Silty")} 
                                />
                                <label> Silty</label>
                            </div>
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Chalk" 
                                    checked={soilType === "Chalk"} 
                                    onChange={() => setSoilType("Chalk")} 
                                />
                                <label> Chalk</label>
                            </div>
                            <div className="m-1">
                                <input 
                                    type="radio" 
                                    name="Soil" 
                                    value="Peat" 
                                    checked={soilType === "Peat"} 
                                    onChange={() => setSoilType("Peat")} 
                                />
                                <label> Peat</label>
                            </div>
                        </div>
                    </div>

                    {/* Apply Button for the filter*/}
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg">
                        Apply
                    </button>
                </form>
            </div>
        </div>
    );
}
