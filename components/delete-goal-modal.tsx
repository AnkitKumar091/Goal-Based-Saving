"use client"

import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Goal } from "@/app/page"

interface DeleteGoalModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onDeleteGoal: (goalId: string) => void
}

export function DeleteGoalModal({ isOpen, onClose, goal, onDeleteGoal }: DeleteGoalModalProps) {
  if (!goal) return null

  const handleDelete = () => {
    onDeleteGoal(goal.id)
    onClose()
  }

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const currencySymbol = goal.currency === "INR" ? "₹" : "$"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Goal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">{goal.name}</h3>
            <div className="space-y-1 text-sm text-red-700">
              <div className="flex justify-between">
                <span>Target:</span>
                <span>
                  {currencySymbol}
                  {goal.targetAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Saved:</span>
                <span>
                  {currencySymbol}
                  {goal.currentAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Contributions:</span>
                <span>{goal.contributions.length}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. All contribution history will be permanently
              deleted.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              Delete Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
