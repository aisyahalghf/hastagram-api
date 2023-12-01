"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formateDate = void 0;
const formateDate = (input) => {
    const date = new Date(input);
    const option = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", option);
    return formattedDate;
};
exports.formateDate = formateDate;
