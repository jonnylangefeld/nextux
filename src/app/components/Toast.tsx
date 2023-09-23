import React from "react"
import toast from "react-hot-toast"

type modifier = "success" | "warning" | "error" | "info"

interface Props {
  visible: boolean
  // a modifier from here: https://daisyui.com/components/alert/
  modifier?: modifier
  children: React.ReactNode
}

const modifierClasses: { [key: string]: string } = {
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
  info: "alert-info",
}

function Toast(props: Props) {
  return (
    <div
      className={`alert ${modifierClasses[props.modifier || ""] || ""} w-auto ${
        props.visible ? "animate-swipe-in" : "animate-dissolve-out"
      } shadow-lg`}
    >
      <span>{props.children}</span>
    </div>
  )
}

function customToast(msg: string[], modifier?: modifier) {
  toast.custom((t) => (
    <Toast visible={t.visible} modifier={modifier}>
      {msg.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </Toast>
  ))
}

/**
 * Show a success toast
 * @param msg a list of strings to display in the toast where each string is a paragraph
 */
export function success(msg: string[]) {
  customToast(msg, "success")
}

/**
 * Show a warning toast
 * @param msg a list of strings to display in the toast where each string is a paragraph
 */
export function warning(msg: string[]) {
  customToast(msg, "warning")
}

/**
 * Show an error toast
 * @param msg a list of strings to display in the toast where each string is a paragraph
 */
export function error(msg: string[]) {
  customToast(msg, "error")
}

/**
 * Show an info toast
 * @param msg a list of strings to display in the toast where each string is a paragraph
 */
export function info(msg: string[]) {
  customToast(msg, "info")
}
