"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("./strings");
var dom_1 = require("./utils/dom");
require("./styles.scss");
var validation_1 = require("./utils/validation");
var EmailsEditor = /** @class */ (function () {
    function EmailsEditor(props) {
        var _this = this;
        this.input = null;
        /**
         * Public API
         *
         */
        /**
         * Add Email item to the list
         * @param {string} email Email to be added
         * @param {boolean} silent Pass true if you don't want subscribers to be notified about this change
         * @memberof EmailsEditor
         */
        this.addEmailBlock = function (email, silent) {
            var existing = _this.container.querySelectorAll("[data-key=\"" + email + "\"]");
            if (existing && existing.length === 0) {
                var emailBlock = _this.createEmailBlock(email);
                _this.container.insertBefore(emailBlock, _this.input);
                !silent && _this.emitOnChange();
            }
        };
        /**
         * Remove Email item from the list
         * @param {string} email Email to be removed
         * @param {boolean} silent Pass true if you don't want subscribers to be notified about this change
         * @memberof EmailsEditor
         */
        this.removeEmailBlock = function (email, silent) {
            var result = _this.container.querySelectorAll("[data-key=\"" + email + "\"]");
            if (result && result.length === 1) {
                _this.container.removeChild(result[0]);
                !silent && _this.emitOnChange();
            }
        };
        /**
         * Get current email items, please not that result will include not valid emails
         * @returns {string[]} emails list
         * @memberof EmailsEditor
         */
        this.getEmails = function () {
            var result = _this.container.querySelectorAll('.mee-email-block');
            if (result && result.length > 0) {
                return [].slice.call(result).map(function (e) { return e.getAttribute('data-key'); });
            }
            return [];
        };
        /**
         * Get current valid email items
         * @returns {string[]} emails list
         * @memberof EmailsEditor
         */
        this.getValidEmails = function () {
            _this.getEmails().filter(validation_1.isValidEmail);
            var result = _this.container.querySelectorAll('.mee-email-block:not(.mee-email-block--invalid)');
            if (result && result.length > 0) {
                return [].slice.call(result).map(function (e) { return e.getAttribute('data-key'); });
            }
            return [];
        };
        /**
         * Set current email items, this will replace existing items with new list
         * @param {string[]} emails emails list
         * @memberof EmailsEditor
         */
        this.setEmails = function (emails) {
            if (emails && Array.isArray(emails)) {
                // "silently" clear existing
                var existingEmails = _this.getEmails();
                existingEmails.map(function (email) { return _this.removeEmailBlock(email, false); });
                // "silently" set new list
                emails.map(function (email) { return _this.addEmailBlock(email, false); });
                // and then notify clients
                _this.emitOnChange();
            }
        };
        /**
         * Element factories
         */
        this.createInput = function () {
            var input = document.createElement('input');
            dom_1.setClass(input, 'input');
            input.setAttribute('placeholder', strings_1.INPUT_PLACEHOLDER);
            input.addEventListener('blur', _this.handleInputBlur);
            input.addEventListener('keydown', _this.handleInputKeyDown);
            input.addEventListener('paste', _this.handleInputPaste);
            return input;
        };
        this.createEmailBlock = function (email) {
            var emailBlock = document.createElement('span');
            dom_1.setClass(emailBlock, 'email-block');
            if (!validation_1.isValidEmail(email)) {
                dom_1.setClass(emailBlock, 'email-block--invalid');
            }
            emailBlock.textContent = email;
            emailBlock.setAttribute('data-key', email);
            var removeLink = _this.createRemoveLink(email);
            emailBlock.appendChild(removeLink);
            return emailBlock;
        };
        this.createRemoveLink = function (email) {
            var removeLink = document.createElement('a');
            removeLink.innerHTML = '&times;';
            removeLink.setAttribute('href', '#');
            removeLink.addEventListener('click', _this.handleEmailRemove.bind(_this, email));
            dom_1.setClass(removeLink, 'email-remove');
            return removeLink;
        };
        /**
         * Event Handlers
         *
         */
        this.handleContainerClick = function () {
            if (_this.input) {
                _this.input.focus();
            }
        };
        this.handleInputBlur = function () {
            if (_this.input && _this.input.value) {
                _this.addEmailBlock(_this.input.value);
                _this.input.value = '';
            }
        };
        this.handleInputPaste = function (e) {
            e.preventDefault();
            var emails = e.clipboardData && e.clipboardData.getData('text');
            if (emails) {
                emails
                    .split(',')
                    .map(function (email) { return email.trim(); })
                    .forEach(function (email) {
                    _this.addEmailBlock(email);
                });
            }
        };
        this.handleInputKeyDown = function (e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                _this.handleInputBlur();
            }
            if (e.key === 'Backspace' &&
                _this.input &&
                !_this.input.value &&
                _this.container.childNodes.length > 1) {
                _this.container.removeChild(_this.container.childNodes[_this.container.childNodes.length - 2]);
            }
        };
        this.handleEmailRemove = function (email, e) {
            e.stopPropagation();
            _this.removeEmailBlock(email);
        };
        this.emitOnChange = function () {
            if (_this.props.onChange) {
                _this.props.onChange(_this.getEmails());
            }
        };
        if (!this) {
            throw new Error('EmailsEditor should be instantiated with "new" keyword!');
        }
        if (!props.container) {
            throw new Error('EmailsEditor requires DOM element to attach ' +
                ("please pass correct container. You've passed: " + props.container));
        }
        if (props.container.hasChildNodes()) {
            throw new Error('Container DOM element for EmailsEditor should be empty!');
        }
        this.props = props;
        this.container = props.container;
        dom_1.setClass(this.container, 'input-container');
        this.container.addEventListener('click', this.handleContainerClick);
        this.input = this.createInput();
        this.container.appendChild(this.input);
    }
    /**
     * Destruct EmailsEditor and clean up
     * @memberof EmailsEditor
     */
    EmailsEditor.prototype.destruct = function () {
        if (this.container) {
            this.container.removeAttribute('class');
            this.container.removeEventListener('click', this.handleContainerClick);
        }
        if (this.input) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
    };
    return EmailsEditor;
}());
exports.default = EmailsEditor;
//# sourceMappingURL=emails-editor.js.map