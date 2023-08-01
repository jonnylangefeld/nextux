import { apiError } from './errors'

describe('apiError', () => {
  it('returns a response with the provided error message and status code', async () => {
    const error = 'Test error'
    const status = 404
    const response = apiError(error, status)

    expect(response.status).toBe(status)
    expect(await response.json()).toEqual({ error })
  })

  it('returns a response with a default status code of 400 if none is provided', async () => {
    const error = 'Test error'
    const response = apiError(error)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error })
  })

  it('returns a response with a default status code of 400 and some details', async () => {
    const error = 'Test error'
    const details = { foo: 'bar' }
    const response = apiError(error, undefined, details)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error, details })
  })

  it('returns a response with a custom status code and string details', async () => {
    const error = 'Test error'
    const details = 'foobar'
    const response = apiError(error, 405, details)

    expect(response.status).toBe(405)
    expect(await response.json()).toEqual({ error, details })
  })
})
