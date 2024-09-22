// data.ts

export interface RichTextOption {
    value: string;
    label: string;
  }
  
  export interface RichTextCategory {
    category: string;
    options: RichTextOption[];
  }
  
  export const richTextOptions: RichTextCategory[] = [
    {
      category: 'textformatting',
      options: [
        { value: 'bold', label: 'Bold' },
        { value: 'italic', label: 'Italic' },
        { value: 'underline', label: 'Underline' },
        { value: 'strikethrough', label: 'Strikethrough' },
        { value: 'code', label: 'Inline Code' },
        { value: 'highlight', label: 'Highlight' },
        { value: 'color', label: 'Text Color' },
      ],
    },
    {
      category: 'fontsize',
      options: [
        { value: '1', label: 'Extra Small' },
        { value: '2', label: 'Small' },
        { value: '3', label: 'Regular' },
        { value: '4', label: 'Medium' },
        { value: '5', label: 'Large' },
        { value: '6', label: 'Extra Large' },
        { value: '7', label: 'Huge' },
      ],
    },
    {
      category: 'file',
      options: [
        { value: 'new', label: 'New Note' },
        { value: 'text', label: 'Save as Text' },
        { value: 'pdf', label: 'Save as PDF' },
      ],
    },
    {
      category: 'lists',
      options: [
        { value: 'unorderedList', label: 'Unordered List' },
        { value: 'orderedList', label: 'Ordered List' },
      ],
    },
    {
      category: 'media',
      options: [
        { value: 'link', label: 'Insert Link' },
        { value: 'image', label: 'Insert Image' },
      ],
    },
    {
      category: 'blockelements',
      options: [
        { value: 'blockquote', label: 'Blockquote' },
        { value: 'codeBlock', label: 'Code Block' },
      ],
    },
    {
      category: 'alignment',
      options: [
        { value: 'alignmentLeft', label: 'Align Left' },
        { value: 'alignmentCenter', label: 'Align Center' },
        { value: 'alignmentRight', label: 'Align Right' },
        { value: 'alignmentJustify', label: 'Justify' },
      ],
    },
    {
      category: 'actions',
      options: [
        { value: 'undo', label: 'Undo' },
        { value: 'redo', label: 'Redo' },
      ],
    },
    {
      category: 'miscellaneous',
      options: [
        { value: 'clearFormatting', label: 'Clear Formatting' },
      ],
    },
  ];
  