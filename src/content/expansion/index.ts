import { logicExpansion, webExpansion } from './orientation'
import { htmlExpansion } from './html'
import { cssExpansion } from './css'
import { javascriptExpansion } from './javascript'
import { browserExpansion } from './browser'
import { reactExpansion } from './react'
import { typescriptExpansion } from './typescript'
import { nextjsExpansion } from './nextjs'

const expansions = [logicExpansion, webExpansion, htmlExpansion, cssExpansion, javascriptExpansion, browserExpansion, reactExpansion, typescriptExpansion, nextjsExpansion]
export const expansionModules = expansions.flatMap(course => course.modules)
export const expansionLessons = expansions.flatMap(course => course.lessons)
export const expansionConcepts = expansions.flatMap(course => course.concepts)
