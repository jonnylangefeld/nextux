import React, { ChangeEvent, FormEvent, useState } from "react"
import * as Toast from "@/app/components/Toast"
import { enterWaitList } from "@/app/lib/actions/actions"
import Button from "../Button"

export default function WaitList() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const waitListModal = React.useRef<HTMLDialogElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const enterWaitListResponse = enterWaitList(email)
    setLoading(true)
    enterWaitListResponse
      .catch((error) => {
        Toast.error([error.message])
      })
      .then((result) => {
        waitListModal.current?.close()
        setLoading(false)
        if (result) {
          Toast.success(["Thanks for signing up! 🚀", "We'll let you know when we have updates"])
        } else {
          Toast.error(["Something went wrong. Please try again."])
        }
      })
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  return (
    <>
      <Button
        gradient
        className="btn"
        onClick={() => {
          waitListModal.current?.showModal()
        }}
      >
        Join the waitlist! 🚀
      </Button>
      <dialog ref={waitListModal} className="modal z-20">
        <div className="modal-box min-w-min">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Waitlist</h3>
            <p>Sign up with your email so we can send you updates!</p>
          </div>
          <form method="post" className="flex flex-col gap-y-2 pt-4 sm:join sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input-bordered input join-item"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <button className="join-item btn min-w-[120px]">
              {loading ? <span className="loading loading-dots loading-md" /> : "Join"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-opacity-10 bg-clip-padding backdrop-blur-md backdrop-filter">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
