import { useState } from "react"

import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import { Checkbox } from "@/components/ui/checkbox"

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
import { insertInput } from "../Blots/InputBlot"

interface InputModalProps {
  isOpen: boolean
  onClose: (state: boolean) => void
  editor: Quill | null
  fieldName: string
}

export const InputModal = ({
  isOpen,
  onClose,
  editor,
  fieldName,
}: InputModalProps) => {
  const [values, setValues] = useState([""])
  const [error, setError] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const form = useFormContext()

  const handleAddInput = () => {
    setValues([...values, ""])
  }

  const handleInputChange = (index: number, value: string) => {
    const updatedValues = [...values]
    updatedValues[index] = value
    setValues(updatedValues)
  }

  const handleDeleteInput = (index: number) => {
    setValues(values.filter((_, i) => i !== index))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setIsDisabled(checked)
  }

  const handleInsert = () => {
    if (values.some((value) => value.trim() === "")) {
      setError("All input values must be filled before inserting.")
      return
    }

    const id = uuidv4()
    const newInputs = { [id]: values }

    form.setValue(fieldName, {
      ...form.getValues(fieldName),
      ...newInputs,
    })

    insertInput({
      editor: editor!,
      values: { id, options: values, disabled: isDisabled },
    })

    onClose(false)
    setValues([""])
    setIsDisabled(false)
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Input Field</DialogTitle>
          <DialogDescription>
            Define the values for each input field.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {values.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`value-${index}`}>Value</Label>
              <div className="w-full">
                <Input
                  id={`input-${index}`}
                  placeholder="Enter value"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteInput(index)}
                className="text-red-500">
                <X />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddInput} className="border p-1">
            Additional value
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-1">
            <Checkbox onCheckedChange={handleCheckboxChange} />
            <Label>Example value</Label>
          </div>
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
