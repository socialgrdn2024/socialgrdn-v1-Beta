import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InAppLogo from "../../components/Logo/inAppLogo";
import SearchBar from "../../components/SearchComponents/search";
import NavBarModerator from "../../components/Navbar/navbarmoderator";

export default function ModeratorViewMonthlyReport() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const month = queryParams.get("month");
    const year = queryParams.get("year");

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [monthlyReport, setMonthlyReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonthlyReport = async () => {
            try {
                const response = await fetch(`/api/GetMonthlyReportAPI?year=${year}&month=${month}`);
                if (!response.ok) {
                    const errorText = await response.text(); // Get the error text from the response
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setMonthlyReport(data);
            } catch (error) {
                console.error("Fetch error:", error); // Log detailed error to the console
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyReport();
    }, [month, year]);

    return (
        <div className="bg-main-background">
            <div className="flex flex-col items-center justify-center min-h-screen pb-20">
                <div className="p-2 fixed top-0 left-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                    <InAppLogo />
                </div>
                <div className='mx-2 px-2 fixed top-12 flex w-full items-center justify-between bg-main-background'>
                    <div className="flex-grow w-full">
                        <SearchBar className="w-full" />
                    </div>
                </div>

                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-4 ">
                    <div className="pb-5">
                        <p className="text-2xl font-bold text-left ml-2">Monthly Reports</p>
                    </div>

                    <div className="flex justify-between items-center pb-5 text-left ml-4">
                        <h1 className="text-2xl font-semibold">{`${monthNames[month - 1]} ${year}`}</h1>
                        <button className="text-green-500 font-bold py-2 px-4">Download Report PDF</button>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : (
                        <table className="min-w-full">
                            <tbody>
                                <tr>
                                    <td className="py-2 px-4 ">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">No. of Bookings</span>
                                            <span className="text-right">{monthlyReport.number_of_bookings}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-semibold">Total Booking Amount</span>
                                            <span className="text-right">{`$${monthlyReport.total_booking_amount}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-semibold">Total Revenue 3%</span>
                                            <span className="text-right ">{`$${monthlyReport.total_revenue}`}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <NavBarModerator ReportColor={"#00B761"} />
        </div>
    );
}
