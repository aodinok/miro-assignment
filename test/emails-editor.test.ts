import EmailsEditor from '../src/emails-editor'

describe('EmailsEditor', () => {
  it('EmailsEditor is instantiable', () => {
    document.body.innerHTML = '<div class="miro-email-editor" id="emails-editor"></div>'
    const props = { container: document.querySelector('#emails-editor')! }
    expect(new EmailsEditor(props)).toBeInstanceOf(EmailsEditor)
  })

  it('EmailsEditor should support setEmails and getEmails', () => {
    document.body.innerHTML = '<div class="miro-email-editor" id="emails-editor"></div>'
    const props = { container: document.querySelector('#emails-editor')! }
    const editor = new EmailsEditor(props)
    editor.setEmails(['test@gmail.com', 'test1@gmail.com'])
    expect(editor.getEmails()).toEqual(['test@gmail.com', 'test1@gmail.com'])
  })

  it('EmailsEditor should return only valid emails', () => {
    document.body.innerHTML = '<div class="miro-email-editor" id="emails-editor"></div>'
    const props = { container: document.querySelector('#emails-editor')! }
    const editor = new EmailsEditor(props)
    editor.setEmails(['test@gmail.com', 'test1@gmail.com', 'notValid'])
    expect(editor.getValidEmails()).toEqual(['test@gmail.com', 'test1@gmail.com'])
  })

  it('EmailsEditor should support adding/removing emails one by one', () => {
    document.body.innerHTML = '<div class="miro-email-editor" id="emails-editor"></div>'
    const props = { container: document.querySelector('#emails-editor')! }
    const editor = new EmailsEditor(props)
    editor.addEmailBlock('test@gmail.com')
    expect(editor.getEmails()).toEqual(['test@gmail.com'])
    editor.removeEmailBlock('test@gmail.com')
    expect(editor.getEmails()).toEqual([])
  })

  it('EmailsEditor should support destruction', () => {
    document.body.innerHTML = '<div class="miro-email-editor" id="emails-editor"></div>'
    const props = { container: document.querySelector('#emails-editor')! }
    const editor = new EmailsEditor(props)
    editor.addEmailBlock('test@gmail.com')
    expect(document.body.innerHTML).toContain(
      '<span class="mee-email-block" data-key="test@gmail.com">'
    )
    editor.destruct()
    expect(document.body.innerHTML).not.toContain(
      '<span class="mee-email-block" data-key="test@gmail.com">'
    )
  })
})
