"use strict";

const _ = require("lodash");
const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const JsonStore = require("./json-store");
const gymUtility = require("./gymUtilityCalculations");
const assessmentStore = {

    store: new JsonStore("./models/assessment-store.json", {
        assessmentCollection: []
    }),
    collection: "assessmentCollection",


    // return all assessments in the assessment-store json file
    getAllAssessments() {
        return this.store.findAll(this.collection);
    },


    // return one assessment from the assessment-store json file where the id's match
    getAssessment(id) {
        return this.store.findOneBy(this.collection, {
            id: id
        });
    },

    //https://stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property 
    // helped with sorting dates of string format
    // return all assessments for a particular member
    getMemberAssessments(memberid) {
        return this.store.findBy(this.collection, {
            memberid: memberid
        }).sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    },

    getLatestAssessment(email) {

        const member = memberStore.getMemberByEmail(email);
        const assessments = this.getMemberAssessments(member.id);

        if (assessments.length > 0) {
            return assessments[0];
        } else {
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

    // add an assessment
    addAssessment(assessment) {
        this.store.add(this.collection, assessment);
        this.store.save();
        this.resetTrends(assessment);
        memberStore.addNumberOfAssessments(assessment);
    },

    removeAssessment(id) {
        const assessment = this.getAssessment(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
        this.resetTrends(assessment);
        memberStore.subtractNumberOfAssessments(assessment);
    },

    resetTrends(assessment) {

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

        for (i = 0; i < assessments.length; i++) {
            thisAssessment = assessments[i];
            assessmentWeight = parseFloat(thisAssessment.weight);

            if (i === assessments.length - 1) {
                previousWeight = parseFloat(member.startweight);
            } else {
                previousAssessment = assessments[i + 1];
                previousWeight = parseFloat(previousAssessment.weight);
            }
            weightDifference = assessmentWeight - previousWeight;
            bmi = gymUtility.calculateBMI(member, thisAssessment);
            bmiCategory = gymUtility.determineBMICategory(bmi);

            if (weightDifference <= 0 && !bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = true;
            } else if (weightDifference > 0 && !bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = false;
            } else if (weightDifference <= 0 && bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = false;
            } else if (weightDifference > 0 && bmiCategory.includes("UNDERWEIGHT")) {
                thisAssessment.trend = true;
            }
            this.store.save();
        }
    },

    addComment(id, comment) {
        const assessment = this.getAssessment(id);
        assessment.comment = comment;
        this.store.save();
    }
};

module.exports = assessmentStore;