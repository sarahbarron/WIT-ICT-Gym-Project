/*
Trainer Model:
A trainer has an id, first name, last name, email, password and gender.
methods are included to
- Add a trainer to the store
- Remove a trainer from the store
- Get all trainers stored in the Json file
- Get a trainer by its id or email address
- Update a trainers profile 
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const _ = require("lodash");
const JsonStore = require("./json-store");
const logger = require("../utils/logger")

const trainerStore = {
  // Trainers are stored in the trainer-store.json file
  store: new JsonStore("./models/trainer-store.json", {
    trainers: []
  }),
  collection: "trainers",

  // Return all trainers stored in the json file
  getAllTrainers() {
    logger.debug("Get all trainers");
    return this.store.findAll(this.collection);
  },

  // Add a trainer to the json file
  addTrainer(trainer) {
    logger.debug(`add trainer id: ${trainer.id}`);
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  // Use a trainers id to find a trainer in the json file
  getTrainerById(id) {
    logger.debug(`get trainer by id: ${id}`);
    return this.store.findOneBy(this.collection, {
      id: id
    });
  },

  // Use the trainers email address to find the trainer in the json file
  getTrainerByEmail(email) {
    logger.debug(`get trainer by email: ${email}`);
    return this.store.findOneBy(this.collection, {
      email: email
    });
  },

  // Update the trainers profile using the newly inputted data
  updateTrainer(newTrainerDetails, trainer) {

    logger.debug(`update trainer profile by id: ${trainer.id}`);
    if (newTrainerDetails.firstName !== "") {
      trainer.firstName = newTrainerDetails.firstName;
    }
    if (newTrainerDetails.lastName !== "") {
      trainer.lastName = newTrainerDetails.lastName;
    }
    if (newTrainerDetails.email !== "") {
      trainer.email = newTrainerDetails.email;
    }
    if (newTrainerDetails.password !== "") {
      trainer.password = newTrainerDetails.password;
    }
    trainer.gender = newTrainerDetails.gender;

    this.store.save();
  }

};

// export trainerStore
module.exports = trainerStore;