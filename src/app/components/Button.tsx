import React from "react"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  gradient?: boolean
  className?: string
}

export default function Button({ children, gradient, className, ...rest }: Props) {
  return (
    <button
      className={`
        text-white
        ${
          gradient
            ? `
          bg-gradient-to-br
          from-primary-500
          from-40%
          to-secondary-500
          hover:from-primary-300
          hover:to-primary-300
          dark:from-primary-900
          dark:from-10%
          dark:to-secondary-900
          dark:hover:from-primary-500
          dark:hover:to-secondary-500
        `
            : `
          bg-primary-500
          hover:bg-primary-300
          dark:bg-primary-900
          dark:hover:bg-primary-500
        `
        }
        whitespace-nowrap
        rounded-md
        px-3.5
        py-2.5
        text-sm
        font-semibold
        shadow-sm
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary-600
        ${className || ""}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}
