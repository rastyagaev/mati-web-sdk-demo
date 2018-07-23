import React from 'react'

const { Provider, Consumer } = React.createContext()

export { Provider }

export function withMatiSettings(Component) {
  return function MatiComponent(props) {
    return (
      <Consumer>
        {settings => <Component {...props} matiSettings={settings} />}
      </Consumer>
    )
  }
}
