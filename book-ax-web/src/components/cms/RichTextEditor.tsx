'use client';

// =====================================================
// TipTap Rich Text Editor Component
// =====================================================

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = '300px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline hover:text-primary-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none`,
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      {editable && (
        <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('bold')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive('italic')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline ${
              editor.isActive('underline')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm line-through ${
              editor.isActive('strike')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            S
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            1. List
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            ⇤
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            ⇥
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            ⇤
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Special */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('blockquote')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            &quot;
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('codeBlock')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            {'</>'}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Media */}
          <button
            onClick={setLink}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('link')
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            🔗
          </button>
          <button
            onClick={addImage}
            className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100"
            type="button"
          >
            🖼️
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30"
            type="button"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30"
            type="button"
          >
            ↷
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      {editable && (
        <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between">
          <span>{editor.storage.characterCount?.characters() || 0} characters</span>
          <span>{editor.storage.characterCount?.words() || 0} words</span>
        </div>
      )}
    </div>
  );
}
