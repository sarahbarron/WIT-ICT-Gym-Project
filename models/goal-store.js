/*
Goals Model:
Goals are stored in the goal-store.json file
Every member can have goals. 
A member can add or delete a goal or a trainer can add or delete a goal for a member.
Each Goal has a date in which the goal must be completed by a weight goal a waist goal
and one of 3 statuses (OPEN, ACHIEVED OR MISSED).
*/

// Code should be executed using strict mode
"use strict";

// Requirements
const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const JsonStore = require("./json-store");

const goalStore = {

    // Goals are to be stored in the goal-store.json file
    store: new JsonStore("./models/goal-store.json", {
        goalCollection: []
    }),
    collection: "goalCollection",

    // Get all goals in the json file
    getAllGoals() {
        logger.debug("Get all goals");
        return this.store.findAll(this.collection);
    },

    // Get a goal by its id 
    getGoal(id) {
        logger.debug(`Get a goal with id ${id}`);
        return this.store.findOneBy(this.collection, {
            id: id
        });
    },

    /* 
    Get all goals associated with a member id and sort the goals
    in reverse chronological order
    */
    getMemberGoals(memberid) {
        logger.debug(`Get member goals for member id: ${memberid}`);
        return this.store.findBy(this.collection, {
            memberid: memberid
        }).sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    },

    //Add a goal to the json file
    addGoal(goal) {
        logger.debug(`Add goal id: ${goal.id}`);
        this.store.add(this.collection, goal);
        this.store.save();
    },

    // remove a goal from the json file using the goal id
    removeGoal(id) {
        logger.debug(`Remove goal id: ${id}`);
        const goal = this.getGoal(id);
        this.store.remove(this.collection, goal);
        this.store.save();
    },

    /* 
    Remove all goals from the JSON file when a member is 
    deleted by a trainer. This prevents a build up of unnecessary
    and dormant data in the json file.
    */
    removeAllMemberGoals(memberid) {
        logger.debug("Deleting Member - Removing all members goals")
        const goals = this.getMemberGoals(memberid);
        for (let i = 0; i < goals.length; i++) {
            this.store.remove(this.collection, goals[i]);
        }
        this.store.save();
    },

    /*
    Goal Status checks to see if goal is open, has been achieved or has been missed.
    */
    goalStatus(goals, assessments) {

        logger.debug("Get the goal status");
        let i = 0;
        let goalDate;
        let lastAssessmentBeforeGoalDate;
        let isPast;
        let isAchieved;

        // iterate through every goal
        for (i = 0; i < goals.length; i++) {
            //convert the date string to a date of milliseconds  
            goalDate = Date.parse(goals[i].date);
            // check to see if the goal is a goal with a past date or a future date
            isPast = this.checkIfDateIsPastOrFuture(goalDate);

            // if the date is in the past check to see if the goal has been achieved or missed
            if (isPast) {
                const memberid = goals[0].memberid;
                const member = memberStore.getMemberById(memberid);
                const startweight = member.startweight;
                // get the closest assessment that was added on or prior to the goal date.
                lastAssessmentBeforeGoalDate = this.findLastAssessmentPriorToGoalDate(goals[i], assessments, startweight);
                // use the goal details and the closest assessment details to check if the goal was achieved or missed
                isAchieved = this.checkIfGoalHasBeenAchieved(goals[i], lastAssessmentBeforeGoalDate);
                if (isAchieved) {
                    goals[i].status = "ACHIEVED";
                } else {
                    goals[i].status = "MISSED";
                }
            }
            // if the goal is in the future so set the status to open
            else {
                goals[i].status = "OPEN";
            }
            // store the status to the goals-store json file
            this.store.save();
        }

    },

    /*
    Check if the date of a goal is in the past or in the future
    by comparing it to todays date
    */
    checkIfDateIsPastOrFuture(goalDate) {

        logger.debug("Check if the goal date is in the past or future");
        let todaysDate = new Date();

        //convert the goal date string to a date of milliseconds  
        if (goalDate < todaysDate) {
            return true;
        } else {
            return false;
        }
    },

    /* 
    Method to find the closes assessment that was logged either on the goal 
    complete by date or prior to the goal complete by date. 
    */
    findLastAssessmentPriorToGoalDate(goal, assessments, memberweight) {

        logger.debug("Find the closest assessment recorded on or prior to the goal date");
        const goalDate = Date.parse(goal.date);
        let i;
        let assessmentDate;

        /* 
        Set an initial pastAssessment to the members start weight and 
        to the goal waist target as the member does not record a start waist
        on registration.
        This pastAssessment will be used if the member has not entered any assessments on
        or prior to the goal complete by date 
        */
        let pastAssessment = {
            "date": "00-00-00",
            "weight": memberweight,
            "waist": goal.waist
        };

        /* 
        Loop through assessments to find the assessment on or prior to the goal complete by date.
        for loop working backwards as the assessments array is in reverse chronological order
        */
        for (i = assessments.length; i > 0; i--) {

            assessmentDate = Date.parse(assessments[i - 1].date);
            let stringAssessmentDateOnly = new Date(assessmentDate).toLocaleDateString('ie-IE');
            assessmentDate = Date.parse(stringAssessmentDateOnly);


            if (assessmentDate <= goalDate) {
                pastAssessment = assessments[i - 1];
            }
        }
        // return the pastAssessment
        return pastAssessment;
    },

    /*
    Check if a goal has been achieved
    using the goal and the closest assessment either on or before the 
    goal compete by date. 
    The weight are compared to see if there has reached or surpassed the 
    weight loss goal
    The waist measurements are compare to see if the goal measurements 
    have been reached or surpassed. 
    If the weight & waist measurements have been reached or surpassed
    the status is set to achieved otherwise it is set to missed.
    */
    checkIfGoalHasBeenAchieved(goal, assessment) {
        logger.debug("Check if a goal has been achieved or missed");
        const goalWeight = parseFloat(goal.weight);
        const assessmentWeight = parseFloat(assessment.weight);
        const goalWaist = parseFloat(goal.waist);
        const assessmentWaist = parseFloat(assessment.waist);

        if (assessmentWeight <= goalWeight && assessmentWaist <= goalWaist) {
            return true;
        } else {
            return false;
        }
    }
};

// export goalStore
module.exports = goalStore;