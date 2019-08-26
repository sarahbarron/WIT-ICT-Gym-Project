// Methods to be used for handling of json files

// Code should be executed in strict mode
"use strict";

// Requirements
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");


class JsonStore {
  constructor(file, defaults) {
    const adapter = new FileSync(file);
    this.db = low(adapter);
    this.db.defaults(defaults).value();
  }

  // save a json file
  save() {
    this.db.write();
  }

  // add to a json file
  add(collection, obj) {
    this.db
      .get(collection)
      .push(obj)
      .last()
      .value();
  }

  // remove from a json file
  remove(collection, obj) {
    this.db
      .get(collection)
      .remove(obj)
      .value();
  }

  // remove a collection from json file
  removeAll(collection) {
    this.db
      .get(collection)
      .remove()
      .value();
  }

  // find a collection in json file
  findAll(collection) {
    return this.db.get(collection).value();
  }

  // find one in a collection in a json file
  findOneBy(collection, filter) {
    const results = this.db
      .get(collection)
      .filter(filter)
      .value();
    return results[0];
  }

  // find by id
  findByIds(collection, ids) {
    return this.db
      .get(collection)
      .keyBy("id")
      .at(ids)
      .value();
  }

  // find by 
  findBy(collection, filter) {
    return this.db
      .get(collection)
      .filter(filter)
      .value();
  }
}

// export JsonStore
module.exports = JsonStore;