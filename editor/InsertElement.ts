import Quill from "quill"

interface IProps {
  editor: Quill
  values: {
    id: string
    options: string[]
    correctOptions?: string[]
    correctOption?: string
  }
  elementName: "select" | "radio" | "checkbox"
}

export function insertElement({ editor, values, elementName }: IProps) {
  const range = editor.getSelection(true)
  const cursorPosition = range ? range.index : editor.getLength()

  editor.insertText(cursorPosition, " ", "user")
  editor.insertEmbed(cursorPosition, elementName, values, "user")
  editor.insertText(cursorPosition + 2, " ", "user")
  editor.setSelection(cursorPosition + 3, 0, "silent")
  setTimeout(() => {
    editor.focus()
  }, 0)
}
