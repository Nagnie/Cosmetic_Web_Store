const LocationService = {
  fetchProvinces: async () => {
    const response = await fetch(
      `https://open.oapi.vn/location/provinces?page=0&size=1000`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },

  fetchDistricts: async (cityId) => {
    const response = await fetch(
      `https://open.oapi.vn/location/districts/${cityId}?page=0&size=1000`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },

  fetchWards: async (districtId) => {
    const response = await fetch(
      `https://open.oapi.vn/location/wards/${districtId}?page=0&size=1000`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },
};

export default LocationService;
