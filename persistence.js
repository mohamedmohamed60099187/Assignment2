const fs = require('fs').promises;

const COURSES_FILE = './courses.json';
const USERS_FILE = './users.json';

async function readCourses() {
    try {
        const data = await fs.readFile(COURSES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

async function writeCourses(courses) {
    await fs.writeFile(COURSES_FILE, JSON.stringify(courses, null, 2));
}

async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

module.exports = {
    // Course functions
    getAllCourses: readCourses,
    getCourseByCode: async (code) => {
        const courses = await readCourses();
        return courses.find(course => course.code === code);
    },
    updateCourse: async (code, updatedData) => {
        const courses = await readCourses();
        const index = courses.findIndex(course => course.code === code);
        if (index === -1) {
            return false;
        }
        courses[index] = { ...courses[index], ...updatedData };
        await writeCourses(courses);
        return true;
    },

    // User functions
    getUserByUsername: async (username) => {
        const users = await readUsers();
        return users.find(user => user.username === username);
    }
};