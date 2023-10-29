import { log } from "@logtail/next"
import { render } from "@react-email/components"
import WaitListEmail from "@/app/components/landing/WaitListEmail"
import { enterWaitList } from "./actions"

jest.mock("@logtail/next", () => ({
  log: {
    error: jest.fn(),
  },
}))

const mockSend = jest.fn()
jest.mock("@plunk/node", () => {
  return jest.fn().mockImplementation(() => {
    return {
      emails: {
        send: (args: unknown) => mockSend(args),
      },
    }
  })
})

describe("enterWaitList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should send an email and return true when successful", async () => {
    mockSend.mockResolvedValue({ success: true })
    const result = await enterWaitList("test@example.com")
    expect(result).toBe(true)
    expect(mockSend).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "🚀 Welcome to nextUX!",
      subscribed: true,
      body: render(WaitListEmail()),
    })
    expect(log.error).not.toHaveBeenCalled()
  })

  it("should log an error and return false when sending email fails", async () => {
    mockSend.mockResolvedValue({ success: false })
    const result = await enterWaitList("test@example.com")
    expect(result).toBe(false)
    expect(log.error).toHaveBeenCalledWith("failed to send wait list email")
  })

  it("should log an error and return false when an error occurs", async () => {
    const error = new Error("Network error")
    mockSend.mockRejectedValue(error)
    const result = await enterWaitList("test@example.com")
    expect(result).toBe(false)
    expect(log.error).toHaveBeenCalledWith("error sending wait list email", { error })
  })
})
