"use strict";

const logger = require("../utils/logger");

const home = {
    index(request, response) {
        const viewData = {
            title: "Home Page"
        };
        response.render("index", viewData);
    },
};

module.exports = home;