"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CLASS_NAME_UNIQUE_PREFIX = 'mee-'; // mee - Miro Emails Editor
function setClass(element, className) {
    var existingClass = element.getAttribute('class');
    var newClass = "" + CLASS_NAME_UNIQUE_PREFIX + className;
    element.setAttribute('class', existingClass ? existingClass + " " + newClass : newClass);
}
exports.setClass = setClass;
//# sourceMappingURL=dom.js.map