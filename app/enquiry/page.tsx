"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Item {
  _id: string
  name: string
  price?: number
  description?: string
  category?: string
}

const truncateDescription = (description: string, wordLimit = 12) => {
  const words = description.trim().split(/\s+/)
  if (words.length <= wordLimit) {
    return description
  }
  return `${words.slice(0, wordLimit).join(" ")}…`
}

export default function EnquiryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id") || ""
  const itemType = (searchParams.get("itemType") || "service") as "service" | "product"

  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContactMethod: "email",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const u = JSON.parse(user)
        setForm((f) => ({ ...f, name: u.name || "", email: u.email || "", phone: u.phone || "" }))
      } catch {}
    }
  }, [])

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return
      try {
        const res = await fetch(`/api/${itemType === "service" ? "services" : "products"}/${id}`)
        if (res.ok) {
          const result = await res.json()
          if (result?.success && result?.data) {
            setItem(result.data)
            setForm((f) => ({
              ...f,
              message:
                f.message ||
                `Hi! I'm interested in your "${result.data.name}" ${itemType}. Please provide more details and pricing information.`,
            }))
          }
        }
      } catch (e) {
        console.error("Error fetching item:", e)
      }
    }
    fetchItem()
  }, [id, itemType])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    try {
      const payload = {
        userId: "guest",
        userEmail: form.email,
        itemId: id,
        itemType,
        itemName: item?.name || "",
        message: form.message,
        phone: form.phone,
        preferredContactMethod: form.preferredContactMethod,
        status: "pending",
      }
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result?.success) throw new Error(result?.error || "Failed to submit")
      alert("Enquiry submitted successfully! We'll contact you soon.")
      // Navigate back to the previous page if possible
      try {
        router.back()
      } catch {
        router.push("/")
      }
    } catch (err: any) {
      alert(err?.message || "Error submitting enquiry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Header />

      {/* Translucent backdrop covering the whole page */}
      <div className="fixed inset-0 bg-black/40 z-40"></div>

      {/* Centered form container */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900 text-center">Place Enquiry</h1>
        <p className="text-center text-gray-600 mb-6">
          {item ? (
            <>
              You are enquiring about <span className="font-semibold">{item.name}</span> {itemType}
            </>
          ) : (
            <>Provide your contact details and message</>
          )}
        </p>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Left column - Item details (read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Type</label>
              <Input value={itemType} readOnly className="bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <Input value={item?.name || ""} readOnly className="bg-white" />
            </div>
            {typeof item?.price === "number" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <Input value={`₹${item.price.toLocaleString()}`} readOnly className="bg-white" />
              </div>
            )}
            {item?.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea value={truncateDescription(item.description)} readOnly className="bg-white" rows={4} />
              </div>
            )}
          </div>

          {/* Right column - Your details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
              <Select value={form.preferredContactMethod} onValueChange={(v) => setForm({ ...form, preferredContactMethod: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
