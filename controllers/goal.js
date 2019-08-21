"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const goalStore = require("../models/goal-store");

const goal = {

    deleteGoal(request, response) {
        logger.info(`Deleting Goal: ${request.params.id}`);
        const goalId = request.params.id;
        goalStore.removeGoal(goalId);
        if (request.cookies.member != "") {
            response.redirect("/member-dashboard");
        } else {
            response.redirect(`/member/${request.params.memberid}`);
        }
    },

    addGoal(request, response) {
        logger.info("controllers/goal : addGoal");
        const newGoal = {
            id: uuid(),
            memberid: request.params.memberid,
            date: request.body.date,
            weight: request.body.weight,
            waist: request.body.waist,
            status: "OPEN"
        };
        goalStore.addGoal(newGoal);
        if (request.cookies.member != "") {
            response.redirect("/member-dashboard");
        } else {
            response.redirect(`/member/${request.params.memberid}`);
        }
    }
};

module.exports = goal;