"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const trainerStore = {
  store: new JsonStore("./models/trainer-store.json", {
    trainers: []
  }),
  collection: "trainers",

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, {
      id: id
    });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, {
      email: email
    });
  },

  updateTrainer(newTrainerDetails, trainer) {

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

module.exports = trainerStore;