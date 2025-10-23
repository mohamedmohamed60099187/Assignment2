const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://60099187:mohamed123@cluster0.gcujo6f.mongodb.net/";
const DB_NAME = 'infs3201_fall2025';

let db = null;
let client = null;

/**
 * Connects to MongoDB database
 * @returns {Promise<Object>} Database connection
 */
async function connectToDatabase() {
    if (db) {
        return db;
    }

    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB database:', DB_NAME);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

/**
 * Gets database instance
 * @returns {Promise<Object>} Database instance
 */
async function getDatabase() {
    if (!db) {
        await connectToDatabase();
    }
    return db;
}

/**
 * Reads photos data from MongoDB
 * @returns {Promise<Array>} Array of photo objects
 */
async function readPhotos() {
    try {
        const database = await getDatabase();
        const photos = await database.collection('photos').find({}).toArray();
        return photos;
    } catch (error) {
        console.error('Error reading photos from MongoDB:', error.message);
        return [];
    }
}

/**
 * Reads albums data from MongoDB
 * @returns {Promise<Array>} Array of album objects
 */
async function readAlbums() {
    try {
        const database = await getDatabase();
        const albums = await database.collection('albums').find({}).toArray();
        return albums;
    } catch (error) {
        console.error('Error reading albums from MongoDB:', error.message);
        return [];
    }
}

/**
 * Finds a photo by ID
 * @param {number} photoId - The ID of the photo to find
 * @returns {Promise<Object|null>} Photo object or null if not found
 */
async function findPhotoById(photoId) {
    try {
        const database = await getDatabase();
        const photo = await database.collection('photos').findOne({ id: photoId });
        return photo;
    } catch (error) {
        console.error('Error finding photo by ID:', error.message);
        return null;
    }
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
    try {
        const database = await getDatabase();
        const photos = await database.collection('photos').find({ 
            albums: { $in: [albumId] } 
        }).toArray();
        return photos;
    } catch (error) {
        console.error('Error finding photos by album ID:', error.message);
        return [];
    }
}

/**
 * Finds album by name
 * @param {string} albumName - Name of the album to find
 * @returns {Promise<Object|null>} Album object or null if not found
 */
async function findAlbumByName(albumName) {
    try {
        const database = await getDatabase();
        const album = await database.collection('albums').findOne({ 
            name: new RegExp(`^${albumName}$`, 'i') 
        });
        return album;
    } catch (error) {
        console.error('Error finding album by name:', error.message);
        return null;
    }
}

/**
 * Updates photo data
 * @param {Array} photos - Updated photos array
 * @returns {Promise<boolean>} Success status
 */
async function updatePhotos(photos) {
    try {
        const database = await getDatabase();
        
        // Update each photo individually
        for (const photo of photos) {
            await database.collection('photos').updateOne(
                { id: photo.id },
                { $set: photo }
            );
        }
        return true;
    } catch (error) {
        console.error('Error updating photos in MongoDB:', error.message);
        return false;
    }
}

/**
 * Updates a single photo
 * @param {Object} photoUpdate - Photo update object
 * @returns {Promise<boolean>} Success status
 */
async function updatePhoto(photoUpdate) {
    try {
        const database = await getDatabase();
        const result = await database.collection('photos').updateOne(
            { id: photoUpdate.id },
            { $set: photoUpdate }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating photo in MongoDB:', error.message);
        return false;
    }
}

/**
 * Closes database connection
 */
async function closeConnection() {
    if (client) {
        await client.close();
        db = null;
        client = null;
        console.log('MongoDB connection closed');
    }
}

module.exports = {
    readPhotos,
    readAlbums,
    findPhotoById,
    getAllPhotos,
    updatePhotos,
    updatePhoto,
    findPhotosByAlbumId,
    findAlbumByName,
    closeConnection
};