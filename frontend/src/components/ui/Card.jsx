import './Card.css';

function Card({ 
  children, 
  variant = 'default',
  hover = false,
  rotate = false,
  className = '',
  ...props 
}) {
  const classes = [
    'neo-card',
    `neo-card--${variant}`,
    hover && 'neo-card--hover',
    rotate && 'neo-card--rotate',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`neo-card__header ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`neo-card__body ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`neo-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
