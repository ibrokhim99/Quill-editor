import Quill from "quill"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InlineBlot = Quill.import("blots/embed") as any

export class InputBlot extends InlineBlot {
  static blotName = "input"
  static tagName = "input"

  static create(values: { id: string; options: string[]; disabled?: boolean }) {
    const node = super.create() as HTMLInputElement
    node.setAttribute("type", "text")
    node.setAttribute("id", values.id)

    if (values.disabled) {
      node.setAttribute("disabled", "true")
      node.setAttribute("style", "border: 1px solid black; opacity: 0.5;")
    } else {
      node.setAttribute("name", "QUESTION_ORDER")
      node.setAttribute("style", "border: 1px solid black;")
    }

    const optionsString = values.options.join(" / ")
    node.setAttribute("value", optionsString)

    return node
  }

  static value(node: HTMLElement) {
    if (
      node.tagName.toLowerCase() !== "input" ||
      (node as HTMLInputElement).type !== "text"
    ) {
      return null
    }

    const input = node as HTMLInputElement
    const options = input.value.split(" / ")
    return {
      type: input.getAttribute("type"),
      id: input.getAttribute("id"),
      options,
      disabled: input.hasAttribute("disabled"),
    }
  }
}

Quill.register(InputBlot)

interface IProps {
  editor: Quill
  values: {
    id: string
    options: string[]
    disabled?: boolean
  }
}

export function insertInput({ editor, values }: IProps) {
  const range = editor.getSelection(true)
  const cursorPosition = range ? range.index : editor.getLength()

  editor.insertText(cursorPosition, " ", "user")
  editor.insertEmbed(cursorPosition + 1, "input", values, "user")
  editor.insertText(cursorPosition + 2, " ", "user")
  editor.setSelection(cursorPosition + 3, 0, "silent")
  setTimeout(() => {
    editor.focus()
  }, 0)
}
