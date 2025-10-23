const persistence = require('./persistence');

/**
 * Gets all photos
 * @returns {Promise<Array>} Array of photo objects
 */
async function getAllPhotos() {
    return await persistence.getAllPhotos();
}

/**
 * Finds a photo by ID
 * @param {number} photoId - The ID of the photo to find
 * @returns {Promise<Object|null>} Photo object or null if not found
 */
async function findPhoto(photoId) {
    const photo = await persistence.findPhotoById(photoId);
    return photo;
}

/**
 * Updates photo details
 * @param {number} photoId - The ID of the photo to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<boolean>} Success status
 */
async function updatePhoto(photoId, updates) {
    const photo = await persistence.findPhotoById(photoId);
    
    if (!photo) {
        return false;
    }
    
    // Create updated photo object
    const updatedPhoto = { ...photo, ...updates };
    return await persistence.updatePhoto(updatedPhoto);
}

/**
 * Gets album photos
 * @param {string} albumName - Name of the album
 * @returns {Promise<Array>} Array of photo objects in the album
 */
async function getAlbumPhotos(albumName) {
    const album = await persistence.findAlbumByName(albumName);
    if (!album) {
        throw new Error('Album not found');
    }
    
    return await persistence.findPhotosByAlbumId(album.id);
}

/**
 * Gets all albums
 * @returns {Promise<Array>} Array of album objects
 */
async function getAllAlbums() {
    return await persistence.readAlbums();
}

/**
 * Finds album by name
 * @param {string} albumName - Name of the album to find
 * @returns {Promise<Object|null>} Album object or null if not found
 */
async function findAlbumByName(albumName) {
    return await persistence.findAlbumByName(albumName);
}

module.exports = {
    getAllPhotos,
    findPhoto,
    updatePhoto,
    getAlbumPhotos,
    getAllAlbums,
    findAlbumByName
};