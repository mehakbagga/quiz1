const faker = require("faker")
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
 return knex('clucks').del()
 .then(function () {
  const clucks = []
  for (let i = 0; i < array.length; i++) {
    clucks.push(
      {
        title: faker.hacker.verb(),
        content: faker.company.catchParser(),
        imageUrl: faker.image.imageUrl(),
        username: faker.name.firstName()
      }
    )
}
    return knex('clucks').insert(clucks)
 })
};
