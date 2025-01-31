import Quill from "quill"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InlineBlot = Quill.import("blots/embed") as any

interface ValueProps {
  id: string
  options: string[]
  correctOption: string
}
export class RadioBlot extends InlineBlot {
  static blotName = "radio"
  static tagName = "radio-blot"

  static create(value: ValueProps) {
    const node = super.create()
    node.setAttribute("data-id", value.id)
    node.setAttribute("data-correct-option", value.correctOption)

    const radioGroup = document.createElement("radio-blot-group")
    radioGroup.setAttribute("id", value.id)
    radioGroup.setAttribute("name", "QUESTION_ORDER")

    value.options.forEach((item) => {
      const radioItem = document.createElement("radio-blot-item")
      radioItem.setAttribute("style", "display: block;")

      const radio = document.createElement("input")
      radio.setAttribute("type", "radio")
      radio.setAttribute("id", item)
      radio.setAttribute("value", item)

      if (item === value.correctOption) {
        radio.setAttribute("checked", "true")
      } else {
        radio.removeAttribute("checked")
      }

      const radioLabel = document.createElement("label")
      radioLabel.setAttribute("htmlFor", item)
      radioLabel.textContent = item

      radioItem.append(radio, radioLabel)
      radioGroup.appendChild(radioItem)
    })

    node.appendChild(radioGroup)
    return node
  }

  format(_: string, value: ValueProps) {
    const newNode = RadioBlot.create(value)
    this.domNode.innerHTML = newNode.innerHTML
  }

  static value(node: HTMLElement) {
    if (node.tagName.toLowerCase() !== "radio-blot") {
      return null
    }

    const options: string[] = []
    let correctOption = ""

    const radios = node.querySelectorAll("input[type='radio']")
    radios.forEach((radio) => {
      const label = radio.getAttribute("value") || ""
      options.push(label)

      if ((radio as HTMLInputElement).checked) {
        correctOption = label
      }
    })

    return {
      id: node.getAttribute("data-id") || "",
      options,
      correctOption:
        correctOption || node.getAttribute("data-correct-option") || "",
    }
  }
}

Quill.register(RadioBlot)
