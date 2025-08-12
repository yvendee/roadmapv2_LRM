import React, { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, onBlur, autoFocus = false }) => {
  const editorRef = useRef(null);
  const internalValue = useRef(value);

  // Sync editor content when `value` changes from outside, but only if different from current
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      internalValue.current = value;
    }
  }, [value]);

  const execCommand = (command) => {
    // Apply formatting
    document.execCommand(command, false, null);

    // Update internal value after execCommand applied
    if (editorRef.current) {
      internalValue.current = editorRef.current.innerHTML;
      // Notify parent but do NOT reset editor content immediately
      onChange(internalValue.current);
    }
  };

  const onInput = () => {
    if (editorRef.current) {
      internalValue.current = editorRef.current.innerHTML;
      onChange(internalValue.current);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(internalValue.current);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('bold')}><b>B</b></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('italic')}><i>I</i></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('underline')}><u>U</u></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('insertUnorderedList')}>• List</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        onBlur={handleBlur}
        style={{
          minHeight: '80px',
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: 4,
          fontSize: '14px',
          overflowY: 'auto',
        }}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default RichTextEditor;
