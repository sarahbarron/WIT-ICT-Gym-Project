/*
Assessment Model:
Members can have assessments. 
An assessment can be added and deleted by a member.
There are also methods 
- to get all assessments
- get assessments associated with a particular member
- get an assessment using its id
- get the most recent assessment
- set the trend of an assessment
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const _ = require("lodash");
const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const JsonStore = require("./json-store");
const gymUtility = require("../controllers/gymUtilityCalculations");

const assessmentStore = {
    /* 
    Use the assessment-store.json file to store assessments in
    */
    store: new JsonStore("./models/assessment-store.json", {
        assessmentCollection: []
    }),
    collection: "assessmentCollection",


    // return all assessments in the assessment-store json file
    getAllAssessments() {
        logger.debug("Returning all assessments");
        return this.store.findAll(this.collection);
    },

    // return one assessment from the assessment-store json file where the id's match
    getAssessment(id) {
        logger.debug(`Returning an assessment with id: ${id}`);
        return this.store.findOneBy(this.collection, {
            id: id
        });
    },


    /*
    Return all assessments for a particular member in reverse chronological order
    (ref: https://stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property 
    helped me with sorting of an array of dates in reverse chronological order)
    */
    getMemberAssessments(memberid) {
        logger.debug(`Returning all member assessments of member id: ${memberid}`);
        return this.store.findBy(this.collection, {
            memberid: memberid
        }).sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    },

    // Get the most recent assessment for a member
    getLatestAssessment(email) {
        logger.debug(`Returning the latest assessment for member with email address: ${email}`);
        const member = memberStore.getMemberByEmail(email);
        const assessments = this.getMemberAssessments(member.id);

        // If the member has an assessment return the first assessment
        if (assessments.length > 0) {
            return assessments[0];
        }
        // otherwise return an object with the members start weight and height
        else {
            const member = memberStore.getMemberByEmail(email);
            const weight = member.startweight;
            const height = member.height;
            const weightAndHeight = {
                weight: weight,
                height: height
            };
            return weightAndHeight;
        }
    },

    /* 
    Add an assessment to the json file
    reset the trends and increase the number of assessments the member has by one
    */
    addAssessment(assessment) {
        logger.debug(`Add assessment id: ${assessment.id}`);
        this.store.add(this.collection, assessment);
        this.store.save();
        this.resetTrends(assessment);
        memberStore.addNumberOfAssessments(assessment.memberid);
    },

    /*
    Remove an assessment from the json file
    reset the trends and decrease the number of assessments the member has by one
    */
    removeAssessment(id) {
        logger.debug(`Remove Assessment id: ${id}`);
        const assessment = this.getAssessment(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
        this.resetTrends(assessment);
        memberStore.subtractNumberOfAssessments(assessment.memberid);
    },

    /*
    Remove all members assessments from the json file when a member is 
    deleted by a trainer. This prevents the build up of information being 
    stored in the json file
    */
    removeAllMemberAssessments(memberid) {
        logger.debug(`Remove all assessments with member id: ${memberid}`);
        const assessments = this.getMemberAssessments(memberid);
        for (let i = 0; i < assessments.length; i++) {
            this.store.remove(this.collection, assessments[i]);
        }
        this.store.save();
    },

    /*
    Trends are set and reset when assessments are added and deleted. A trend is shown as
    a green arrow for a positive trend and a red arrow for a negative trend in assessment
    recordings.
    If a member is under weight an increase in weight is positive and will show green
    a decrease in weight is negative so will show red
    If a member is over weight a decrease in weight is positive and will show green and 
    an increase in weight is negative so will show green
    If a member is in the normal range an increase in weight will show red and a decrease
    will show green.
    */
    resetTrends(assessment) {
        logger.debug(`Reset the trend for assessment id: ${assessment.id}`);
        let previousWeight;
        let assessmentWeight;
        let weightDifference;
        let bmi;
        let bmiCategory;
        let thisAssessment;
        let i = 0;
        let previousAssessment;
        const memberId = assessment.memberid;
        const member = memberStore.getMemberById(memberId);
        const assessments = this.getMemberAssessments(memberId);

        // iterate through every assessment
        for (i = 0; i < assessments.length; i++) {
            thisAssessment = assessments[i];
            assessmentWeight = parseFloat(thisAssessment.weight);

            /* 
            If it is the first assessment stored use the members start 
            weight to compare against
            */
            if (i === assessments.length - 1) {
                previousWeight = parseFloat(member.startweight);
            }
            // Otherwise use the previous assessment to compare against
            else {
                previousAssessment = assessments[i + 1];
                previousWeight = parseFloat(previousAssessment.weight);
            }
            weightDifference = assessmentWeight - previousWeight;
            bmi = gymUtility.calculateBMI(member, thisAssessment);
            bmiCategory = gymUtility.determineBMICategory(bmi);

            /* 
            Compare the weight difference and the bmi category and set the trend 
            to either true (for a positive trend) or false (for a negative trend) 
            */
            if (weightDifference <= 0 && !bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = true;
            } else if (weightDifference > 0 && !bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = false;
            } else if (weightDifference <= 0 && bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = false;
            } else if (weightDifference > 0 && bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = true;
            }

            // save to the assessment-store json file
            this.store.save();
        }
    },


    //Add a comment to an assessment. This can be done by a trainer
    addComment(id, comment) {
        logger.debug(`Add comment: ${comment} to assessment id: ${id}`);
        const assessment = this.getAssessment(id);
        assessment.comment = comment;
        this.store.save();
    }
};

// export assessmentStore
module.exports = assessmentStore;