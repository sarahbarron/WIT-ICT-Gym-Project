"use strict";

const JsonStore = require("./json-store");

const gymUtilityCalculations = {

    calculateBMI(member, assessment) {
        const weight = assessment.weight;
        const height = member.height;
        const squareOfHeight = Math.pow(height, 2);
        const bmi = ((weight / squareOfHeight) * 100) / 100;
        //https://www.w3schools.com/jsref/jsref_tofixed.asp
        return bmi.toFixed(2);
    }

};

module.exports = gymUtilityCalculations;