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
    },
    determineBMICategory(bmiValue) {
        if (bmiValue < 16) {
            return "SEVERELY UNDERWEIGHT";
        } else if (bmiValue >= 16 && bmiValue < 18.5) {
            return "UNDERWEIGHT";
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            return "NORMAL";
        } else if (bmiValue >= 25 && bmiValue < 30) {
            return "OVERWEIGHT";
        } else if (bmiValue >= 30 && bmiValue < 35) {
            return "MODERATELY OBESE";
        } else if (bmiValue >= 35) {
            return "SEVERELY OBESE";
        } else {
            return "UNKNOWN";
        }
    }
};

module.exports = gymUtilityCalculations;