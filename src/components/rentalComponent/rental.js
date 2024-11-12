import zoneColor from "../ZoneColor/zoneColor";
export default function reservation({ name, landowner, start, end, address, image, growthZone }) {
    // Convert timestamps to 'Month Day, Year' format
    const formattedStartDate = new Date(start).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    const formattedEndDate = new Date(end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        // <section className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-lg border-2 py-1 border-gray-200 bg-main-background mb-6">
        <section className="w-full  rounded-lg border-2 py-1 border-gray-200 bg-main-background mb-6">
            {/* Image */}
            <img src={image} alt="Listing" className="w-full h-auto" />
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold">{name}</h2>
                    </div>
                    <div className="flex items-center flex-row gap-1">
                        <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: zoneColor(growthZone) }}></div>
                        <p>Zone {growthZone}</p>
                    </div>
                </div>
                <p>Listed by: {landowner}</p>
            </div>

            <div className="flex items-center border-y border-black p-3">

                <div className="w-2/4 border-r border-black m-1">
                    <p>{formattedStartDate} - </p>
                    <p>{formattedEndDate}</p>
                </div>

                <div className="w-2/4 px-2">

                    <p>{address}</p>
                </div>
            </div>
            <div className="text-center p-5">
                <button className="text-teal-600 text-xl font-bold text-center">View Details</button>
            </div>
        </section >
    );
}