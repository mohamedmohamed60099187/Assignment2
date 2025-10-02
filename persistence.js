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
 * Reads albums data from JSON file
 * @returns {Promise<Array>} Array of album objects
 */
async function readAlbums() {
    try {
        const data = await fs.readFile('albums.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading albums file:', error.message);
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
 * Finds photos by album ID
 * @param {number} albumId - The ID of the album
 * @returns {Promise<Array>} Array of photo objects in the album
 */
async function findPhotosByAlbumId(albumId) {
    const photos = await readPhotos();
    return photos.filter(photo => photo.albums.includes(albumId));
}

/**
 * Finds album by name
 * @param {string} albumName - Name of the album to find
 * @returns {Promise<Object|null>} Album object or null if not found
 */
async function findAlbumByName(albumName) {
    const albums = await readAlbums();
    return albums.find(album => album.name.toLowerCase() === albumName.toLowerCase()) || null;
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

module.exports = {
    readPhotos,
    readUsers,
    readAlbums,
    findPhotoById,
    getAllPhotos,
    updatePhotos,
    findPhotosByAlbumId,
    findAlbumByName
};