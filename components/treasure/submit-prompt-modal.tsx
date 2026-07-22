"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Plus, Trash2, Link as LinkIcon, User, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ContactModal } from "@/components/treasure/contact-modal"

interface SubmitPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const MAX_PROMPT_CHARS = 4990

export function SubmitPromptModal({
  isOpen,
  onClose,
  onSuccess,
}: SubmitPromptModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [promptText, setPromptText] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorLink, setAuthorLink] = useState("")
  const [imageInputs, setImageInputs] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isContactOpen, setIsContactOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setPromptText("")
      setAuthorName("")
      setAuthorLink("")
      setImageInputs([""])
      setErrorMsg("")
    }
  }, [isOpen])

  if (!isOpen) return null

  const isValidUrl = (url: string): boolean => {
    const trimmed = url.trim()
    if (!trimmed) return true
    if (trimmed.includes(" ") || trimmed.includes(",")) return false
    try {
      const parsed = new URL(trimmed)
      return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must be under 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        const updated = [...imageInputs]
        updated[index] = base64
        setImageInputs(updated)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageInputs]
    updated[index] = val
    setImageInputs(updated)
  }

  const addImageInput = () => {
    if (imageInputs.length < 4) {
      setImageInputs([...imageInputs, ""])
    }
  }

  const removeImageInput = (index: number) => {
    if (imageInputs.length > 1) {
      setImageInputs(imageInputs.filter((_, i) => i !== index))
    } else {
      setImageInputs([""])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!title.trim() || !description.trim() || !promptText.trim()) {
      setErrorMsg("Title, description, and prompt text are required.")
      return
    }

    if (promptText.length > MAX_PROMPT_CHARS) {
      setErrorMsg(`NotebookLM slides prompt max char limit is 5000 characters. Please reduce prompt length below ${MAX_PROMPT_CHARS} characters.`)
      return
    }

    if (authorLink.trim() && !isValidUrl(authorLink)) {
      setErrorMsg("Please enter 1 valid profile URL starting with http:// or https:// (e.g. https://github.com/username)")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        prompt: promptText.trim(),
        author_name: authorName.trim() || "Anonymous",
        author_link: authorLink.trim(),
        images: imageInputs.filter((url) => url.trim().length > 0),
      }

      const res = await fetch("/api/treasures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save prompt.")
      }

      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPromptExceeded = promptText.length > MAX_PROMPT_CHARS
  const isLinkInvalid = authorLink.trim().length > 0 && !isValidUrl(authorLink)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Minimal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Submit Prompt</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {errorMsg && (
              <div className="p-2.5 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Title & Author Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Cyberpunk"
                  required
                  className="h-9 text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-neutral-500" /> Author Name
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex (or Anonymous)"
                  className="h-9 text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700"
                />
              </div>
            </div>

            {/* Author Profile Link */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-medium text-neutral-400 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-neutral-500" /> Author Profile Link (1 Link Max)
                </label>
                {isLinkInvalid && (
                  <span className="text-[10px] text-red-400">Invalid URL format</span>
                )}
              </div>
              <Input
                value={authorLink}
                onChange={(e) => setAuthorLink(e.target.value)}
                placeholder="https://github.com/username (1 link only)"
                type="url"
                className={`h-9 text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700 ${
                  isLinkInvalid ? "border-red-800 text-red-300" : ""
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Description *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of style, layout, or use-case..."
                rows={2}
                required
                className="min-h-[50px] text-xs bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700 resize-none p-2.5"
              />
            </div>

            {/* Full Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-medium text-neutral-400">
                  Prompt Text *
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    isPromptExceeded ? "text-red-400 font-bold" : "text-neutral-500"
                  }`}
                >
                  {promptText.length} / {MAX_PROMPT_CHARS} chars
                </span>
              </div>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Paste the complete AI prompt here..."
                rows={4}
                required
                className={`min-h-[80px] text-xs font-mono bg-neutral-900/90 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700 resize-none p-2.5 ${
                  isPromptExceeded ? "border-red-800 text-red-300 focus:border-red-700" : ""
                }`}
              />
              {isPromptExceeded && (
                <p className="mt-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  NotebookLM slides prompt max char limit is 5000 characters. Please trim your prompt.
                </p>
              )}
            </div>

            {/* Images (Max 4) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-neutral-400">
                  Images (Max 4)
                </label>
                {imageInputs.length < 4 && (
                  <button
                    type="button"
                    onClick={addImageInput}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Slot
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {imageInputs.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`Image #${idx + 1} URL or upload file`}
                      value={val.startsWith("data:") ? "[File Uploaded]" : val}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      className="h-8 text-xs bg-neutral-900/90 border-neutral-800 text-neutral-200 placeholder:text-neutral-600 rounded-lg font-mono flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-neutral-700"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1 h-8 px-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors whitespace-nowrap">
                      <Upload className="w-3 h-3 text-neutral-400" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(idx, e)}
                      />
                    </label>
                    {imageInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageInput(idx)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {val && (
                      <div className="w-8 h-8 rounded border border-neutral-800 overflow-hidden bg-black flex-shrink-0">
                        <img src={val} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Notice */}
            <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/80 rounded-lg flex items-center gap-2 text-neutral-400 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              <span>
                Submissions are final. To edit/remove later, contact{" "}
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="font-semibold text-white underline hover:text-neutral-300 transition-colors"
                >
                  Nabil
                </button>
                .
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 px-3 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isPromptExceeded || isLinkInvalid}
                className="h-8 px-4 text-xs bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Prompt"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialPromptTitle={title}
      />
    </AnimatePresence>
  )
}
