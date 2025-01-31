import React, { useCallback, useEffect, useRef, useState } from "react"

import Quill from "quill"
import QuillBetterTable from "quill-better-table"
import "quill-better-table/dist/quill-better-table.css"
import "quill/dist/quill.snow.css"

// Import custom Blots and Modals
import { CheckboxBlot } from "./Blots/CheckboxBlot"
import { InputBlot } from "./Blots/InputBlot"
import { RadioBlot } from "./Blots/RadioBlot"
import { SelectBlot } from "./Blots/SelectBlot"
import { InputModal } from "./Modals/InputModal"
import { MultiSelectModal } from "./Modals/MultiSelectModal"
import { SingleSelectModal } from "./Modals/SingleSelectModal"
import { TableModal } from "./Modals/TableModal"
import { EditorToolbar } from "./Toolbar"

// Register Blots and QuillBetterTable module
Quill.register("modules/better-table", QuillBetterTable)
Quill.register("blots/input", InputBlot)
Quill.register("blots/radio", RadioBlot)
Quill.register("blots/select", SelectBlot)
Quill.register("blots/checkbox", CheckboxBlot)

interface IModalState {
  isRadioOpen: boolean
  isCheckboxOpen: boolean
  isSelectOpen: boolean
  isInputOpen: boolean
  isTableOpen: boolean
}

interface IProps {
  value: string
  onChange: (content: string) => void
  fieldName?: string
  placeholder?: string
}

const modules = {
  toolbar: {
    container: "#toolbar",
  },
  clipboard: {
    matchVisual: false,
  },
  "better-table": {
    operationMenu: {
      items: {
        unmergeCells: {
          text: "Another unmerge cells name",
        },
      },
      color: {
        colors: ["#fff", "red", "rgb(0, 0, 0)"], // Colors in operationMenu
        text: "Background Colors", // Subtitle
      },
    },
  },
}

const TextEditor: React.FC<IProps> = ({
  value,
  onChange,
  fieldName = "",
  placeholder = "",
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const [modalState, setModalState] = useState<IModalState>({
    isRadioOpen: false,
    isCheckboxOpen: false,
    isSelectOpen: false,
    isInputOpen: false,
    isTableOpen: false,
  })

  const openModal = useCallback(
    (modalType: keyof IModalState, isOpen: boolean) => {
      setModalState((prev) => ({ ...prev, [modalType]: isOpen }))
    },
    [],
  )

  // Initialize Quill editor when component mounts
  useEffect(() => {
    if (editorRef.current && !quill) {
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          ...modules,
          toolbar: { container: fieldName ? `#${fieldName}` : "#toolbar" },
        },
      })

      quillInstance.setContents(
        quillInstance.clipboard.convert({
          html: value,
        }),
      )

      quillInstance.on("text-change", () => {
        onChange(quillInstance.root.innerHTML) // Sync changes with parent component
      })

      setQuill(quillInstance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, fieldName, onChange])

  return (
    <div>
      <EditorToolbar
        id={fieldName}
        selectOpens={{
          setRadioOpen: () => openModal("isRadioOpen", true),
          setSelectOpen: () => openModal("isSelectOpen", true),
          setCheckboxOpen: () => openModal("isCheckboxOpen", true),
          setInputOpen: () => openModal("isInputOpen", true),
          setTableOpen: () => openModal("isTableOpen", true),
        }}
      />

      <div
        ref={editorRef}
        style={{ height: "400px", border: "1px solid #ccc" }}
      />

      <SingleSelectModal
        isOpen={modalState.isRadioOpen}
        onClose={(isOpen) => openModal("isRadioOpen", isOpen)}
        editor={quill}
        type="radio"
        fieldName={fieldName}
      />
      <SingleSelectModal
        isOpen={modalState.isSelectOpen}
        onClose={(isOpen) => openModal("isSelectOpen", isOpen)}
        editor={quill}
        type="select"
        fieldName={fieldName}
      />
      <MultiSelectModal
        isOpen={modalState.isCheckboxOpen}
        onClose={(isOpen) => openModal("isCheckboxOpen", isOpen)}
        editor={quill}
        fieldName={fieldName}
      />
      <InputModal
        isOpen={modalState.isInputOpen}
        onClose={(isOpen) => openModal("isInputOpen", isOpen)}
        editor={quill}
        fieldName={fieldName}
      />
      <TableModal
        isOpen={modalState.isTableOpen}
        editor={quill}
        onClose={(isOpen) => openModal("isTableOpen", isOpen)}
      />
    </div>
  )
}

export default TextEditor
