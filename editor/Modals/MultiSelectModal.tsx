import { useState } from "react"

import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import Quill from "quill"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { insertElement } from "../InsertElement"

interface ModalProps {
  isOpen: boolean
  onClose: (state: boolean) => void
  editor: Quill | null
  fieldName: string
}

export const MultiSelectModal = ({
  isOpen,
  onClose,
  editor,
  fieldName,
}: ModalProps) => {
  const [options, setOptions] = useState<string[]>(["", "", ""])
  const [correctOptions, setCorrectOptions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const form = useFormContext()

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleOptionChange = (index: number, label: string) => {
    const updatedOptions = [...options]
    updatedOptions[index] = label
    setOptions(updatedOptions)
  }

  const handleDeleteOption = (index: number) => {
    const optionLabel = options[index]
    setOptions(options.filter((_, i) => i !== index))
    setCorrectOptions(correctOptions.filter((label) => label !== optionLabel))
  }

  const handleCheckboxChange = (label: string) => {
    if (correctOptions.includes(label)) {
      setCorrectOptions(
        correctOptions.filter((optionLabel) => optionLabel !== label),
      )
    } else {
      setCorrectOptions([...correctOptions, label])
    }
    setError(null)
  }

  const handleInsert = () => {
    if (options.some((option) => option.trim() === "")) {
      setError("All labels must be filled before inserting.")
      return
    }
    if (correctOptions.length <= 1) {
      setError("Please select at least two correct options before inserting.")
      return
    }

    const id = uuidv4()
    const newInputs = {
      [id]: correctOptions,
    }

    form.setValue(fieldName, {
      ...form.getValues(fieldName),
      ...newInputs,
    })

    insertElement({
      editor: editor!,
      values: { id, options, correctOptions },
      elementName: "checkbox",
    })

    onClose(false)
    setOptions(["", "", ""])
    setCorrectOptions([])
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Multi Select Options</DialogTitle>
          <DialogDescription>
            Define the options and select the correct ones.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`label-${index}`}>Option</Label>
              <div className="w-full">
                <Input
                  id={`label-${index}`}
                  placeholder="Option"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
              <input
                type="checkbox"
                id={`correct-${index}`}
                checked={correctOptions.includes(option)}
                className="size-4"
                onChange={() => handleCheckboxChange(option)}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteOption(index)}
                className="text-red-500">
                <X />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddOption} className="border p-1">
            Add Option
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleInsert}>
            Insert
          </Button>
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
