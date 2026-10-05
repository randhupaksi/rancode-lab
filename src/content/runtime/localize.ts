import type { Challenge, Concept, Course, CourseModule, Lesson } from '../types'
import type { JourneyStage } from '../journey'
import { localizedStage } from './catalog'
// The route boundary selects an already localized build artifact. Canonical scoring/code fields are preserved at generation time.
export function localizeCourse(value: Course, _locale: 'en' | 'id') { return value }
export function localizeModule(value: CourseModule, _locale: 'en' | 'id') { return value }
export function localizeLesson<T extends Pick<Lesson, 'id'>>(value: T, _locale: 'en' | 'id') { return value }
export function localizeConcept(value: Concept, _lesson: Pick<Lesson, 'id'>, _locale: 'en' | 'id') { return value }
export function localizeChallenge(value: Challenge, _lesson: Pick<Lesson, 'id'>, _locale: 'en' | 'id') { return value }
export function localizeJourneyStage(value: JourneyStage, locale: 'en' | 'id') { return locale === 'id' ? localizedStage(value) : value }
