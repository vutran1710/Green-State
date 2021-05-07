import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { __version__ } from '../src'


const TestApp: React.FC<any> = ({ children }) => {
  const [showMessage, setShowMessage] = React.useState(false)
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
	id="toggle"
	type="checkbox"
	onChange={e => setShowMessage(e.target.checked)}
	checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  )
}

test('version check', () => {
  expect(__version__).toEqual('0.1.0')
})

test('test react-test setup', () => {
  const testMessage = 'Test Message'
  render((
    <TestApp>
      {testMessage}
    </TestApp>
  ))
  expect(screen.queryByText(testMessage)).toBeNull()
  fireEvent.click(screen.getByLabelText(/show/i))
  expect(screen.getByText(testMessage)).not.toBeNull()
})
