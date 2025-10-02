const persistence = require('./persistence');

/**
 * Gets all photos with optional ownership check
 * @param {number} userId - The ID of the user making the request
 * @returns {Promise<Array>} Array of photo objects
 */
async function getAllPhotos(userId = null) {
    const photos = await persistence.getAllPhotos();
    if (userId) {
        return photos.filter(photo => photo.owner === userId);
    }
    return photos;
}

/**
 * Finds a photo by ID with ownership verification
 * @param {number} photoId - The ID of the photo to find
 * @param {number} userId - The ID of the user making the request
 * @returns {Promise<Object|null>} Photo object or null if not found/unauthorized
 */
async function findPhoto(photoId, userId) {
    const photo = await persistence.findPhotoById(photoId);
    if (!photo) {
        return null;
    }
    if (photo.owner !== userId) {
        throw new Error('Access denied: You do not own this photo');
    }
    return photo;
}

/**
 * Verifies user credentials
 * @param {string} username - Username to verify
 * @param {string} password - Password to verify
 * @returns {Promise<Object|null>} User object or null if invalid
 */
async function verifyUser(username, password) {
    const users = await persistence.readUsers();
    const user = users.find(user => 
        user.username === username && user.password === password
    );
    return user || null;
}

/**
 * Updates photo details with ownership check
 * @param {number} photoId - The ID of the photo to update
 * @param {Object} updates - Object containing fields to update
 * @param {number} userId - The ID of the user making the request
 * @returns {Promise<boolean>} Success status
 */
async function updatePhoto(photoId, updates, userId) {
    const photos = await persistence.getAllPhotos();
    const photoIndex = photos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex === -1) {
        return false;
    }
    
    if (photos[photoIndex].owner !== userId) {
        throw new Error('Access denied: Cannot update photos you do not own');
    }
    
    photos[photoIndex] = { ...photos[photoIndex], ...updates };
    return await persistence.updatePhotos(photos);
}

/**
 * Adds tag to photo with ownership check
 * @param {number} photoId - The ID of the photo to tag
 * @param {string} tag - Tag to add
 * @param {number} userId - The ID of the user making the request
 * @returns {Promise<boolean>} Success status
 */
async function addTagToPhoto(photoId, tag, userId) {
    const photos = await persistence.readPhotos();
    const photoIndex = photos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex === -1) {
        return false;
    }
    
    if (photos[photoIndex].owner !== userId) {
        throw new Error('Access denied: Cannot tag photos you do not own');
    }
    
    if (!photos[photoIndex].tags.includes(tag)) {
        photos[photoIndex].tags.push(tag);
        return await persistence.updatePhotos(photos);
    }
    
    return false;
}

/**
 * Gets album photos with ownership check
 * @param {string} albumName - Name of the album
 * @param {number} userId - The ID of the user making the request
 * @returns {Promise<Array>} Array of photo objects in the album that user owns
 */
async function getAlbumPhotos(albumName, userId) {
    const album = await persistence.findAlbumByName(albumName);
    if (!album) {
        throw new Error('Album not found');
    }
    
    const albumPhotos = await persistence.findPhotosByAlbumId(album.id);
    return albumPhotos.filter(photo => photo.owner === userId);
}

/**
 * Gets all albums
 * @returns {Promise<Array>} Array of album objects
 */
async function getAllAlbums() {
    return await persistence.readAlbums();
}

module.exports = {
    getAllPhotos,
    findPhoto,
    verifyUser,
    updatePhoto,
    addTagToPhoto,
    getAlbumPhotos,
    getAllAlbums
};