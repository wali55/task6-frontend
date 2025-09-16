import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTextBlock, setDragging } from '../store/slices/presentationSlice';

const TextBlock = ({ block, slideId, canEdit, updateTextBlock, moveTextBlock, deleteTextBlock }) => {
  const dispatch = useDispatch();
  const { selectedTextBlock, currentPresentation } = useSelector(state => state.presentation);
  
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, blockX: 0, blockY: 0 });
  
  const textareaRef = useRef(null);
  const blockRef = useRef(null);
  
  const isSelected = selectedTextBlock === block.id;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (canEdit) {
      dispatch(setSelectedTextBlock(block.id));
    }
  };

  const handleDoubleClick = () => {
    if (canEdit) {
      setIsEditing(true);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleContentSave = () => {
    if (content !== block.content && currentPresentation) {
      updateTextBlock(currentPresentation.id, slideId, block.id, { content });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleContentSave();
    } else if (e.key === 'Escape') {
      setContent(block.content);
      setIsEditing(false);
    }
  };

  const handleMouseDown = (e) => {
    if (!canEdit || isEditing) return;
    
    setIsDragging(true);
    dispatch(setDragging(true));
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      blockX: block.x,
      blockY: block.y
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canEdit) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const newX = Math.max(0, dragStart.blockX + deltaX);
    const newY = Math.max(0, dragStart.blockY + deltaY);
    
    if (currentPresentation) {
      moveTextBlock(currentPresentation.id, slideId, block.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dispatch(setDragging(false));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (canEdit && currentPresentation) {
      deleteTextBlock(currentPresentation.id, slideId, block.id);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={blockRef}
      className={`absolute bg-white border-2 rounded-lg p-3 shadow-sm cursor-move select-none ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-80 z-50' : 'z-10'}`}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        minHeight: block.height,
        userSelect: isEditing ? 'text' : 'none'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onBlur={handleContentSave}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
          style={{ minHeight: '60px' }}
          placeholder="Enter text..."
        />
      ) : (
        <div 
          className="whitespace-pre-wrap break-words"
          style={{ minHeight: '20px' }}
        >
          {block.content || 'Click to edit'}
        </div>
      )}
      
      {isSelected && canEdit && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TextBlock;