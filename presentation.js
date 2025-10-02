const readline = require('readline');
const businessLogic = require('./businessLogic');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentUser = null;

/**
 * Displays the main menu and handles user input
 */
function showMainMenu() {
    console.log('\n=== Digital Media Catalog ===');
    console.log(`Logged in as: ${currentUser.username}`);
    console.log('1. List My Photos');
    console.log('2. Find Photo by ID');
    console.log('3. Update Photo Details');
    console.log('4. Album Photo List');
    console.log('5. Add Tag to Photo');
    console.log('6. Logout');
    console.log('7. Exit');
    
    rl.question('Choose an option: ', handleMainMenuChoice);
}

/**
 * Handles main menu selection
 * @param {string} choice - User's menu choice
 */
function handleMainMenuChoice(choice) {
    switch (choice) {
        case '1':
            listMyPhotos();
            break;
        case '2':
            findPhotoById();
            break;
        case '3':
            updatePhotoDetails();
            break;
        case '4':
            displayAlbumPhotos();
            break;
        case '5':
            addTagToPhoto();
            break;
        case '6':
            logout();
            break;
        case '7':
            console.log('Goodbye!');
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            showMainMenu();
    }
}

/**
 * Lists all photos owned by the current user
 */
async function listMyPhotos() {
    try {
        console.log('\n--- My Photos ---');
        const photos = await businessLogic.getAllPhotos(currentUser.id);
        
        if (photos.length === 0) {
            console.log('No photos found.');
        } else {
            photos.forEach(photo => {
                console.log(`ID: ${photo.id}, Title: ${photo.title}, Date: ${photo.date}`);
                console.log(`   Description: ${photo.description}`);
                console.log(`   Filename: ${photo.filename}\n`);
            });
        }
        showMainMenu();
    } catch (error) {
        console.error('Error listing photos:', error.message);
        showMainMenu();
    }
}

/**
 * Finds and displays a specific photo by ID
 */
async function findPhotoById() {
    rl.question('Enter Photo ID: ', async (photoId) => {
        try {
            const id = parseInt(photoId);
            if (isNaN(id)) {
                console.log('Please enter a valid number.');
                showMainMenu();
                return;
            }

            const photo = await businessLogic.findPhoto(id, currentUser.id);
            if (photo) {
                console.log('\n--- Photo Details ---');
                console.log(`ID: ${photo.id}`);
                console.log(`Title: ${photo.title}`);
                console.log(`Description: ${photo.description}`);
                console.log(`Date: ${photo.date}`);
                console.log(`Filename: ${photo.filename}`);
                console.log(`Resolution: ${photo.resolution}`);
                console.log(`Tags: ${photo.tags.join(', ')}`);
            } else {
                console.log('Photo not found.');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        showMainMenu();
    });
}

/**
 * Updates photo details
 */
async function updatePhotoDetails() {
    rl.question('Enter Photo ID to update: ', async (photoId) => {
        try {
            const id = parseInt(photoId);
            if (isNaN(id)) {
                console.log('Please enter a valid number.');
                showMainMenu();
                return;
            }

            rl.question('Enter new title: ', async (newTitle) => {
                const success = await businessLogic.updatePhoto(
                    id, 
                    { title: newTitle }, 
                    currentUser.id
                );
                
                if (success) {
                    console.log('Photo updated successfully!');
                } else {
                    console.log('Failed to update photo. Photo may not exist.');
                }
                showMainMenu();
            });
        } catch (error) {
            console.error('Error:', error.message);
            showMainMenu();
        }
    });
}

/**
 * Display album photos in CSV format
 */
async function displayAlbumPhotos() {
    rl.question('Enter album name: ', async (albumName) => {
        try {
            const albumPhotos = await businessLogic.getAlbumPhotos(albumName, currentUser.id);
            
            if (albumPhotos.length === 0) {
                console.log('No photos found in this album or album does not exist.');
            } else {
                console.log('\n--- Album Photos (CSV Format) ---');
                console.log('filename,resolution,tags');
                albumPhotos.forEach(photo => {
                    console.log(`${photo.filename},${photo.resolution},${photo.tags.join(':')}`);
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        showMainMenu();
    });
}

/**
 * Add tag to a photo
 */
async function addTagToPhoto() {
    rl.question('Enter Photo ID to tag: ', async (photoId) => {
        try {
            const id = parseInt(photoId);
            if (isNaN(id)) {
                console.log('Please enter a valid number.');
                showMainMenu();
                return;
            }

            rl.question('Enter tag to add: ', async (tag) => {
                const success = await businessLogic.addTagToPhoto(id, tag, currentUser.id);
                
                if (success) {
                    console.log('Tag added successfully!');
                } else {
                    console.log('Failed to add tag. Photo may not exist or tag already exists.');
                }
                showMainMenu();
            });
        } catch (error) {
            console.error('Error:', error.message);
            showMainMenu();
        }
    });
}

/**
 * Handles user logout
 */
function logout() {
    currentUser = null;
    console.log('Logged out successfully.');
    startLogin();
}

/**
 * Starts the login process
 */
async function startLogin() {
    console.log('\n=== Digital Media Catalog Login ===');
    rl.question('Username: ', async (username) => {
        rl.question('Password: ', async (password) => {
            try {
                const user = await businessLogic.verifyUser(username, password);
                if (user) {
                    currentUser = user;
                    console.log(`\nWelcome, ${user.username}!`);
                    showMainMenu();
                } else {
                    console.log('Invalid username or password. Please try again.');
                    startLogin();
                }
            } catch (error) {
                console.error('Login error:', error.message);
                startLogin();
            }
        });
    });
}

// Start the application
console.log('Digital Media Catalog - Assignment 2');
startLogin();