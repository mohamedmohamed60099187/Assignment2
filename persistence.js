const fs = require('fs').promises;

/**
 * Reads photos data from JSON file
 * @returns {Promise<Array>} Array of photo objects
 */
async function readPhotos() {
    try {
        const data = await fs.readFile('photos.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading photos file:', error.message);
        return [];
    }
}

/**
 * Reads users data from JSON file
 * @returns {Promise<Array>} Array of user objects
 */
async function readUsers() {
    try {
        const data = await fs.readFile('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error.message);
        return [];
    }
}

/**
 * Finds a photo by ID
 * @param {number} photoId - The ID of the photo to find
 * @returns {Promise<Object|null>} Photo object or null if not found
 */
async function findPhotoById(photoId) {
    const photos = await readPhotos();
    return photos.find(photo => photo.id === photoId) || null;
}

/**
 * Gets all photos (no filtering)
 * @returns {Promise<Array>} Array of all photo objects
 */
async function getAllPhotos() {
    return await readPhotos();
}

/**
 * Updates photo data
 * @param {Array} photos - Updated photos array
 * @returns {Promise<boolean>} Success status
 */
async function updatePhotos(photos) {
    try {
        await fs.writeFile('photos.json', JSON.stringify(photos, null, 2));
        return true;
    } catch (error) {
        console.error('Error updating photos:', error.message);
        return false;
    }
}

// Make sure ALL functions are exported
module.exports = {
    readPhotos,
    readUsers,
    findPhotoById,
    getAllPhotos,
    updatePhotos
};