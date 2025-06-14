"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Goal } from "@/app/page"

interface AddContributionModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onAddContribution: (goalId: string, amount: number, date: string) => void
}

export function AddContributionModal({ isOpen, onClose, goal, onAddContribution }: AddContributionModalProps) {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!amount.trim()) {
      newErrors.amount = "Amount is required"
    } else {
      const contributionAmount = Number.parseFloat(amount)
      if (isNaN(contributionAmount) || contributionAmount <= 0) {
        newErrors.amount = "Amount must be a positive number"
      } else if (contributionAmount > 1000000) {
        newErrors.amount = "Amount is too large"
      }
    }

    if (!date) {
      newErrors.date = "Date is required"
    } else {
      const selectedDate = new Date(date)
      const today = new Date()
      if (selectedDate > today) {
        newErrors.date = "Date cannot be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!goal || !validateForm()) {
      return
    }

    onAddContribution(goal.id, Number.parseFloat(amount), date)

    // Reset form
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setErrors({})
    onClose()
  }

  if (!goal) return null

  const remainingAmount = goal.targetAmount - goal.currentAmount
  const currencySymbol = goal.currency === "INR" ? "₹" : "$"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contribution to {goal.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target:</span>
              <span className="font-semibold">
                {currencySymbol}
                {goal.targetAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current:</span>
              <span className="font-semibold text-green-600">
                {currencySymbol}
                {goal.currentAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining:</span>
              <span className="font-semibold text-blue-600">
                {currencySymbol}
                {remainingAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Contribution Amount ({goal.currency})</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${goal.currency}`}
                min="0"
                step="0.01"
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Contribution
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
