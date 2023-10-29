"use server"

import { log } from "@logtail/next"
import Plunk from "@plunk/node"
import { render } from "@react-email/render"
import WaitListEmail from "../../components/landing/WaitListEmail"
import { env } from "../environment/environment"

const plunk = new Plunk(env.PLUNK_TOKEN)
const body = render(WaitListEmail())

/**
 * Enter a user into the wait list
 * @param email The email address of the user
 * @returns Whether the user was successfully entered into the wait list
 */
export async function enterWaitList(email: string): Promise<boolean> {
  try {
    const { success } = await plunk.emails.send({
      to: email,
      subject: "🚀 Welcome to nextUX!",
      subscribed: true,
      body,
    })
    if (!success) {
      log.error("failed to send wait list email")
    }
    return success
  } catch (error) {
    log.error("error sending wait list email", { error })
    return false
  }
}
