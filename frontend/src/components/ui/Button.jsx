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
  as: Component = 'button',
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
    <Component
      type={Component === 'button' ? type : undefined}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
