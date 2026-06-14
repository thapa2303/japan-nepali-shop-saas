"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setName("")
      setEmail("")
      setMessage("")
      toast({
        title: "Message sent",
        description: "Thanks for reaching out. Our team will get back to you soon.",
      })
    }, 800)
  }

  return (
    <PageShell title="Contact Us" description="Have a question or feedback? Send us a message and we'll respond soon.">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">Shin-Okubo, Shinjuku, Tokyo, Japan</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+81-3-XXXX-XXXX</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">support@shopsaas.com</p>
            </div>
          </div>
        </div>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="sm:w-fit">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
