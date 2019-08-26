/*
Gym Utility with calculation methods for a members:
- BMI 
- BMI Category
- Is the member of an ideal body weight or not 
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const logger = require("../utils/logger");

const gymUtilityCalculations = {

    /*  
    Returns the BMI for the member based on the calculation
    BMI is weight divided by the square of the height 
    */
    calculateBMI(member, assessment) {
        logger.debug("Calculate BMI");
        const weight = parseFloat(assessment.weight);
        const height = parseFloat(member.height);
        const squareOfHeight = Math.pow(height, 2);
        const bmi = ((weight / squareOfHeight) * 100) / 100;
        /*
        Return the bmi with maximum of 2 decimal places. 
        (ref: https://www.w3schools.com/jsref/jsref_tofixed.asp
            this site helped me with the toFixed() method)
        */
        return bmi.toFixed(2);
    },

    /* 
    Determine the BMI Category
    BMI less than 16(exclusive) is "SEVERELY UNDERWEIGHT"
    BMI Between 16(inclusive) and 18.5(exclusive) is "UNDERWEIGHT"
    BMI Between 18.5(inclusive) and 25(exclusive) is "NORMAL"
    BMI Between 25(inclusive) and 30(exclusive) is "OVERWEIGHT"
    BMI Between 30(inclusive) and 35(exclusive) is "MODERATELY OBESE"
    BMI greater than 35(inclusive) is "SEVERELY OBESE"
   */
    determineBMICategory(bmiValue) {
        logger.debug("Calculate BMI Category");
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

    //  Returns a boolean to indicate if the member has and ideal body weight based on the Devine Formula
    isIdealBodyWeight(member, assessment) {
        logger.debug("Calculate if the member is of ideal body weight");
        const gender = member.gender;
        const weight = parseFloat(assessment.weight);
        const height = parseFloat(member.height);
        // convert metres to inches
        const heightInInches = height * 39.370;
        // five foot / 60 inches
        const fiveFoot = 60;
        const inchesAboveFiveFoot = heightInInches - fiveFoot;
        const weightForEachInchOverFiveFoot = inchesAboveFiveFoot * 2.3;
        let idealWeight;

        //    if the height is greater than 5 ft (with a .2ft/2.4 inches boundary)
        if (heightInInches >= fiveFoot - 2.4) {

            //   if the member is male an ideal body weight is 50kg plus 2.3kg for every inch over 5ft
            if (gender === "m") {
                idealWeight = 50 + weightForEachInchOverFiveFoot;
            }
            // otherwise the member is female/unspecified allow an ideal body weight of 45.5kg plus 2.3kg for every inch over 5ft
            else {
                idealWeight = 45.5 + weightForEachInchOverFiveFoot
            }
            //   if the members weight is 2kg either side of the ideal weight return true otherwise return false
            if (weight >= idealWeight - 2 && weight <= idealWeight + 2) {
                return true;
            } else {
                return false;
            }
        }
        //    If the member is 5ft or less return true if male is 50kg or less or female is 45.5kg or less otherwise its false
        else {
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

// export gymUtilityCalculations
module.exports = gymUtilityCalculations;