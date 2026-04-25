import React from 'react'
import ReactDOM from 'react-dom/client'

import { plugin as aiPlugin } from '@hawtio/ai-plugin'
import { configManager, hawtio, HawtioInitialization, Logger, TaskState } from '@hawtio/react/init'
import { plugin } from './sample-plugin'

// Hawtio itself creates and tracks initialization tasks, but we can add our own.
configManager.initItem('Loading UI', TaskState.started, 'config')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<HawtioInitialization verbose={configManager.globalLogLevel() < Logger.INFO.value} />)

// Set up plugin location
hawtio.addUrl('plugin')

import('@hawtio/react').then(async ({ Logger, hawtio, connect, rbac, jmx }) => {
  const log = Logger.get('hawtio-custom-console')
  log.info('Bootstrapping Hawtio Custom Console')

  // Register builtin plugins
  connect()
  rbac()
  jmx()

  // Example external plugin
  aiPlugin()

  // Register a custom plugin
  plugin()

  // hawtio.bootstrap() will wait for all init items to be ready, so we have to finish 'loading'
  // stage of UI. UI will be rendered after bootstrap() returned promise is resolved
  configManager.initItem('Loading UI', TaskState.finished, 'config')

  // Bootstrap Hawtio
  hawtio.bootstrap().then(() => {
    import('@hawtio/react/ui').then(({ Hawtio }) => {
      root.render(
        <React.StrictMode>
          <Hawtio />
        </React.StrictMode>,
      )
    })
  })
})
