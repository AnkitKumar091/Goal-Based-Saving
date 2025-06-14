"use client"

import { TrendingUp, Target, Wallet, Award, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ExchangeRateStatus } from "@/components/exchange-rate-status"
import type { Goal, ExchangeRate } from "@/app/page"

interface EnhancedDashboardProps {
  goals: Goal[]
  exchangeRate: ExchangeRate
  onRefreshRate: () => void
  isRefreshing: boolean
  convertCurrency: (amount: number, from: "INR" | "USD", to: "INR" | "USD") => number
  formatCurrency: (amount: number, currency: "INR" | "USD") => string
}

export function EnhancedDashboard({
  goals,
  exchangeRate,
  onRefreshRate,
  isRefreshing,
  convertCurrency,
  formatCurrency,
}: EnhancedDashboardProps) {
  // Calculate metrics
  const totalTargetINR = goals.reduce((sum, goal) => {
    const targetInINR = convertCurrency(goal.targetAmount, goal.currency, "INR")
    return sum + targetInINR
  }, 0)

  const totalSavedINR = goals.reduce((sum, goal) => {
    const savedInINR = convertCurrency(goal.currentAmount, goal.currency, "INR")
    return sum + savedInINR
  }, 0)

  const overallProgress =
    goals.length > 0
      ? goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / goals.length
      : 0

  const completedGoals = goals.filter((goal) => (goal.currentAmount / goal.targetAmount) * 100 >= 100).length
  const activeGoals = goals.length - completedGoals
  const totalContributions = goals.reduce((sum, goal) => sum + goal.contributions.length, 0)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Exchange Rate Status - Mobile First */}
      <ExchangeRateStatus
        source={exchangeRate.source}
        lastUpdated={exchangeRate.lastUpdated}
        rate={exchangeRate.rate}
        onRefresh={onRefreshRate}
        isRefreshing={isRefreshing}
      />

      {/* Main Dashboard Card */}
      <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-0 shadow-xl">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">Financial Overview</CardTitle>
              <p className="text-blue-100 mt-1 text-sm md:text-base">Your savings at a glance</p>
              {/* Add exchange rate update time here */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs md:text-sm text-blue-200">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                  <span>USD/INR: ₹{exchangeRate.rate}</span>
                </div>
                <div className="text-xs text-blue-300">
                  • Updated: {new Date(exchangeRate.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs md:text-sm">
                {goals.length} Goals
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRefreshRate}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-8 md:h-9"
              >
                <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Key Metrics Grid - Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Target className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-blue-200" />
              <p className="text-xs md:text-sm text-blue-100">Total Target</p>
              <p className="text-sm md:text-xl font-bold truncate">{formatCurrency(totalTargetINR, "INR")}</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Wallet className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-green-200" />
              <p className="text-xs md:text-sm text-blue-100">Total Saved</p>
              <p className="text-sm md:text-xl font-bold truncate">{formatCurrency(totalSavedINR, "INR")}</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Award className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-yellow-200" />
              <p className="text-xs md:text-sm text-blue-100">Completed</p>
              <p className="text-sm md:text-xl font-bold">{completedGoals}</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-purple-200" />
              <p className="text-xs md:text-sm text-blue-100">Active Goals</p>
              <p className="text-sm md:text-xl font-bold">{activeGoals}</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-semibold">Overall Progress</span>
              <span className="text-xl md:text-2xl font-bold">{overallProgress.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={overallProgress}
                className="h-3 md:h-4 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full" />
            </div>
          </div>

          {/* Quick Stats - Responsive Layout */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/20">
            <div className="text-center">
              <p className="text-xs md:text-sm text-blue-100">Contributions</p>
              <p className="text-sm md:text-lg font-bold">{totalContributions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-blue-100">Avg per Goal</p>
              <p className="text-sm md:text-lg font-bold truncate">
                {goals.length > 0 ? formatCurrency(totalSavedINR / goals.length, "INR") : "₹0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm text-blue-100">Success Rate</p>
              <p className="text-sm md:text-lg font-bold">
                {goals.length > 0 ? ((completedGoals / goals.length) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
