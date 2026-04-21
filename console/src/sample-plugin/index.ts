import { HawtioPlugin } from '@hawtio/react'
import { appJmx } from './app-jmx'
import { customTree } from './custom-tree'
import { simple } from './simple'

export const plugin: HawtioPlugin = () => {
  simple()
  customTree()
  appJmx()
}
