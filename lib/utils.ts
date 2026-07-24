import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://awesomelm.vercel.app'
  return url.replace(/\/+$/, '')
}

// Landing project types for server actions
export type ActionSuccessResult<T> = {
  success: true
  data: T
  id: string
}

export type ActionErrorResult = {
  success: false
  message: string
  id: string
}

export type ActionResult<T> = ActionSuccessResult<T> | ActionErrorResult

export const success = <T,>(data: T): ActionSuccessResult<T> => {
  return { success: true, data, id: crypto.randomUUID() }
}

export const error = (message: string): ActionErrorResult => {
  return { success: false, message, id: crypto.randomUUID() }
}
