import { memoize } from 'lodash-es'
import { env } from './env'
import { type StatsigUser } from '@statsig/js-client'
import { SESSION_ID } from './log'
import { MACRO } from '../constants/macros'

export const getUser = memoize(async (): Promise<StatsigUser> => {
  const { getGlobalConfig, getOrCreateUserID } = await import('./config')
  const userID = getOrCreateUserID()
  const config = getGlobalConfig()
  const email = undefined
  return {
    customIDs: {
      // for session level tests
      sessionId: SESSION_ID,
    },
    userID,
    appVersion: MACRO.VERSION,
    userAgent: env.platform,
    email,
    custom: {
      nodeVersion: env.nodeVersion,
      userType: process.env.USER_TYPE,
      organizationUuid: config.oauthAccount?.organizationUuid,
      accountUuid: config.oauthAccount?.accountUuid,
    },
  }
})
