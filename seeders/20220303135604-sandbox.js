'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Config', [{
            key: 'SANDBOX_AUTH_TOKEN',
            value: 'eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJBUEkiLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKaGRXUWlPaUpCVUVraUxDSnpkV0lpT2lKcGRHRjRaV0Z6ZVRFNVFHZHRZV2xzTG1OdmJTSXNJbUZ3YVY5clpYa2lPaUpyWlhsZmJHbDJaVjkyWlV4RlkzTk5VVk00WTNwU1R6ZFpWazVFVHpGSmJraDVkRkpOWlRaS05TSXNJbWx6Y3lJNkltRndhUzV6WVc1a1ltOTRMbU52TG1sdUlpd2laWGh3SWpveE5qYzNPRFV4TnpNMkxDSnBiblJsYm5RaU9pSlNSVVpTUlZOSVgxUlBTMFZPSWl3aWFXRjBJam94TmpRMk16RTFOek0yZlEuN3BkR0NWOEZQNXlTSE5BMTJEMjhVSGVEelEyQkZyR1NGZlFVN0VweVFBNjdmcDB2LUFNUE9qTV9PeEItR0M1cEY5cldhU0NHdkZfbEc3Y1NINEFCcHciLCJzdWIiOiJpdGF4ZWFzeTE5QGdtYWlsLmNvbSIsImFwaV9rZXkiOiJrZXlfbGl2ZV92ZUxFY3NNUVM4Y3pSTzdZVk5ETzFJbkh5dFJNZTZKNSIsImlzcyI6ImFwaS5zYW5kYm94LmNvLmluIiwiZXhwIjoxNjQ2NDAyMTM2LCJpbnRlbnQiOiJBQ0NFU1NfVE9LRU4iLCJpYXQiOjE2NDYzMTU3MzZ9.BHn8P3AR1cXq7rVNI9o-onVQBFCV1fQ0icYeYtDgqLa5pntdrJknqpYwGwJTAbZVyhWa0rOzyTs79oRMLKWCqA'
        }])
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
