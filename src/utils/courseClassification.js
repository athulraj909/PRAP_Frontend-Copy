// Course classification for question filtering
// IT courses get IT + BOTH categories
// Non-IT courses get ONLY BOTH categories

const IT_COURSES = [
    "MCA",
    "BCA",
    "B.Tech",
    "B.Tech (CSE)",
    "B.Tech (IT)",
    "B.Tech (ECE)",
    "B.Tech (EEE)",
    "B.Tech (Mech)",
    "B.Tech (Civil)",
    "M.Tech",
    "BSc (Computer Science)",
    "BSc (IT)",
    "MSc (Computer Science)",
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "CSE",
    "IT",
];

export const isITCourse = (courseName) => {
    if (!courseName) return false;
    const normalizedCourse = courseName.toUpperCase().trim();
    return IT_COURSES.some(itCourse => 
        normalizedCourse.includes(itCourse.toUpperCase()) || 
        itCourse.toUpperCase().includes(normalizedCourse)
    );
};

export const getApplicableCategoriesForCourse = (courseName) => {
    if (isITCourse(courseName)) {
        return ["IT", "BOTH"];
    }
    return ["BOTH"];
};

export default {
    isITCourse,
    getApplicableCategoriesForCourse,
};
