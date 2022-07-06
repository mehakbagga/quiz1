/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('hashtags', table => {
      table.increments('id');
      table.integer('count');
      table.string('hashtag');
    });
  };
  
  /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('hashtags');
  };

