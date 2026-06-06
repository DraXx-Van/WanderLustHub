const axios = require("axios");

module.exports.geocode = async (location) => {
    
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q:location,
                format: "jsonv2",
                limit: 1,
            },
            headers: {
                "User-Agent": "StayNest"
            }
        }
    );

    if (!response.data.length) {
        throw new Error("Location not found");
    }

    return {
        lat: Number(response.data[0].lat),
        lng: Number(response.data[0].lon),
    };
}