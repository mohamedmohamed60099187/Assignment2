const persistence = require('./persistence');

module.exports = {

    getUserByUsername: async (username) => {
        return await persistence.getUserByUsername(username);
    allCourses: async () => {
        return await persistence.getAllCourses();
    },

    findCourse: async (code) => {
        return await persistence.getCourseByCode(code);
    },

    updateCapacity: async (code, capacity, userId) => {
        const course = await persistence.getCourseByCode(code);
        if (!course) {
            return false;
        }
        // Check if the logged-in user is the owner of the course
        if (course.owner !== userId) {
            return false;
        }
        // Update the capacity
        return await persistence.updateCourse(code, { capacity });
    }
};