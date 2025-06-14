"use client"

import { Sparkles, TrendingUp, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ResponsiveHeaderProps {
  totalGoals: number
  completedGoals: number
  exchangeRate: {
    rate: number
    lastUpdated: string
    source: "api" | "cache" | "mock"
  }
}

export function ResponsiveHeader({ totalGoals, completedGoals, exchangeRate }: ResponsiveHeaderProps) {
  return (
    <div className="text-center space-y-4 py-6 md:py-12">
      {/* Mobile Header */}
      <div className="block md:hidden">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Savings Planner
          </h1>
        </div>
        <p className="text-sm text-gray-600 px-4">Track your financial goals and build your future</p>
        {totalGoals > 0 && (
          <div className="flex justify-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {totalGoals} Goals
            </Badge>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {completedGoals} Done
            </Badge>
          </div>
        )}
        {/* Add exchange rate info */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          USD/INR: ₹{exchangeRate.rate} • {new Date(exchangeRate.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Goal-Based Savings Planner
          </h1>
          <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
        </div>
        <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Transform your financial dreams into achievable goals. Track progress, celebrate milestones, and build your
          future one contribution at a time.
        </p>
        {totalGoals > 0 && (
          <div className="flex justify-center gap-3 mt-6">
            <Badge variant="outline" className="text-sm">
              <Target className="h-4 w-4 mr-2" />
              {totalGoals} Active Goals
            </Badge>
            <Badge variant="outline" className="text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              {completedGoals} Completed
            </Badge>
          </div>
        )}
        {/* Add exchange rate info */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <span className="font-medium">USD/INR: ₹{exchangeRate.rate}</span>
          <span className="mx-2">•</span>
          <span>Last updated: {new Date(exchangeRate.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
