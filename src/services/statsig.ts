import React from 'react'
import { memoize } from 'lodash-es'
import chalk from 'chalk'
import {
  StatsigClient,
  StatsigOptions,
  StatsigEvent,
  LogLevel,
} from '@statsig/js-client'
import './browserMocks.js' // Initialize browser mocks
import { FileSystemStorageProvider } from './statsigStorage'
import { STATSIG_CLIENT_KEY } from '../constants/keys'
import { env } from '../utils/env'
import { logError } from '../utils/log'
import { SESSION_ID } from '../utils/log'
import { MACRO } from '../constants/macros'
import {
  GATE_TOKEN_EFFICIENT_TOOLS,
  BETA_HEADER_TOKEN_EFFICIENT_TOOLS,
  CLAUDE_CODE_20250219_BETA_HEADER,
} from '../constants/betas'
const gateValues: Record<string, boolean> = {}
let client: StatsigClient | null = null

const getBetas = memoize(async (): Promise<string[]> => {
  const betaHeaders = [CLAUDE_CODE_20250219_BETA_HEADER]

  if (process.env.USER_TYPE === 'ant' || process.env.SWE_BENCH) {
    const useTokenEfficientTools = await checkGate(GATE_TOKEN_EFFICIENT_TOOLS)
    if (useTokenEfficientTools) {
      betaHeaders.push(BETA_HEADER_TOKEN_EFFICIENT_TOOLS)
    }
  }

  return betaHeaders
})

export const initializeStatsig = memoize(
  async (): Promise<StatsigClient | null> => {
    if (env.isCI || process.env.NODE_ENV === 'test') {
      return null
    }

    const { getUser } = await import('../utils/' + 'user')
    const user = await getUser()
    const options: StatsigOptions = {
      networkConfig: {
        api: 'https://statsig.anthropic.com/v1/',
      },
      environment: {
        tier:
          env.isCI ||
          ['test', 'development'].includes(process.env.NODE_ENV ?? '')
            ? 'dev'
            : 'production',
      },
      logLevel: LogLevel.None,
      storageProvider: new FileSystemStorageProvider(),
    }

    client = new StatsigClient(STATSIG_CLIENT_KEY, user, options)
    client.on('error', errorEvent => {
      logError(`Statsig error: ${errorEvent}`)
    })
    await client.initializeAsync()
    process.on('exit', () => {
      client?.flush()
    })
    return client
  },
)

export function logEvent(
  eventName: string,
  metadata: { [key: string]: string | undefined },
): void {
  // console.log('logEvent', eventName, metadata)
  if (env.isCI || process.env.NODE_ENV === 'test') {
    return
  }
  Promise.all([initializeStatsig(), getBetas()]).then(
    ([statsigClient, betas]) => {
      if (!statsigClient) return

      const eventMetadata: Record<string, string> = {
        ...metadata,
        model: metadata.model ?? 'unknown',
        sessionId: SESSION_ID,
        userType: process.env.USER_TYPE || '',
        ...(process.env.SWE_BENCH_RUN_ID
          ? { sweBenchId: process.env.SWE_BENCH_RUN_ID }
          : {}),
        ...(betas.length > 0 ? { betas: betas.join(',') } : {}),
        env: JSON.stringify({
          platform: env.platform,
          nodeVersion: env.nodeVersion,
          terminal: env.terminal,
          version: MACRO.VERSION,
        }),
      }

      // Debug logging when debug mode is enabled
      if (process.argv.includes('--debug') || process.argv.includes('-d')) {
        console.log(
          chalk.dim(
            `[DEBUG-ONLY] Statsig event: ${eventName} ${JSON.stringify(metadata, null, 0)}`,
          ),
        )
      }

      const event: StatsigEvent = {
        eventName,
        metadata: eventMetadata,
      }
      // statsigClient.logEvent(event)
    },
  )
}

export const checkGate = memoize(async (gateName: string): Promise<boolean> => {
  return true
  // if (env.isCI || process.env.NODE_ENV === 'test') {
  //   return false
  // }
  // const statsigClient = await initializeStatsig()
  // if (!statsigClient) return false

  // const value = statsigClient.checkGate(gateName)
  // gateValues[gateName] = value
  // return value
})

export const useStatsigGate = (gateName: string, defaultValue = false) => {
  return true
  // const [gateValue, setGateValue] = React.useState(defaultValue)
  // React.useEffect(() => {
  //   checkGate(gateName).then(setGateValue)
  // }, [gateName])
  // return gateValue
}

export function getGateValues(): Record<string, boolean> {
  return { ...gateValues }
}

export const getExperimentValue = memoize(
  async <T>(experimentName: string, defaultValue: T): Promise<T> => {
    return defaultValue
    // if (env.isCI || process.env.NODE_ENV === 'test') {
    //   return defaultValue
    // }
    // const statsigClient = await initializeStatsig()
    // if (!statsigClient) return defaultValue

    // const experiment = statsigClient.getExperiment(experimentName)
    // if (Object.keys(experiment.value).length === 0) {
    //   logError(`getExperimentValue got empty value for ${experimentName}`)
    //   return defaultValue
    // }
    // return experiment.value as T
  },
)

// NB Not memoized like other methods, to allow for dynamic config changes
export const getDynamicConfig = async <T>(
  configName: string,
  defaultValue: T,
): Promise<T> => {
  return defaultValue
  // if (env.isCI || process.env.NODE_ENV === 'test') {
  //   return defaultValue
  // }
  // const statsigClient = await initializeStatsig()
  // if (!statsigClient) return defaultValue

  // const config = statsigClient.getDynamicConfig(configName)
  // if (Object.keys(config.value).length === 0) {
  //   logError(`getDynamicConfig got empty value for ${configName}`)
  //   return defaultValue
  // }
  // return config.value as T
}
