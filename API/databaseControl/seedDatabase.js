// models/seed.js
const { Grade, Category, Role } = require('../models'); // Import your models

const seedDatabase = async () => {
    try {
        // Seed Grades
        const grades = ['1 Grade', '2 Grade', '3 Grade', '4 Grade', 'General'];

        for (const gradeName of grades) {
            await Grade.findOrCreate({
                where: { GradeName: gradeName },
                defaults: { GradeName: gradeName }
            });
        }
        console.log('Grades seeded successfully.');

        // Seed Categories
        const categories = ['Parental', 'Financial', 'Education', 'Trips', 'Ideas'];

        for (const categoryName of categories) {
            await Category.findOrCreate({
                where: { CategoryName: categoryName },
                defaults: { CategoryName: categoryName }
            });
        }
        console.log('Categories seeded successfully.');

        const roles = ['Administrator', 'User'];

        for (const roleName of roles) {
            await Role.findOrCreate({
                where: { RoleName: roleName },
                defaults: { RoleName: roleName }
            });
        }
        console.log('Roles seeded successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
