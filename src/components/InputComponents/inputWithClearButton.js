import React from "react";
import { IoMdClose } from "react-icons/io";

function InputWithClearButton({ placeholder, type = "text", id, value, onChange }) {
    const handleClear = () => onChange({ target: { value: "" } });

    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder} // Use placeholder
                className="p-2 w-full border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            {value && (
                <IoMdClose
                    onClick={handleClear}
                    className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-black"
                    size={20}
                />
            )}
        </div>
    );
}

export default InputWithClearButton;
