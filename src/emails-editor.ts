import { INPUT_PLACEHOLDER } from './strings'
import { setClass } from './utils/dom'

import './styles.scss'

interface Props {
  container: Element
}

export default class EmailsEditor {
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
    this.container = props.container
    this.init()
  }

  public destruct() {
    if (this.container) {
      this.container.removeAttribute('class')
      this.container.removeEventListener('click', this.handleContainerClick)
    }
    if (this.input) {
      this.container.removeChild(this.input)
    }
  }

  private init() {
    setClass(this.container, 'input-container')
    this.container.addEventListener('click', this.handleContainerClick)
    this.input = this.createInput()
    this.container.appendChild(this.input)
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
    return input
  }

  private createEmailBlock = (email: string): HTMLSpanElement => {
    const emailBlock = document.createElement('span')
    setClass(emailBlock, 'email-block')
    emailBlock.textContent = email
    emailBlock.setAttribute('data-key', email)

    // add remove link
    const removeLink = document.createElement('a')
    removeLink.innerHTML = '&times;'
    removeLink.setAttribute('href', '#')
    removeLink.addEventListener('click', this.handleEmailRemove.bind(this, email))
    setClass(removeLink, 'email-remove')
    emailBlock.appendChild(removeLink)

    return emailBlock
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

  private handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleInputBlur()
    }
    if (e.key === 'Backspace' && this.container.childNodes.length > 1) {
      this.container.removeChild(this.container.childNodes[this.container.childNodes.length - 2])
    }
  }

  private handleEmailRemove = (email: string, e: KeyboardEvent | MouseEvent) => {
    e.stopPropagation()
    this.removeEmailBlock(email)
  }

  /**
   * DOM mutations
   *
   */

  private addEmailBlock = (email: string) => {
    const existing = this.container.querySelectorAll(`[data-key="${email}"]`)
    if (existing && existing.length === 0) {
      const emailBlock = this.createEmailBlock(email)
      this.container.insertBefore(emailBlock, this.input)
    }
  }

  private removeEmailBlock = (email: string) => {
    const result = this.container.querySelectorAll(`[data-key="${email}"]`)
    if (result && result.length === 1) {
      this.container.removeChild(result[0])
    }
  }
}
