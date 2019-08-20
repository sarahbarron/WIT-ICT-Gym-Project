"use strict";

const logger = require("../utils/logger");

const gymUtilityCalculations = {

    calculateBMI(member, assessment) {
        const weight = parseFloat(assessment.weight);
        const height = parseFloat(member.height);
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
    },

    isIdealBodyWeight(member, assessment) {
        const gender = member.gender;
        const weight = parseFloat(assessment.weight);
        const height = parseFloat(member.height);
        const heightInInches = height * 39.370;
        const fiveFoot = 60;
        const inchesAboveFiveFoot = heightInInches - fiveFoot;
        const weightForEachInchOverFiveFoot = inchesAboveFiveFoot * 2.3;
        let idealWeight;

        if (heightInInches >= fiveFoot - 2.4) {
            if (gender === "m") {
                idealWeight = 50 + weightForEachInchOverFiveFoot;
            } else {
                idealWeight = 45.5 + weightForEachInchOverFiveFoot
            }
            if (weight >= idealWeight - 2 && weight <= idealWeight + 2) {
                return true;
            } else {
                return false;
            }
        } else {
            if (gender === "m") {
                if (weight <= 50 && weight >= 43.5) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
};

module.exports = gymUtilityCalculations;