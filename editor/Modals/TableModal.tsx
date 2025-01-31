import { useState } from "react";

import { cn } from "@/lib/utils";
import Quill from "quill";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface TableModalProps {
  isOpen: boolean
  onClose: (state: boolean) => void
  editor: Quill | null
}

const COLS_COUNT = 10;
const ROWS_COUNT = 10;

export const TableModal = ({
  isOpen,
  onClose,
  editor,
}: TableModalProps) => {
  const [hoveredCell, setHoveredCell] = useState<null | {x: number, y: number}>(null)

  const handleCellSelect = (x: number, y: number) => {
    if (editor) {
      const tableModule = editor.getModule("better-table") as any;
      if (tableModule) {
        tableModule.insertTable(x + 1, y + 1);
      }
      onClose(false);
    }
  }

  const handleCellHover = (x: number, y: number) => {
    setHoveredCell({ x, y })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Select the number of columns and rows for your table.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-center mb-2">
            {hoveredCell ? `${hoveredCell.x + 1} x ${hoveredCell.y + 1}` : "Hover over a cell to select it."}
          </p>
          <div className="grid grid-cols-10 grid-rows-10 gap-1.5 w-[294px] mx-auto">
          {Array(COLS_COUNT).fill(0).map((_, i) => (
            <>
            {Array(ROWS_COUNT).fill(0).map((_, j) => (
              <button 
                key={`${i}+${j}`} 
                onClick={() => handleCellSelect(i, j)} 
                onMouseOver={() => handleCellHover(i, j)} 
                className={cn("w-6 h-6 border border-solid", {
                  "bg-blue-100 border-blue-300": hoveredCell && (hoveredCell.x >= i && hoveredCell.y >= j),
                  "bg-slate-100 border-slate-300": !hoveredCell || (hoveredCell.x < i || hoveredCell.y < j),
                })}
              />
              ))}
            </>
            ) )}
          </div>

        </div>
        <DialogFooter>
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
