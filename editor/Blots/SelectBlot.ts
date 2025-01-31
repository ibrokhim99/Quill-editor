import Quill from "quill"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InlineBlot = Quill.import("blots/embed") as any

interface ValueProps {
  id: string
  options: string[]
  correctOption: string
}

export class SelectBlot extends InlineBlot {
  static blotName = "select"
  static tagName = "select-blot"

  static create(value: ValueProps) {
    const node = super.create()
    node.setAttribute("data-id", value.id)
    node.setAttribute("data-correct-option", value.correctOption)

    const select = document.createElement("select")
    select.id = value.id
    select.setAttribute("name", "QUESTION_ORDER")
    select.setAttribute("style", "border: 1px solid black;")

    if (value.options && Array.isArray(value.options)) {
      value.options.forEach((item) => {
        const option = document.createElement("option")
        option.value = item
        option.textContent = item

        if (item === value.correctOption) {
          option.setAttribute("selected", "true")
        }

        select.appendChild(option)
      })
    } else {
      console.error("options is undefined or not an array", value.options)
    }

    node.appendChild(select)
    return node
  }

  static value(node: HTMLElement) {
    if (node.tagName.toLowerCase() !== "select-blot") {
      return null
    }

    const select = node.querySelector("select")
    const options: string[] = []
    let correctOption: string = ""

    if (select) {
      select.querySelectorAll("option").forEach((option) => {
        const label = option.value || ""
        options.push(label)

        if ((option as HTMLOptionElement).selected) {
          correctOption = label
        }
      })
    }

    return {
      id: node.getAttribute("data-id") || "",
      options,
      correctOption:
        correctOption || node.getAttribute("data-correct-option") || "",
    }
  }
}

Quill.register(SelectBlot)
