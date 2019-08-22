"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const JsonStore = require("./json-store");
const goalUtility = require("../utils/goalUtility");
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
    },

    goalStatus(goals, assessments) {

        let i = 0;
        let goalDate;
        let lastAssessmentBeforeGoalDate;
        let isPast;
        let isAchieved;

        for (i = 0; i < goals.length; i++) {
            //convert the date string to a date of milliseconds  
            goalDate = Date.parse(goals[i].date);
            isPast = goalUtility.checkIfDateIsPastOrFuture(goalDate);
            if (isPast) {
                const memberid = goals[0].memberid;
                const member = memberStore.getMemberById(memberid);
                const startweight = member.startweight;
                lastAssessmentBeforeGoalDate = goalUtility.findLastAssessmentPriorToGoalDate(goals[i], assessments, startweight);
                isAchieved = goalUtility.checkIfGoalHasBeenAchieved(goals[i], lastAssessmentBeforeGoalDate);
                if (isAchieved) {
                    goals[i].status = "ACHIEVED";
                } else {
                    goals[i].status = "MISSED";
                }
            } else {
                goals[i].status = "OPEN";
            }
            this.store.save();
        }

    }
};

module.exports = goalStore;