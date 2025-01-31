import { useCallback, useEffect, useState } from "react"

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
  type: "select" | "radio"
  fieldName: string
  value?: {
    id: string
    options: string[]
    correctOption: string
  }
}

export const SingleSelectModal = ({
  isOpen,
  onClose,
  editor,
  type,
  fieldName,
  value,
}: ModalProps) => {
  const [options, setOptions] = useState<string[]>(["", "", ""])
  const [correctOption, setCorrectOption] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const form = useFormContext()

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index: number) => {
    const removedOption = options[index]
    setOptions(options.filter((_, i) => i !== index))
    if (correctOption === removedOption) {
      setCorrectOption(null)
    }
  }

  const handleOptionChange = (index: number, label: string) => {
    const updatedOptions = [...options]
    updatedOptions[index] = label
    setOptions(updatedOptions)
  }

  const handleInsert = () => {
    if (!correctOption) {
      setError("Please select a correct option before inserting.")
      return
    }

    const emptyLabels = options.some((option) => option.trim() === "")
    if (emptyLabels) {
      setError("All options must have a label.")
      return
    }

    const blotValue = { id: value?.id || uuidv4(), options, correctOption }

    if (value) {
      editor?.format(type, blotValue)
    } else {
      insertElement({
        editor: editor!,
        values: blotValue,
        elementName: type,
      })
    }

    const newInput = {
      [blotValue.id]: correctOption,
    }
    form.setValue(fieldName, {
      ...form.getValues(fieldName),
      ...newInput,
    })

    resetForm()
  }

  const resetForm = useCallback(() => {
    onClose(false)
    setOptions(["", "", ""])
    setCorrectOption(null)
    setError(null)
  }, [onClose])

  useEffect(() => {
    if (value) {
      setOptions(value.options)
      setCorrectOption(value.correctOption)
    }
  }, [value])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Create ${type.charAt(0).toUpperCase() + type.slice(1)} Options`}</DialogTitle>
          <DialogDescription>
            Define the options and select the correct one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`label-${index}`}>Option</Label>
              <div className="w-full">
                <Input
                  id={`label-${index}`}
                  placeholder="option"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
              <input
                type="radio"
                id={`correct-${index}`}
                checked={correctOption === option}
                className="size-4"
                onChange={() => {
                  setCorrectOption(option)
                  setError(null)
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveOption(index)}
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
          <Button type="button" onClick={resetForm} variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
