"use strict";


const gymUtility = {

    checkIfDateIsPastOrFuture(goalDate) {

        let todaysDate = new Date();

        //convert the goal date string to a date of milliseconds  
        if (goalDate < todaysDate) {
            return true;
        } else {
            return false;
        }
    },

    // Method to find the assessment that was logged either on the goal complete
    // by date or just prior to the goal complete by date. 

    findLastAssessmentPriorToGoalDate(goal, assessments, memberweight) {

        const goalDate = Date.parse(goal.date);
        let i;
        let assessmentDate;
        let pastAssessment = {
            "date": "00-00-00",
            "weight": memberweight,
            "waist": goal.waist
        };

        //Loop through assessments to find the assessment on or prior to the goal complete by date
        // for loop working backwards as the assessments array is in reverse chronological order
        for (i = assessments.length; i > 0; i--) {

            assessmentDate = Date.parse(assessments[i - 1].date);
            let stringAssessmentDateOnly = new Date(assessmentDate).toLocaleDateString('ie-IE');
            assessmentDate = Date.parse(stringAssessmentDateOnly);


            if (assessmentDate <= goalDate) {
                pastAssessment = assessments[i - 1];
            }
        }
        // return the assessment
        return pastAssessment;
    },

    checkIfGoalHasBeenAchieved(goal, assessment) {
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

module.exports = gymUtility;