var INPUT_PLACEHOLDER = 'add more people...';

var CLASS_NAME_UNIQUE_PREFIX = 'mee-'; // mee - Miro Emails Editor
function setClass(element, className) {
    var existingClass = element.getAttribute('class');
    var newClass = "" + CLASS_NAME_UNIQUE_PREFIX + className;
    element.setAttribute('class', existingClass ? existingClass + " " + newClass : newClass);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".mee-input-container {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  background-color: white;\n  border-radius: 3px;\n  border: 1px solid #c3c3c3;\n  overflow: auto; }\n  .mee-input-container:focus-within {\n    box-shadow: 0 0 0 2pt #b6d2fe; }\n\n.mee-input {\n  opacity: .7;\n  font-size: 15px;\n  margin: 8px;\n  border: none; }\n  .mee-input:focus {\n    outline: none;\n    opacity: 1; }\n\n.mee-email-block {\n  background: #e0ecff;\n  border-radius: 15px;\n  padding: 4px 10px;\n  margin-left: 5px;\n  margin-top: 5px;\n  font-size: 15px;\n  font-weight: 300; }\n  .mee-email-block--invalid {\n    text-decoration: underline;\n    text-decoration-color: red; }\n\n.mee-email-remove {\n  color: black;\n  display: inline-block;\n  font-size: 16px;\n  margin-left: 8px;\n  opacity: .7;\n  text-decoration: none;\n  transition: all .25s ease-in-out; }\n  .mee-email-remove:hover {\n    cursor: pointer;\n    opacity: 1;\n    color: #4262ff;\n    transform: scale(1.15); }\n";
styleInject(css);

function isValidEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
}

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
            _this.getEmails().filter(isValidEmail);
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
            setClass(input, 'input');
            input.setAttribute('placeholder', INPUT_PLACEHOLDER);
            input.addEventListener('blur', _this.handleInputBlur);
            input.addEventListener('keydown', _this.handleInputKeyDown);
            input.addEventListener('paste', _this.handleInputPaste);
            return input;
        };
        this.createEmailBlock = function (email) {
            var emailBlock = document.createElement('span');
            setClass(emailBlock, 'email-block');
            if (!isValidEmail(email)) {
                setClass(emailBlock, 'email-block--invalid');
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
            setClass(removeLink, 'email-remove');
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
        setClass(this.container, 'input-container');
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

export default EmailsEditor;
//# sourceMappingURL=emails-editor.es5.js.map
