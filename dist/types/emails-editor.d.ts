import './styles.scss';
interface Props {
    container: Element;
    onChange?: (emailsList: string[]) => void;
}
export default class EmailsEditor {
    private props;
    private container;
    private input;
    constructor(props: Props);
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
    addEmailBlock: (email: string, silent?: boolean | undefined) => void;
    /**
     * Remove Email item from the list
     * @param {string} email Email to be removed
     * @param {boolean} silent Pass true if you don't want subscribers to be notified about this change
     * @memberof EmailsEditor
     */
    removeEmailBlock: (email: string, silent?: boolean | undefined) => void;
    /**
     * Get current email items, please not that result will include not valid emails
     * @returns {string[]} emails list
     * @memberof EmailsEditor
     */
    getEmails: () => string[];
    /**
     * Get current valid email items
     * @returns {string[]} emails list
     * @memberof EmailsEditor
     */
    getValidEmails: () => (string | null)[];
    /**
     * Set current email items, this will replace existing items with new list
     * @param {string[]} emails emails list
     * @memberof EmailsEditor
     */
    setEmails: (emails: string[]) => void;
    /**
     * Destruct EmailsEditor and clean up
     * @memberof EmailsEditor
     */
    destruct(): void;
    /**
     * Element factories
     */
    private createInput;
    private createEmailBlock;
    private createRemoveLink;
    /**
     * Event Handlers
     *
     */
    private handleContainerClick;
    private handleInputBlur;
    private handleInputPaste;
    private handleInputKeyDown;
    private handleEmailRemove;
    private emitOnChange;
}
export {};
