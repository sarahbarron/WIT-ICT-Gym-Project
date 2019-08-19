"use strict";

const _ = require("lodash");
const memberStore = require("../models/member-store");
const JsonStore = require("./json-store");
const accounts = require("../controllers/accounts")
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
        const assessments = this.store.findBy(this.collection, {
            email: email
        }).sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
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
    },

    removeAssessment(id) {
        const assessment = this.getAssessment(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
    }
};

module.exports = assessmentStore;