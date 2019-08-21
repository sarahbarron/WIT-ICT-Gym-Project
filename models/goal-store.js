"use strict";

const _ = require("lodash");
const logger = require("../utils/logger");
const memberStore = require("./member-store");
const JsonStore = require("./json-store");

const goalStore = {

    store: new JsonStore("./models/goal-store.json", {
        goalCollection: []
    }),
    collection: "goalCollection",

    getAllGoals() {
        logger.info("Get all goals");
        return this.store.findAll(this.collection);
    },

    getGoal(id) {
        logger.info(`Get a goal with id ${id}`);
        return this.store.findOneBy(this.collection, {
            id: id
        });
    },

    getMemberGoals(memberid) {
        logger.info(`Get member goals for member id: ${memberid}`);
        return this.store.findBy(this.collection, {
            memberid: memberid
        }).sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    },

    addGoal(goal) {
        logger.info("models/goal-store : addGoal(goal)");
        this.store.add(this.collection, goal);
        this.store.save();
    },

    removeGoal(id) {
        logger.info("Remove a goal");
        const goal = this.getGoal(id);
        this.store.remove(this.collection, goal);
        this.store.save();
    }
};

module.exports = goalStore;