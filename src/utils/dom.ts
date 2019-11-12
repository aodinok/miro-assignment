const CLASS_NAME_UNIQUE_PREFIX = 'mee-' // mee - Miro Emails Editor

function setClass(element: Element, className: string) {
  const existingClass = element.getAttribute('class')
  const newClass = `${CLASS_NAME_UNIQUE_PREFIX}${className}`
  element.setAttribute('class', existingClass ? `${existingClass} ${newClass}` : newClass)
}

export { setClass }
