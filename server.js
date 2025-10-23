const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const businessLogic = require('./businessLogic');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: undefined,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

/**
 * Home page - List all albums
 * @route GET /
 */
app.get('/', async (req, res) => {
    try {
        const albums = await businessLogic.getAllAlbums();
        res.render('home', { 
            title: 'Digital Media Catalog',
            albums: albums
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).send('Error loading page');
    }
});

/**
 * Album details page - Show photos in an album
 * @route GET /album/:albumName
 */
app.get('/album/:albumName', async (req, res) => {
    try {
        const albumName = req.params.albumName;
        const photos = await businessLogic.getAlbumPhotos(albumName);
        const album = await businessLogic.findAlbumByName(albumName);
        
        if (!album) {
            return res.status(404).send('Album not found');
        }

        const photoCount = photos.length;
        const photoText = photoCount === 1 ? 'photo' : 'photos';
        
        res.render('album', {
            title: `Photos in ${album.name}`,
            album: album,
            photos: photos,
            photoCount: photoCount,
            photoText: photoText
        });
    } catch (error) {
        console.error('Error loading album:', error);
        res.status(500).send('Error loading album');
    }
});

/**
 * Photo details page
 * @route GET /photo/:photoId
 */
app.get('/photo/:photoId', async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        const photo = await businessLogic.findPhoto(photoId);
        
        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        res.render('photo', {
            title: 'Photo Details',
            photo: photo
        });
    } catch (error) {
        console.error('Error loading photo:', error);
        res.status(500).send('Error loading photo');
    }
});

/**
 * Edit photo form
 * @route GET /photo/:photoId/edit
 */
app.get('/photo/:photoId/edit', async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        const photo = await businessLogic.findPhoto(photoId);
        
        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        res.render('edit-photo', {
            title: 'Edit Photo',
            photo: photo
        });
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).send('Error loading edit form');
    }
});

/**
 * Update photo details (PRG pattern)
 * @route POST /photo/:photoId/edit
 */
app.post('/photo/:photoId/edit', async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        const { title, description } = req.body;
        
        const success = await businessLogic.updatePhoto(photoId, {
            title: title,
            description: description
        });

        if (success) {
            // PRG pattern - redirect after POST
            res.redirect(`/photo/${photoId}`);
        } else {
            res.status(400).render('error', {
                title: 'Update Failed',
                message: 'Failed to update photo. Please try again.'
            });
        }
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).render('error', {
            title: 'Update Error',
            message: 'An error occurred while updating the photo.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Digital Media Catalog running on http://localhost:${PORT}`);
});

module.exports = app;