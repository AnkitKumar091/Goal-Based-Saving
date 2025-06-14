"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Goal } from "@/app/page"

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGoal: (goal: Omit<Goal, "id" | "currentAmount" | "contributions" | "createdAt">) => void
}

export function AddGoalModal({ isOpen, onClose, onAddGoal }: AddGoalModalProps) {
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currency, setCurrency] = useState<"INR" | "USD">("INR")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Goal name is required"
    }

    if (!targetAmount.trim()) {
      newErrors.targetAmount = "Target amount is required"
    } else {
      const amount = Number.parseFloat(targetAmount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = "Target amount must be a positive number"
      } else if (amount > 10000000) {
        newErrors.targetAmount = "Target amount is too large"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onAddGoal({
      name: name.trim(),
      targetAmount: Number.parseFloat(targetAmount),
      currency,
    })

    // Reset form
    setName("")
    setTargetAmount("")
    setCurrency("INR")
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setName("")
    setTargetAmount("")
    setCurrency("INR")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, Trip to Japan"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Enter target amount"
              min="0"
              step="0.01"
              className={errors.targetAmount ? "border-red-500" : ""}
            />
            {errors.targetAmount && <p className="text-sm text-red-500">{errors.targetAmount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value: "INR" | "USD") => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
