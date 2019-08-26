/*
Controller for goals. 
A member or a trainer can add or delete a goal
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const logger = require("../utils/logger");
const uuid = require("uuid");
const goalStore = require("../models/goal-store");

const goal = {

    /* 
    Controller to delete a goal, once the goal is deleted,
    if a member is logged in they are redirected back to their dashboard,
    if a trainer is logged in they are redirected back to view of the members
    dashboard (trainerviewmember.hbs) .
    */
    deleteGoal(request, response) {
        logger.debug(`Delete Goal: ${request.params.id}`);
        const goalId = request.params.id;
        goalStore.removeGoal(goalId);
        if (request.cookies.member != "") {
            response.redirect("/member-dashboard");
        } else {
            response.redirect(`/member/${request.params.memberid}`);
        }
    },

    /*
    Controller to add a goal. A goal consists of a unique identifier,
    a member id of who the member to goal is being set for, a date of
    when the goal needs to be completed by, a weight goal, a waist goal,
    and an initial status of OPEN. Once the goal has been saved,
    if a member is logged in they are redirected back to their dashboard,
    if a trainer is logged in they are redirected back to view of the members
    dashboard (trainerviewmember.hbs) .
    
    */
    addGoal(request, response) {
        logger.debug("Add a goal");
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
    },

};

// export goal
module.exports = goal;