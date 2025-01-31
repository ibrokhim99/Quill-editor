import Quill from "quill"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InlineBlot = Quill.import("blots/embed") as any

export class CheckboxBlot extends InlineBlot {
  static blotName = "checkbox"
  static tagName = "checkbox-blot"

  static create(value: {
    id: string
    options: string[]
    correctOptions: string[]
  }) {
    const node = super.create()
    node.setAttribute("data-id", value.id)
    node.setAttribute(
      "data-correct-options",
      JSON.stringify(value.correctOptions),
    )

    value.options.forEach((item) => {
      const checkboxItem = document.createElement("checkbox-blot-item")
      checkboxItem.setAttribute("style", "display: block;")

      const checkbox = document.createElement("input")
      checkbox.setAttribute("type", "checkbox")
      checkbox.setAttribute("id", `${value.id}__${item}`)
      checkbox.setAttribute(
        "name",
        `QUESTION_ORDER_${value.correctOptions.length}`,
      )
      checkbox.setAttribute("correctCount", String(value.correctOptions.length))

      if (value.correctOptions.includes(item)) {
        checkbox.setAttribute("checked", "true")
      }

      const labelElement = document.createElement("label")
      labelElement.setAttribute("htmlFor", `${value.id}__${item}`)
      labelElement.textContent = item

      checkboxItem.append(checkbox, labelElement)
      node.appendChild(checkboxItem)
    })

    return node
  }

  static value(node: HTMLElement) {
    if (node.tagName.toLowerCase() !== "checkbox-blot") {
      return null
    }

    const checkboxes = node.querySelectorAll("input[type='checkbox']")
    const options: string[] = []
    const correctOptions: string[] = []

    checkboxes.forEach((checkbox) => {
      const labelElement = checkbox.nextElementSibling as HTMLLabelElement
      const labelText = labelElement?.textContent || ""
      options.push(labelText)

      if ((checkbox as HTMLInputElement).checked) {
        correctOptions.push(labelText)
      }
    })

    return {
      id: node.getAttribute("data-id") || "",
      options,
      correctOptions,
    }
  }
}

Quill.register(CheckboxBlot)
