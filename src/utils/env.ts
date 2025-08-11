import { memoize } from 'lodash-es'
import { join } from 'path'
import { homedir } from 'os'
import { access } from 'fs/promises'
import { constants } from 'fs'
import { CONFIG_BASE_DIR, CONFIG_FILE } from '../constants/product'
// Base directory for all Claude Code data files (except config.json for backwards compatibility)
export const CLAUDE_BASE_DIR =
  process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), CONFIG_BASE_DIR)

// Config and data paths
export const GLOBAL_CLAUDE_FILE = process.env.CLAUDE_CONFIG_DIR
  ? join(CLAUDE_BASE_DIR, 'config.json')
  : join(homedir(), CONFIG_FILE)
export const MEMORY_DIR = join(CLAUDE_BASE_DIR, 'memory')

const getIsDocker = memoize(async (): Promise<boolean> => {
  try {
    await access('/.dockerenv', constants.F_OK)
    return process.platform === 'linux'
  } catch {
    return false
  }
})

const hasInternetAccess = memoize(async (): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1000)

    await fetch('http://1.1.1.1', {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeout)
    return true
  } catch {
    return false
  }
})

// all of these should be immutable
export const env = {
  getIsDocker,
  hasInternetAccess,
  isCI: Boolean(process.env.CI),
  platform:
    process.platform === 'win32'
      ? 'windows'
      : process.platform === 'darwin'
        ? 'macos'
        : 'linux',
  nodeVersion: process.version,
  terminal: process.env.TERM_PROGRAM,
}
