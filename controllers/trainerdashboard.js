/*
Controller for the Trainers Dashboard. 
The trainers dashboard shows a list of members.
The trainer can click on all members to redirect to see a members details,
or a trainer can delete a member, deleting the member and their assessments
and goals.
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("./gymUtilityCalculations");
const memberStore = require("../models/member-store");
const goalStore = require("../models/goal-store");


const trainerdashboard = {

    /*
    Controller to render the trainers dashboard. Showing all members, 
    with a link to each members details page or an option to delete 
    a member. 
    */
    index(request, response) {
        logger.info("trainer dashboard rendering");
        const trainer = accounts.getCurrentTrainer(request);
        const members = memberStore.getAllMembers();
        const viewData = {
            title: "Trainer Dashboard",
            members: members,
            trainer: trainer,
        };
        response.render("trainerdashboard", viewData);
    },

    /* 
    Controller to render trainerviewmember.hbs. This page show all of the selected members details.
    It shows the members analytics, current goal, assessments, trends, goals. It also gives the 
    trainer the option to enter a goal for the member or enter a comment for a members assessment. 
    The trainer can also delete goals
    */
    getMemberDetails(request, response) {
        logger.info(`Trainer Dashboard viewing member id: ${request.params.id}`);
        const memberid = request.params.id;
        const member = memberStore.getMemberById(memberid);
        let latestAssessment = assessmentStore.getLatestAssessment(member.email);
        assessmentStore.resetTrends(latestAssessment);
        const firstName = member.firstName.toUpperCase();
        const lastName = member.lastName.toUpperCase();
        const assessments = assessmentStore.getMemberAssessments(memberid);
        const bmi = gymUtility.calculateBMI(member, latestAssessment);
        const bmiCategory = gymUtility.determineBMICategory(bmi);
        let bmiCategoryColor = false;
        if (bmiCategory === "NORMAL") {
            bmiCategoryColor = true;
        }
        const isIdealBodyWeight = gymUtility.isIdealBodyWeight(member, latestAssessment);
        const goals = goalStore.getMemberGoals(memberid);
        const currentGoal = goals[0];
        goalStore.goalStatus(goals, assessments);
        const viewData = {
            title: "Trainer Dashboard",
            member: member,
            firstName: firstName,
            lastName: lastName,
            assessments: assessments,
            bmi: bmi,
            bmiCategory: bmiCategory,
            bmiCategoryColor: bmiCategoryColor,
            isIdealBodyWeight: isIdealBodyWeight,
            goals: goals,
            currentgoal: currentGoal
        };
        response.render("trainerviewmember", viewData);
    },

    /*
    Controller to delete a member. A trainer can delete a member.
    When they do this the member is deleted, all the members 
    assessments are deleted and all the members goals are deleted
    for the respective JSON files. 
    */
    deleteMember(request, response) {
        logger.debug("Delete a member");
        const memberid = request.params.id;
        assessmentStore.removeAllMemberAssessments(memberid);
        goalStore.removeAllMemberGoals(memberid);
        memberStore.deleteMember(memberid);
        response.redirect("/trainer-dashboard");
    }
};

// export trainerdashboard
module.exports = trainerdashboard;