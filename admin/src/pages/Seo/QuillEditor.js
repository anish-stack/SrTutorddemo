import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ initialContent, onContentChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic'],
            ['link'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        onContentChange(quillRef.current.root.innerHTML);
      });
    }

    if (quillRef.current && initialContent) {
      quillRef.current.root.innerHTML = initialContent;
    }
  }, [initialContent, onContentChange]);

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Page Content
      </label>
      <div ref={editorRef} className="bg-white" style={{ height: '300px' }} />
    </div>
  );
};

export default QuillEditor;