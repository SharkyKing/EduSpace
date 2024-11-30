import React, {useEffect, useRef} from 'react';
import './SInput.css';
import './STextArea.css';



const SInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  readOnly = false,
  onChange, 
  name, 
  className, 
  onKeyDown,
  multiline = false,  
  ...rest 
}) => {
  const textareaRef = useRef(null);

    useEffect(() => {
        // Adjust height based on content
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
        }
    }, [value]);

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        className={`stextarea ${className}`}
        {...rest}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      onKeyDown={onKeyDown}
      readOnly={readOnly}
      className={`sinput ${className} ${readOnly ? "readOnlyInput" : ""}`} 
      {...rest} 
    />
  );
};

export default SInput;
