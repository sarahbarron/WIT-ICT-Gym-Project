"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../models/gymUtilityCalculations");


const dashboard = {

  memberDashboard(request, response) {

    logger.info("dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    let latestAssessment = assessmentStore.getLatestAssessment(loggedInMember.email);
    const firstName = loggedInMember.firstName.toUpperCase();
    const lastName = loggedInMember.lastName.toUpperCase();
    const assessments = assessmentStore.getMemberAssessments(loggedInMember.id);
    const bmi = gymUtility.calculateBMI(loggedInMember, latestAssessment);
    const bmiCategory = gymUtility.determineBMICategory(bmi);
    let bmiCategoryColor = false;
    if (bmiCategory === "NORMAL") {
      bmiCategoryColor = true;
    }
    const viewData = {
      title: "Member Dashboard",
      firstName: firstName,
      lastName: lastName,
      assessments: assessments,
      bmi: bmi,
      bmiCategory: bmiCategory,
      bmiCategoryColor: bmiCategoryColor
    };
    logger.info("about to render", assessmentStore.getAllAssessments());
    response.render("dashboard", viewData);
  },
};

module.exports = dashboard;