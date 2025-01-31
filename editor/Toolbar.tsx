import { Disc, Space, SquareCheck, Table, WholeWord } from "lucide-react"

interface IProps {
  id?: string
  selectOpens: {
    setRadioOpen: () => void
    setCheckboxOpen: () => void
    setSelectOpen: () => void
    setInputOpen: () => void
    setTableOpen: () => void
  }
}

export const EditorToolbar = ({
  id,
  selectOpens: {
    setRadioOpen,
    setCheckboxOpen,
    setSelectOpen,
    setInputOpen,
    setTableOpen,
  },
}: IProps) => {
  return (
    <div id={id || "toolbar"} style={{ borderBottomWidth: "0" }}>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="7">
          <option value="1" />
          <option value="2" />
          <option value="7" />
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" defaultValue="">
          <option value=""></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option value="#ffffff"></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
        <select className="ql-background" defaultValue="">
          <option value="#000000"></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option value=""></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-blockquote" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-code" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <select className="ql-align" defaultValue="">
          <option value=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-insertInput" onClick={() => setInputOpen()}>
          <WholeWord size={16} />
        </button>
        <button className="ql-insertSelect" onClick={() => setSelectOpen()}>
          <Space size={16} />
        </button>
        <button className="ql-insertRadio" onClick={() => setRadioOpen()}>
          <Disc size={16} />
        </button>
        <button className="ql-insertCheckbox" onClick={() => setCheckboxOpen()}>
          <SquareCheck size={16} />
        </button>
        <button className="ql-insertCheckbox" onClick={() => setTableOpen()}>
          <Table size={16} />
        </button>
      </span>
    </div>
  )
}
