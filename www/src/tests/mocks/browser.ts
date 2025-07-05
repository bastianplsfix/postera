import { setupWorker } from "msw/browser"
import { handlers } from "./handlers/mod.ts"

export const worker = setupWorker(...handlers)
