"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../utils/gymUtilityCalculations");
const memberStore = require("../models/member-store");
const goalStore = require("../models/goal-store");


const trainerdashboard = {

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

    getMemberDetails(request, response) {
        logger.info(`view member: ${request.params.id} details on trainers dashboard rendering`);
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
            goals: goals
        };
        response.render("trainerviewmember", viewData);
    },

    deleteMember(request, response) {
        const memberid = request.params.id;
        memberStore.deleteMember(memberid);
        response.redirect("/trainer-dashboard");
    }


};

module.exports = trainerdashboard;