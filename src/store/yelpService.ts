const YELP_API_KEY =
  "AMw7CvCIH7NIAUZYcLb42l1PSEXqvhoLajHa9MfbaQiCRz0NcCK3F6H5O55LRci52E1kgbuPdnui1UfPogNJe1KJqSVItJoXGDklJwkt0LfYH0MG788Z0-GjYInaaXYx";

export const getRestaurants = async (location: string = "Grand Rapids, MI") => {
  try {
    const response = await fetch(
      `/api/businesses/search?location=${location}&categories=restaurants`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data.businesses; // This returns the array of restaurants
  } catch (error) {
    console.error("Error fetching Yelp data:", error);
    return [];
  }
};
