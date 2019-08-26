/* Controller for the members dashboard where the member can view
Their analytics, latest goal status, assessments, trends and goals.
The member can also add a goal, add an assessment, delete an
assessment and delete a goal
*/

// Code should be executed in strict mode
"use strict";

// requirements
const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("./gymUtilityCalculations");
const goalStore = require("../models/goal-store");


const dashboard = {

  /* 
  Controller for member dashboard, data sent in the response to the browser dashboard page
  are title, the logged in member, first name and last name in upper case, members assessments,
  members bmi rate, category, and true or false for if member is at an ideal weight or not,
  members goals, and members current goal.
  */
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
    const goals = goalStore.getMemberGoals(loggedInMember.id);
    const currentGoal = goals[0];
    goalStore.goalStatus(goals, assessments);
    const viewData = {
      title: "Member Dashboard",
      member: loggedInMember,
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
    response.render("memberdashboard", viewData);
  }

};

// export dashboard 
module.exports = dashboard;