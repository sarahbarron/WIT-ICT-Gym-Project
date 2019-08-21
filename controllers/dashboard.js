"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../models/gymUtilityCalculations");
const memberStore = require("../models/member-store");


const dashboard = {

  memberDashboard(request, response) {

    logger.info("member dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    let latestAssessment = assessmentStore.getLatestAssessment(loggedInMember.email);
    assessmentStore.resetTrends(latestAssessment);
    const firstName = loggedInMember.firstName.toUpperCase();
    const lastName = loggedInMember.lastName.toUpperCase();
    const assessments = assessmentStore.getMemberAssessments(loggedInMember.id);
    const bmi = gymUtility.calculateBMI(loggedInMember, latestAssessment);
    const bmiCategory = gymUtility.determineBMICategory(bmi);
    let bmiCategoryColor = false;
    if (bmiCategory === "NORMAL") {
      bmiCategoryColor = true;
    }
    const isIdealBodyWeight = gymUtility.isIdealBodyWeight(loggedInMember, latestAssessment);
    const viewData = {
      title: "Member Dashboard",
      firstName: firstName,
      lastName: lastName,
      assessments: assessments,
      bmi: bmi,
      bmiCategory: bmiCategory,
      bmiCategoryColor: bmiCategoryColor,
      isIdealBodyWeight: isIdealBodyWeight
    };
    response.render("memberdashboard", viewData);
  }

};

module.exports = dashboard;