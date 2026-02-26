import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const classes = [
    'neo-button',
    `neo-button--${variant}`,
    `neo-button--${size}`,
    fullWidth && 'neo-button--full',
    disabled && 'neo-button--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
