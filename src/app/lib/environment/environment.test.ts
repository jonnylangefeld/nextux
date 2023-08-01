import { requireEnvVariable } from "./environment"

describe("requireEnvVariable", () => {
  it("should return the environment variable value if it exists", () => {
    process.env.MY_VARIABLE = "my value"

    const result = requireEnvVariable("MY_VARIABLE")

    expect(result).toBe("my value")
  })

  it("should throw an error and exit if the environment variable is missing", () => {
    const originalConsoleError = console.error
    console.error = jest.fn() // Mock console.error

    const exitMock = jest.spyOn(process, "exit").mockImplementationOnce((code?: number) => {
      throw new Error(`Process exited with code ${code}`)
    })

    expect(() => requireEnvVariable("MISSING_VARIABLE")).toThrowError("Process exited with code 1")

    expect(console.error).toHaveBeenCalledWith("Missing required environment variable: MISSING_VARIABLE")
    expect(exitMock).toHaveBeenCalledWith(1)

    // Restore console.error
    console.error = originalConsoleError
    // Restore process.exit
    exitMock.mockRestore()
  })
})
