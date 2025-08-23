import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
}: RichTextEditorProps) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'script',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'blockquote',
    'code-block',
    'color',
    'background',
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <style jsx global>{`
        /* Base toolbar styles */
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #ffffff;
          padding: 8px 12px;
        }

        /* Base container styles */
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
        }

        /* Editor content area */
        .rich-text-editor .ql-editor {
          min-height: 300px;
          line-height: 1.6;
          color: #111827;
          padding: 12px 16px;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
          opacity: 0.8;
        }

        /* Toolbar buttons */
        .rich-text-editor .ql-toolbar button {
          border-radius: 4px;
          margin: 1px;
          padding: 3px 5px;
        }

        .rich-text-editor .ql-toolbar button:hover {
          background-color: #f3f4f6;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          background-color: #e5e7eb;
          color: #374151;
        }

        /* Dropdown styles */
        .rich-text-editor .ql-toolbar .ql-picker {
          border-radius: 4px;
        }

        .rich-text-editor .ql-toolbar .ql-picker-label {
          border: none;
          padding: 3px 5px;
          border-radius: 4px;
        }

        .rich-text-editor .ql-toolbar .ql-picker-label:hover {
          background-color: #f3f4f6;
        }

        .rich-text-editor .ql-toolbar .ql-picker-options {
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 4px;
          z-index: 50;
        }

        .rich-text-editor .ql-toolbar .ql-picker-item {
          padding: 4px 8px;
          border-radius: 4px;
          color: #374151;
        }

        .rich-text-editor .ql-toolbar .ql-picker-item:hover {
          background-color: #f3f4f6;
        }

        /* Dark mode styles */
        .dark .rich-text-editor .ql-toolbar {
          border-color: #374151;
          background: #1f2937;
        }

        .dark .rich-text-editor .ql-container {
          border-color: #374151;
          background: #1f2937;
        }

        .dark .rich-text-editor .ql-editor {
          color: #f9fafb;
        }

        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
        }

        /* Dark mode toolbar buttons */
        .dark .rich-text-editor .ql-toolbar button {
          color: #f9fafb;
        }

        .dark .rich-text-editor .ql-toolbar button:hover {
          background-color: #374151;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active {
          background-color: #4b5563;
          color: #f9fafb;
        }

        /* Dark mode SVG icons */
        .dark .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #f9fafb;
        }

        .dark .rich-text-editor .ql-toolbar .ql-fill {
          fill: #f9fafb;
        }

        /* Dark mode dropdowns */
        .dark .rich-text-editor .ql-toolbar .ql-picker-label {
          color: #f9fafb;
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-label:hover {
          background-color: #374151;
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-options {
          background: #1f2937;
          border-color: #374151;
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-item {
          color: #f9fafb;
        }

        .dark .rich-text-editor .ql-toolbar .ql-picker-item:hover {
          background-color: #374151;
        }

        /* Focus styles */
        .rich-text-editor:focus-within .ql-toolbar,
        .rich-text-editor:focus-within .ql-container {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        /* Custom scrollbar for editor */
        .rich-text-editor .ql-editor::-webkit-scrollbar {
          width: 6px;
        }

        .rich-text-editor .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }

        .rich-text-editor .ql-editor::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .dark .rich-text-editor .ql-editor::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        /* Header styles in editor */
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          margin: 0.67em 0;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          margin: 0.75em 0;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.3em;
          margin: 0.83em 0;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor h4 {
          font-size: 1.1em;
          margin: 1.12em 0;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor h5 {
          font-size: 1em;
          margin: 1.33em 0;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor h6 {
          font-size: 0.9em;
          margin: 1.67em 0;
          font-weight: bold;
        }

        /* List styles */
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }

        /* Link styles */
        .rich-text-editor .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .dark .rich-text-editor .ql-editor a {
          color: #60a5fa;
        }

        /* Blockquote styles */
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #d1d5db;
          margin: 1em 0;
          padding-left: 1em;
          font-style: italic;
        }

        .dark .rich-text-editor .ql-editor blockquote {
          border-left-color: #4b5563;
        }

        /* Code block styles */
        .rich-text-editor .ql-editor pre.ql-syntax {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #374151;
          font-family: 'Fira Code', Consolas, 'Courier New', monospace;
          margin: 1em 0;
          padding: 1em;
          overflow-x: auto;
        }

        .dark .rich-text-editor .ql-editor pre.ql-syntax {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
