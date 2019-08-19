"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../models/gymUtilityCalculations");


const dashboard = {

  memberDashboard(request, response) {

    logger.info("dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const latestAssessment = assessmentStore.getLatestAssessment(loggedInMember.id);

    const viewData = {
      title: "Member Dashboard",
      firstName: loggedInMember.firstName.toUpperCase(),
      lastName: loggedInMember.lastName.toUpperCase(),
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
      bmi: gymUtility.calculateBMI(loggedInMember, latestAssessment)
    };
    logger.info("about to render", assessmentStore.getAllAssessments());
    response.render("dashboard", viewData);
  },
};

module.exports = dashboard;