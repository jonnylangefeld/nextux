import inspector from "inspector"

if (inspector.url()) {
  jest.setTimeout(60 * 60 * 1000)
}
