import './Input.css';

function Input({ 
  label,
  error,
  type = 'text',
  fullWidth = false,
  className = '',
  ...props 
}) {
  const inputClasses = [
    'neo-input',
    fullWidth && 'neo-input--full',
    error && 'neo-input--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="neo-input-wrapper">
      {label && (
        <label className="neo-input__label uppercase">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className="neo-input__error">{error}</span>
      )}
    </div>
  );
}

function TextArea({ 
  label,
  error,
  fullWidth = true,
  rows = 4,
  className = '',
  ...props 
}) {
  const textareaClasses = [
    'neo-input',
    'neo-textarea',
    fullWidth && 'neo-input--full',
    error && 'neo-input--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="neo-input-wrapper">
      {label && (
        <label className="neo-input__label uppercase">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <span className="neo-input__error">{error}</span>
      )}
    </div>
  );
}

function Select({ 
  label,
  error,
  children,
  fullWidth = false,
  className = '',
  ...props 
}) {
  const selectClasses = [
    'neo-input',
    'neo-select',
    fullWidth && 'neo-input--full',
    error && 'neo-input--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="neo-input-wrapper">
      {label && (
        <label className="neo-input__label uppercase">
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <span className="neo-input__error">{error}</span>
      )}
    </div>
  );
}

Input.TextArea = TextArea;
Input.Select = Select;

export default Input;
