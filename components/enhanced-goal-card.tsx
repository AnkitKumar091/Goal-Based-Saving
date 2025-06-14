"use client"

import { useState } from "react"
import { Plus, TrendingUp, Calendar, Target, DollarSign, Trash2, Award } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Goal } from "@/app/page"

interface EnhancedGoalCardProps {
  goal: Goal
  onAddContribution: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
  convertCurrency: (amount: number, from: "INR" | "USD", to: "INR" | "USD") => number
  formatCurrency: (amount: number, currency: "INR" | "USD") => string
}

export function EnhancedGoalCard({
  goal,
  onAddContribution,
  onDeleteGoal,
  convertCurrency,
  formatCurrency,
}: EnhancedGoalCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remainingAmount = goal.targetAmount - goal.currentAmount
  const targetConverted = convertCurrency(goal.targetAmount, goal.currency, goal.currency === "INR" ? "USD" : "INR")
  const currentConverted = convertCurrency(goal.currentAmount, goal.currency, goal.currency === "INR" ? "USD" : "INR")
  const remainingConverted = convertCurrency(remainingAmount, goal.currency, goal.currency === "INR" ? "USD" : "INR")

  const isCompleted = progress >= 100
  const daysCreated = Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isCompleted
          ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
          : "bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completion Celebration Effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse" />
      )}

      {/* Header */}
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base md:text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {goal.name}
              </h3>
              {isCompleted && (
                <Badge className="bg-green-500 text-white animate-bounce text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Done!
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs ${goal.currency === "INR" ? "border-orange-300 text-orange-700" : "border-green-300 text-green-700"}`}
              >
                {goal.currency}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {daysCreated}d
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex gap-1 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 md:opacity-0"} sm:opacity-100`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteGoal(goal.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className={`text-lg font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
              {Math.min(progress, 100).toFixed(1)}%
            </span>
          </div>

          <div className="relative">
            <Progress
              value={Math.min(progress, 100)}
              className={`h-2 md:h-3 transition-all duration-500 ${
                isCompleted
                  ? "[&>div]:bg-green-500"
                  : "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
              }`}
            />
            {progress > 100 && (
              <div className="absolute top-0 left-0 h-2 md:h-3 w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse opacity-75" />
            )}
          </div>
        </div>

        <Separator />

        {/* Financial Details - Responsive */}
        <div className="space-y-3 md:space-y-4">
          {/* Target Amount */}
          <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-800">Target</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-900 text-sm md:text-base">
                {formatCurrency(goal.targetAmount, goal.currency)}
              </div>
              <div className="text-xs text-blue-600">
                {formatCurrency(targetConverted, goal.currency === "INR" ? "USD" : "INR")}
              </div>
            </div>
          </div>

          {/* Current Amount */}
          <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs md:text-sm font-medium text-green-800">Saved</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-900 text-sm md:text-base">
                {formatCurrency(goal.currentAmount, goal.currency)}
              </div>
              <div className="text-xs text-green-600">
                {formatCurrency(currentConverted, goal.currency === "INR" ? "USD" : "INR")}
              </div>
            </div>
          </div>

          {/* Remaining Amount */}
          {!isCompleted && (
            <div className="flex items-center justify-between p-2 md:p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-xs md:text-sm font-medium text-orange-800">Remaining</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-900 text-sm md:text-base">
                  {formatCurrency(remainingAmount, goal.currency)}
                </div>
                <div className="text-xs text-orange-600">
                  {formatCurrency(remainingConverted, goal.currency === "INR" ? "USD" : "INR")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contributions Summary */}
        {goal.contributions.length > 0 && (
          <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-gray-600">Contributions</span>
              <span className="font-semibold">{goal.contributions.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm mt-1">
              <span className="text-gray-600">Last Added</span>
              <span className="font-semibold">
                {new Date(goal.contributions[goal.contributions.length - 1]?.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => onAddContribution(goal)}
          className={`w-full transition-all duration-200 text-sm md:text-base ${
            isCompleted
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          }`}
          disabled={isCompleted}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCompleted ? "Goal Completed! 🎉" : "Add Contribution"}
        </Button>
      </CardContent>
    </Card>
  )
}
