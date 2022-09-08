import PropTypes from "prop-types";

const IconButton = ({
  color = "primary",
  variant = "minimal",
  children,
  disabled,
  className,
  ...rest
}) => {
  const colorsIconButton = {
    primary: "border-primary bg-primary bg-opacity-0 hover:bg-opacity-[0.05]",
    bnw: "bg-white border-gray-600", // black and white
  };

  const variants = {
    contained: "border-2 bg-white",
    outlined: "border-2 border-gray-600",
    minimal: "shadow hover:shadow-lg",
  };

  return (
    <button
      type="button"
      className={`rounded-full p-2 flex items-center justify-center hover:opacity-80 active:scale-105 transition-all duration-150 ${variants[variant]}  ${colorsIconButton[color]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  color: PropTypes.oneOf(["primary", "bnw"]),
  variant: PropTypes.oneOf(["outlined", "contained", "minimal"]),
  disabled: PropTypes.bool,

  // not implemented for now
  loading: PropTypes.bool,
  raised: PropTypes.bool,
};

export default IconButton;
