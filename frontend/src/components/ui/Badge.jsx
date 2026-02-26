import './Badge.css';

function Badge({ 
  children, 
  variant = 'accent',
  size = 'md',
  rotate = false,
  pill = false,
  className = '',
  ...props 
}) {
  const classes = [
    'neo-badge',
    `neo-badge--${variant}`,
    `neo-badge--${size}`,
    rotate && 'neo-badge--rotate',
    pill && 'neo-badge--pill',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Badge;
