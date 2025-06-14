"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { exchangeRateService } from "@/lib/exchange-rate-service"

export function ApiStatusDebug() {
  const [cacheInfo, setCacheInfo] = useState(exchangeRateService.getCacheInfo())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheInfo(exchangeRateService.getCacheInfo())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const clearCache = () => {
    localStorage.removeItem("exchange-rate-cache")
    localStorage.removeItem("exchange-rate-requests")
    setCacheInfo(exchangeRateService.getCacheInfo())
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
      >
        Debug API
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">API Debug Info</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex justify-between items-center">
          <span>API Requests Remaining:</span>
          <Badge variant={cacheInfo.remainingRequests < 10 ? "destructive" : "secondary"}>
            {cacheInfo.remainingRequests}/100
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Cache Status:</span>
            <Badge variant={cacheInfo.hasCache ? "default" : "outline"}>
              {cacheInfo.hasCache ? "Active" : "Empty"}
            </Badge>
          </div>

          {cacheInfo.hasCache && (
            <>
              <div className="flex justify-between">
                <span>Cache Age:</span>
                <span>{cacheInfo.cacheAge ? formatTime(cacheInfo.cacheAge) : "Fresh"}</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Source:</span>
                <Badge variant={cacheInfo.source === "api" ? "default" : "secondary"}>
                  {cacheInfo.source?.toUpperCase()}
                </Badge>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={clearCache} className="w-full h-7 text-xs">
            Clear Cache & Limits
          </Button>

          <div className="text-center text-gray-500">
            <p>Rate limits reset hourly</p>
            <p>Cache expires after 1 hour</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
