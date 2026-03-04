"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle, Loader2 } from "lucide-react"

const INQUIRY_LABELS: Record<string, string> = {
  general: "General Inquiry",
  vendor: "Vendor Partnership",
  "bulk-order": "Bulk Order",
  "custom-solution": "Custom Solution",
  support: "Technical Support",
  complaint: "Complaint",
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [inquiryType, setInquiryType] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const label = INQUIRY_LABELS[inquiryType] || inquiryType
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          userEmail: email,
          userName: [firstName, lastName].filter(Boolean).join(" ") || undefined,
          company: company || undefined,
          phone: phone || undefined,
          itemType: "contact",
          itemName: label,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message")
      }
      setIsSubmitted(true)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setCompany("")
      setInquiryType("")
      setMessage("")
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="glass-effect border-2 border-success/20">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-success">Message Sent Successfully!</h3>
          <p className="text-muted-foreground">Thank you for contacting us. We'll get back to you within 24 hours.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-2 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
        <p className="text-muted-foreground">Fill out the form below and we'll respond as soon as possible.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Name *</label>
              <Input
                placeholder="John"
                required
                className="rounded-xl"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Last Name *</label>
              <Input
                placeholder="Doe"
                required
                className="rounded-xl"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Email Address *</label>
            <Input
              type="email"
              placeholder="john@company.com"
              required
              className="rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Phone Number</label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              className="rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Company Name</label>
            <Input
              placeholder="Your Company Ltd."
              className="rounded-xl"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Inquiry Type *</label>
            <Select required value={inquiryType} onValueChange={setInquiryType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="vendor">Vendor Partnership</SelectItem>
                <SelectItem value="bulk-order">Bulk Order</SelectItem>
                <SelectItem value="custom-solution">Custom Solution</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Message *</label>
            <Textarea
              placeholder="Tell us about your requirements or how we can help you..."
              required
              className="min-h-32 rounded-xl"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            variant="default"
            className="w-full rounded-xl hover-lift bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
