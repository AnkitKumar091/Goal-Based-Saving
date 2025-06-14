"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddGoalModal } from "@/components/add-goal-modal"
import { AddContributionModal } from "@/components/add-contribution-modal"
import { DeleteGoalModal } from "@/components/delete-goal-modal"
import { EnhancedGoalCard } from "@/components/enhanced-goal-card"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { ResponsiveHeader } from "@/components/responsive-header"
import { useToast } from "@/hooks/use-toast"
import { exchangeRateService, type ExchangeRateResponse } from "@/lib/exchange-rate-service"
import { ApiStatusDebug } from "@/components/api-status-debug"

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currency: "INR" | "USD"
  currentAmount: number
  contributions: Contribution[]
  createdAt: string
}

export interface Contribution {
  id: string
  amount: number
  date: string
  goalId: string
}

export interface ExchangeRate {
  rate: number
  lastUpdated: string
  source: "api" | "cache" | "mock"
}

export default function SavingsPlanner() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    rate: 83.5,
    lastUpdated: new Date().toISOString(),
    source: "mock",
  })
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isContributionOpen, setIsContributionOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("savings-goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }

    // Always fetch fresh exchange rate on app load
    fetchExchangeRate()
  }, [])

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem("savings-goals", JSON.stringify(goals))
  }, [goals])

  const fetchExchangeRate = async () => {
    setIsRefreshing(true)
    try {
      const result: ExchangeRateResponse = await exchangeRateService.fetchExchangeRate()

      const newExchangeRate: ExchangeRate = {
        rate: result.rate,
        lastUpdated: result.lastUpdated,
        source: result.source,
      }

      setExchangeRate(newExchangeRate)
      localStorage.setItem("exchange-rate", JSON.stringify(newExchangeRate))

      // Show appropriate toast based on source
      const sourceMessages = {
        api: `✅ Live rate updated: 1 USD = ₹${result.rate}`,
        cache: `📦 Using cached rate: 1 USD = ₹${result.rate}`,
        mock: `⚠️ Using simulated rate: 1 USD = ₹${result.rate}`,
      }

      toast({
        title: "Exchange rate updated",
        description: sourceMessages[result.source],
      })
    } catch (error) {
      console.error("Exchange rate fetch error:", error)
      toast({
        title: "Failed to update exchange rate",
        description: "Using previous rate",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const addGoal = (goalData: Omit<Goal, "id" | "currentAmount" | "contributions" | "createdAt">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      currentAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString(),
    }
    setGoals((prev) => [...prev, newGoal])
    toast({
      title: "🎯 Goal created successfully!",
      description: `${goalData.name} has been added to your savings journey`,
    })
  }

  const addContribution = (goalId: string, amount: number, date: string) => {
    const contribution: Contribution = {
      id: Date.now().toString(),
      amount,
      date,
      goalId,
    }

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newCurrentAmount = goal.currentAmount + amount
          const newGoal = {
            ...goal,
            currentAmount: newCurrentAmount,
            contributions: [...goal.contributions, contribution],
          }

          // Check if goal is completed
          if (newCurrentAmount >= goal.targetAmount) {
            toast({
              title: "🎉 Goal Completed!",
              description: `Congratulations! You've reached your ${goal.name} goal!`,
            })
          } else {
            toast({
              title: "💰 Contribution added",
              description: `${goal.currency === "INR" ? "₹" : "$"}${amount} added to ${goal.name}`,
            })
          }

          return newGoal
        }
        return goal
      }),
    )
  }

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
    toast({
      title: "Goal deleted",
      description: "Goal and all its data have been removed",
      variant: "destructive",
    })
  }

  const convertCurrency = (amount: number, fromCurrency: "INR" | "USD", toCurrency: "INR" | "USD") => {
    if (fromCurrency === toCurrency) return amount
    if (fromCurrency === "USD" && toCurrency === "INR") {
      return amount * exchangeRate.rate
    }
    if (fromCurrency === "INR" && toCurrency === "USD") {
      return amount / exchangeRate.rate
    }
    return amount
  }

  const formatCurrency = (amount: number, currency: "INR" | "USD") => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`
    }
    return `$${amount.toLocaleString("en-US")}`
  }

  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      setGoalToDelete(goal)
      setIsDeleteModalOpen(true)
    }
  }

  const completedGoals = goals.filter((goal) => (goal.currentAmount / goal.targetAmount) * 100 >= 100).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 md:p-4 space-y-6 md:space-y-8">
        {/* Responsive Header */}
        <ResponsiveHeader totalGoals={goals.length} completedGoals={completedGoals} exchangeRate={exchangeRate} />

        {/* Enhanced Dashboard */}
        <EnhancedDashboard
          goals={goals}
          exchangeRate={exchangeRate}
          onRefreshRate={fetchExchangeRate}
          isRefreshing={isRefreshing}
          convertCurrency={convertCurrency}
          formatCurrency={formatCurrency}
        />

        {/* Add Goal Button */}
        <div className="flex justify-center px-4">
          <Button
            onClick={() => setIsAddGoalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            Create New Goal
          </Button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mx-2 md:mx-0">
            <CardContent className="pt-6 text-center py-12 md:py-16">
              <div className="space-y-4 md:space-y-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Start Your Savings Journey</h3>
                  <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto px-4">
                    Create your first savings goal and take the first step towards financial freedom
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddGoalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-2 md:px-0">
            {goals.map((goal) => (
              <EnhancedGoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={(goal) => {
                  setSelectedGoal(goal)
                  setIsContributionOpen(true)
                }}
                onDeleteGoal={handleDeleteGoal}
                convertCurrency={convertCurrency}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <AddGoalModal isOpen={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} onAddGoal={addGoal} />

        <AddContributionModal
          isOpen={isContributionOpen}
          onClose={() => {
            setIsContributionOpen(false)
            setSelectedGoal(null)
          }}
          goal={selectedGoal}
          onAddContribution={addContribution}
        />

        <DeleteGoalModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setGoalToDelete(null)
          }}
          goal={goalToDelete}
          onDeleteGoal={deleteGoal}
        />

        {/* Debug Component (only in development) */}
        {process.env.NODE_ENV === "development" && <ApiStatusDebug />}
      </div>
    </div>
  )
}
