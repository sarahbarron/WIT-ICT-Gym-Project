/*
Controllers for member assessments. A member can have zero to 
many assessments stored on their account. These assessments keep
track of a members progress as they lose weight and inches.
Members can add an assessment to their account at any time.
*/


// Code should be executed in strict mode
"use strict";

// requirements
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const accounts = require("./accounts");
const uuid = require("uuid");


const assessment = {

    /* 
    Controller to delete an assessment. A member can delete 
    their assessment. They are then redirected back to the 
    member dashboard.
    */
    deleteAssessment(request, response) {
        const assessmentId = request.params.id;
        logger.info("deleting assessment: ", assessmentId);
        assessmentStore.removeAssessment(assessmentId);
        response.redirect("/member-dashboard");
    },

    /* 
    Controller to add an assessment. A member can add an assessment. 
    An assessment has an id, member id, date and weight, chest, thigh
    upperarm, waist and hip measurements
    Once the assessment is done the member is redirected back to the member dashboard.
    */
    addAssessment(request, response) {
        const loggedInMember = accounts.getCurrentMember(request);
        const newAssessment = {
            id: uuid(),
            memberid: loggedInMember.id,
            date: new Date().toLocaleString('ie-IE'),
            weight: request.body.weight,
            chest: request.body.chest,
            thigh: request.body.thigh,
            upperarm: request.body.upperarm,
            waist: request.body.waist,
            hip: request.body.hip
        }
        logger.debug("New Assessment = ", newAssessment);
        assessmentStore.addAssessment(newAssessment);
        response.redirect("/member-dashboard");
    },

    /*
    Controller to add a comment to a members assessment.
    A Trainer can do this.
    Once the comment has been saved the trainer is redirected
    back to a view of the members details
    */
    addComment(request, response) {
        logger.debug("Adding a comment");
        const id = request.params.memberid;
        const assessmentid = request.params.id;
        const comment = request.body.comment;
        assessmentStore.addComment(assessmentid, comment);
        response.redirect(`/member/${id}`);
    }
};

// export assessments
module.exports = assessment;