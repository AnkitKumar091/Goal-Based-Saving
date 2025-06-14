"use client"

import { useState, useEffect } from "react"
import { Info, Wifi, WifiOff, Database, Zap, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { exchangeRateService } from "@/lib/exchange-rate-service"

interface ExchangeRateStatusProps {
  source: "api" | "cache" | "mock"
  lastUpdated: string
  rate: number
  onRefresh: () => void
  isRefreshing: boolean
}

export function ExchangeRateStatus({ source, lastUpdated, rate, onRefresh, isRefreshing }: ExchangeRateStatusProps) {
  const [cacheInfo, setCacheInfo] = useState(exchangeRateService.getCacheInfo())

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheInfo(exchangeRateService.getCacheInfo())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getSourceIcon = () => {
    switch (source) {
      case "api":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "cache":
        return <Database className="h-4 w-4 text-blue-600" />
      case "mock":
        return <WifiOff className="h-4 w-4 text-orange-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getSourceColor = () => {
    switch (source) {
      case "api":
        return "bg-gradient-to-r from-green-50 to-emerald-100 border-green-200"
      case "cache":
        return "bg-gradient-to-r from-blue-50 to-cyan-100 border-blue-200"
      case "mock":
        return "bg-gradient-to-r from-orange-50 to-yellow-100 border-orange-200"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-100 border-gray-200"
    }
  }

  const getSourceDescription = () => {
    switch (source) {
      case "api":
        return "Live exchange rate from API"
      case "cache":
        return "Cached exchange rate data"
      case "mock":
        return "Simulated rate (API unavailable)"
      default:
        return "Unknown data source"
    }
  }

  const formatCacheAge = (ageMs: number) => {
    const minutes = Math.floor(ageMs / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`
    }
    return `${minutes}m ago`
  }

  return (
    <Card className={`${getSourceColor()} border transition-all duration-300 hover:shadow-lg`}>
      <CardContent className="p-4 md:p-6">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSourceIcon()}
              <div>
                <p className="font-bold text-lg">₹{rate}</p>
                <p className="text-xs text-gray-600">1 USD</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 px-3 text-xs"
            >
              {isRefreshing ? "..." : "Refresh"}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {source.charAt(0).toUpperCase() + source.slice(1)} • {new Date(lastUpdated).toLocaleTimeString()}
            </span>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {cacheInfo.remainingRequests}
            </Badge>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/50 rounded-full">
                <TrendingUp className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getSourceIcon()}
                  <p className="font-semibold text-gray-800">{getSourceDescription()}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">1 USD = ₹{rate}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Updated: {new Date(lastUpdated).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* API Requests Remaining */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-sm">
                      <Zap className="h-3 w-3 mr-1" />
                      {cacheInfo.remainingRequests}/100
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>API requests remaining this hour</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Cache Status */}
              {cacheInfo.hasCache && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="text-sm">
                        <Database className="h-3 w-3 mr-1" />
                        {cacheInfo.cacheAge ? formatCacheAge(cacheInfo.cacheAge) : "Fresh"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cache source: {cacheInfo.source === "api" ? "API data" : "Mock data"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} className="h-9 px-4">
                {isRefreshing ? "Updating..." : "Refresh Rate"}
              </Button>
            </div>
          </div>

          {/* Warnings */}
          {source === "mock" && (
            <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg text-sm text-orange-800">
              <strong>Note:</strong> Using simulated exchange rates. API may be unavailable or rate limited.
            </div>
          )}

          {cacheInfo.remainingRequests < 10 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>Warning:</strong> Approaching API rate limit. Automatic caching is active.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
