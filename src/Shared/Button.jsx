import React from "react";

function Button({
  children,
  label,
  href,
  onClick,
  className = "",
  fullWidth = false,
  size = "md",
  type = "button",
  ...rest
}) {
  const sizeMap = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-6 text-sm",
    lg: "py-3 px-8 text-base",
  };

  const base =
    "inline-flex items-center justify-center rounded-md font-semibold shadow-sm focus:outline-none";
  const gradient = "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white";
  const widthClass = fullWidth ? "w-full" : "inline-block";

  const classes =
    `${base} ${gradient} ${sizeMap[size] || sizeMap.md} ${widthClass} ${className}`.trim();

  const content = children || label;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  );
}

export default Button;
