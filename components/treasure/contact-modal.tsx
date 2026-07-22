"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Send, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  initialPromptTitle?: string
}

export function ContactModal({
  isOpen,
  onClose,
  initialPromptTitle = "",
}: ContactModalProps) {
  const [requestType, setRequestType] = useState("Edit Request")
  const [promptTitle, setPromptTitle] = useState(initialPromptTitle)
  const [message, setMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  React.useEffect(() => {
    if (isOpen) {
      setPromptTitle(initialPromptTitle || "")
      setMessage("")
      setErrorMsg("")
    }
  }, [isOpen, initialPromptTitle])

  if (!isOpen) return null

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!message.trim()) {
      setErrorMsg("Please describe your problem or request.")
      return
    }

    const emailTo = "thangenbail@gmail.com"
    const subjectText = `[AwesomeLM ${requestType}] ${promptTitle ? `- ${promptTitle}` : ""}`
    
    let bodyText = `Hi Nabil,\n\n`
    bodyText += `Request Type: ${requestType}\n`
    if (promptTitle.trim()) {
      bodyText += `Prompt Title: ${promptTitle.trim()}\n`
    }
    bodyText += `\nProblem / Request Details:\n${message.trim()}\n\n`
    bodyText += `---\nSent from AwesomeLM`

    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`
    
    // Attempt mailto trigger
    window.location.href = mailtoUrl
    
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-950">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-300" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Contact Nabil</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSendEmail} className="p-5 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-2.5 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Request Type */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full h-9 text-xs bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-lg focus:border-neutral-700 px-2.5 outline-none"
              >
                <option value="Edit Request">Edit Existing Prompt</option>
                <option value="Removal Request">Remove Existing Prompt</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Other Query">Other Query</option>
              </select>
            </div>

            {/* Prompt Title */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Prompt Title (Optional)
              </label>
              <Input
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="e.g. Neon Cyberpunk"
                className="h-9 text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700"
              />
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Describe Your Issue / Request *
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your issue, requested changes, or reason for removal..."
                rows={4}
                required
                className="min-h-[90px] text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700 resize-none p-2.5"
              />
            </div>

            {/* Info Hint */}
            <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/80 rounded-lg flex items-start gap-2 text-neutral-400 text-[11px] leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
              <span>Submitting will open your device's default mail app or Gmail composer addressed to <strong>thangenbail@gmail.com</strong>.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-8 px-3 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 px-4 text-xs bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                Open Email App
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
