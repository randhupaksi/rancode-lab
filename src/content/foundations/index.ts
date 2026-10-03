import { thinking, web } from './thinking'
import { html, css } from './markup'
import { javascript, browser } from './javascript'

const foundations = [thinking, web, html, css, javascript, browser]
export const foundationCourses = foundations.map(entry => entry.course)
export const foundationModules = foundations.map(entry => entry.module)
export const foundationLessons = foundations.flatMap(entry => entry.lessons)
export const foundationConcepts = foundations.flatMap(entry => entry.concepts)
