import { INPUT_PLACEHOLDER } from './strings'
import { setClass } from './utils/dom'

import './styles.scss'
import { isValidEmail } from './utils/validation'

interface Props {
  container: Element
  onChange?: (emailsList: string[]) => void
}

export default class EmailsEditor {
  private props: Props
  private container: Element
  private input: HTMLInputElement | null = null

  constructor(props: Props) {
    if (!this) {
      throw new Error('EmailsEditor should be instantiated with "new" keyword!')
    }
    if (!props.container) {
      throw new Error(
        'EmailsEditor requires DOM element to attach ' +
          `please pass correct container. You've passed: ${props.container}`
      )
    }
    if (props.container.hasChildNodes()) {
      throw new Error('Container DOM element for EmailsEditor should be empty!')
    }
    this.props = props
    this.container = props.container
    setClass(this.container, 'input-container')
    this.container.addEventListener('click', this.handleContainerClick)
    this.input = this.createInput()
    this.container.appendChild(this.input)
  }

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
  public addEmailBlock = (email: string, silent?: boolean) => {
    const existing = this.container.querySelectorAll(`[data-key="${email}"]`)
    if (existing && existing.length === 0) {
      const emailBlock = this.createEmailBlock(email)
      this.container.insertBefore(emailBlock, this.input)
      !silent && this.emitOnChange()
    }
  }

  /**
   * Remove Email item from the list
   * @param {string} email Email to be removed
   * @param {boolean} silent Pass true if you don't want subscribers to be notified about this change
   * @memberof EmailsEditor
   */
  public removeEmailBlock = (email: string, silent?: boolean) => {
    const result = this.container.querySelectorAll(`[data-key="${email}"]`)
    if (result && result.length === 1) {
      this.container.removeChild(result[0])
      !silent && this.emitOnChange()
    }
  }

  /**
   * Get current email items, please not that result will include not valid emails
   * @returns {string[]} emails list
   * @memberof EmailsEditor
   */
  public getEmails = (): string[] => {
    const result = this.container.querySelectorAll('.mee-email-block')
    if (result && result.length > 0) {
      return [].slice.call(result).map((e: HTMLSpanElement) => e.getAttribute('data-key') as string)
    }
    return []
  }

  /**
   * Get current valid email items
   * @returns {string[]} emails list
   * @memberof EmailsEditor
   */
  public getValidEmails = () => {
    this.getEmails().filter(isValidEmail)
    const result = this.container.querySelectorAll(
      '.mee-email-block:not(.mee-email-block--invalid)'
    )
    if (result && result.length > 0) {
      return [].slice.call(result).map((e: HTMLSpanElement) => e.getAttribute('data-key'))
    }
    return []
  }

  /**
   * Set current email items, this will replace existing items with new list
   * @param {string[]} emails emails list
   * @memberof EmailsEditor
   */
  public setEmails = (emails: string[]) => {
    if (emails && Array.isArray(emails)) {
      // "silently" clear existing
      const existingEmails = this.getEmails()
      existingEmails.map(email => this.removeEmailBlock(email, false))
      // "silently" set new list
      emails.map(email => this.addEmailBlock(email, false))
      // and then notify clients
      this.emitOnChange()
    }
  }

  /**
   * Destruct EmailsEditor and clean up
   * @memberof EmailsEditor
   */
  public destruct() {
    if (this.container) {
      this.container.removeAttribute('class')
      this.container.removeEventListener('click', this.handleContainerClick)
    }
    if (this.input) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild)
      }
    }
  }

  /**
   * Element factories
   */

  private createInput = (): HTMLInputElement => {
    const input = document.createElement('input')
    setClass(input, 'input')
    input.setAttribute('placeholder', INPUT_PLACEHOLDER)
    input.addEventListener('blur', this.handleInputBlur)
    input.addEventListener('keydown', this.handleInputKeyDown)
    input.addEventListener('paste', this.handleInputPaste)
    return input
  }

  private createEmailBlock = (email: string): HTMLSpanElement => {
    const emailBlock = document.createElement('span')
    setClass(emailBlock, 'email-block')
    if (!isValidEmail(email)) {
      setClass(emailBlock, 'email-block--invalid')
    }
    emailBlock.textContent = email
    emailBlock.setAttribute('data-key', email)
    const removeLink = this.createRemoveLink(email)
    emailBlock.appendChild(removeLink)
    return emailBlock
  }

  private createRemoveLink = (email: string): HTMLAnchorElement => {
    const removeLink = document.createElement('a')
    removeLink.innerHTML = '&times;'
    removeLink.setAttribute('href', '#')
    removeLink.addEventListener('click', this.handleEmailRemove.bind(this, email))
    setClass(removeLink, 'email-remove')
    return removeLink
  }

  /**
   * Event Handlers
   *
   */

  private handleContainerClick = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  private handleInputBlur = () => {
    if (this.input && this.input.value) {
      this.addEmailBlock(this.input.value)
      this.input.value = ''
    }
  }

  private handleInputPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const emails = e.clipboardData && e.clipboardData.getData('text')
    if (emails) {
      emails
        .split(',')
        .map(email => email.trim())
        .forEach(email => {
          this.addEmailBlock(email)
        })
    }
  }

  private handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      this.handleInputBlur()
    }
    if (
      e.key === 'Backspace' &&
      this.input &&
      !this.input.value &&
      this.container.childNodes.length > 1
    ) {
      this.container.removeChild(this.container.childNodes[this.container.childNodes.length - 2])
    }
  }

  private handleEmailRemove = (email: string, e: KeyboardEvent | MouseEvent) => {
    e.stopPropagation()
    this.removeEmailBlock(email)
  }

  private emitOnChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.getEmails())
    }
  }
}
