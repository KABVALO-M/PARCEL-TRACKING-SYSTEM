const axios = require('axios');
const Parcel = require('../models/Parcel');

// Sample tracking data with latitude and longitude for devices, using string keys
const trackingData = {
    'device1': {
        lat: -15.799939,
        lon: 35.026963
    },
    'device2': {
        lat: -14.6349,
        lon: 33.7833
    },
    'device3': {
        lat: -13.9300,
        lon: 33.7900
    }
};

// Mapping between integer tracking device IDs and string keys in trackingData
const trackingDeviceMapping = {
    1: 'device3',
    2: 'device1',
    3: 'device2'
};

/**
 * Perform reverse geocoding using ArcGIS API
 * @param {number} lat - Latitude of the device
 * @param {number} lon - Longitude of the device
 * @returns {Promise<string>} - Returns a promise that resolves to the location name
 */
async function reverseGeocode(lat, lon) {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lon},${lat}&f=json`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.address) {
            return response.data.address.Match_addr;
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error during reverse geocoding:', error.message);
        throw error;
    }
}

/**
 * Get the location name for a given tracking number by reverse geocoding
 * @param {string} trackingNumber - The tracking number of the parcel
 * @returns {Promise<string>} - Returns a promise that resolves to the location name
 */
async function getLocationName(trackingNumber) {
    try {
        // Get parcel details from the database using the Parcel model
        const parcel = await Parcel.findByTrackingNumber(trackingNumber);
        
        if (!parcel) {
            return 'Parcel not found';
        }

        // Extract the tracking device ID from the parcel
        const trackingDeviceId = parcel.tracking_device_id;

        // Retrieve the string key for the tracking device
        const trackingDeviceKey = trackingDeviceMapping[trackingDeviceId];

        // Retrieve location data for the tracking device
        const locationData = trackingData[trackingDeviceKey];

        if (locationData) {
            // Perform reverse geocoding to obtain the location name
            const locationName = await reverseGeocode(locationData.lat, locationData.lon);
            return locationName;
        } else {
            return 'Location data not available for this device';
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
}

module.exports = {
    getLocationName,
};
