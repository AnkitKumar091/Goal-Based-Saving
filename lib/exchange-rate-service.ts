"use client"

export interface ExchangeRateResponse {
  rate: number
  lastUpdated: string
  source: "api" | "cache" | "mock"
}

export interface CachedExchangeRate {
  rate: number
  lastUpdated: string
  source: "api" | "mock"
  expiresAt: number
}

class ExchangeRateService {
  private readonly API_KEY = "a22a73effdb03fa38591bb6b"
  private readonly API_URL = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/USD`
  private readonly CACHE_KEY = "exchange-rate-cache"
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
  private readonly RATE_LIMIT_KEY = "exchange-rate-requests"
  private readonly MAX_REQUESTS_PER_HOUR = 100 // Conservative limit

  // Mock exchange rate with realistic fluctuation
  private generateMockRate(): number {
    const baseRate = 83.5
    const dailyTrend = Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 0.3 // Daily trend
    const hourlyFluctuation = Math.sin(Date.now() / (1000 * 60 * 60)) * 0.2 // Hourly changes
    const randomNoise = (Math.random() - 0.5) * 0.4 // Random fluctuation

    const rate = baseRate + dailyTrend + hourlyFluctuation + randomNoise
    return Math.round(rate * 100) / 100
  }

  private isRateLimited(): boolean {
    const requests = this.getRequestHistory()
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentRequests = requests.filter((timestamp) => timestamp > oneHourAgo)

    return recentRequests.length >= this.MAX_REQUESTS_PER_HOUR
  }

  private recordRequest(): void {
    const requests = this.getRequestHistory()
    requests.push(Date.now())

    // Keep only requests from the last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentRequests = requests.filter((timestamp) => timestamp > oneHourAgo)

    localStorage.setItem(this.RATE_LIMIT_KEY, JSON.stringify(recentRequests))
  }

  private getRequestHistory(): number[] {
    try {
      const stored = localStorage.getItem(this.RATE_LIMIT_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private getCachedRate(): CachedExchangeRate | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY)
      if (!cached) return null

      const parsedCache: CachedExchangeRate = JSON.parse(cached)

      // Check if cache is still valid
      if (Date.now() < parsedCache.expiresAt) {
        return parsedCache
      }

      // Cache expired, remove it
      localStorage.removeItem(this.CACHE_KEY)
      return null
    } catch {
      return null
    }
  }

  private setCachedRate(rate: number, source: "api" | "mock"): void {
    const cacheData: CachedExchangeRate = {
      rate,
      lastUpdated: new Date().toISOString(),
      source,
      expiresAt: Date.now() + this.CACHE_DURATION,
    }

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Failed to cache exchange rate:", error)
    }
  }

  async fetchExchangeRate(): Promise<ExchangeRateResponse> {
    // Always try API first unless we're rate limited
    if (this.isRateLimited()) {
      console.warn("Rate limit reached, using mock exchange rate")
      const mockRate = this.generateMockRate()
      this.setCachedRate(mockRate, "mock")

      return {
        rate: mockRate,
        lastUpdated: new Date().toISOString(),
        source: "mock",
      }
    }

    // Try to fetch from API first
    try {
      this.recordRequest()

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch(this.API_URL, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "SavingsPlanner/1.0",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.conversion_rates?.INR) {
        throw new Error("Invalid API response format")
      }

      const rate = Math.round(data.conversion_rates.INR * 100) / 100

      // Cache the successful API response
      this.setCachedRate(rate, "api")

      return {
        rate,
        lastUpdated: new Date().toISOString(),
        source: "api",
      }
    } catch (error) {
      console.warn("Failed to fetch from API:", error)

      // Check if we have cached data as fallback
      const cachedRate = this.getCachedRate()
      if (cachedRate) {
        return {
          rate: cachedRate.rate,
          lastUpdated: cachedRate.lastUpdated,
          source: "cache",
        }
      }

      // Final fallback to mock rate
      const mockRate = this.generateMockRate()
      this.setCachedRate(mockRate, "mock")

      return {
        rate: mockRate,
        lastUpdated: new Date().toISOString(),
        source: "mock",
      }
    }
  }

  // Get remaining requests for the current hour
  getRemainingRequests(): number {
    const requests = this.getRequestHistory()
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentRequests = requests.filter((timestamp) => timestamp > oneHourAgo)

    return Math.max(0, this.MAX_REQUESTS_PER_HOUR - recentRequests.length)
  }

  // Force refresh (ignores cache but respects rate limits)
  async forceRefresh(): Promise<ExchangeRateResponse> {
    // Clear cache first
    localStorage.removeItem(this.CACHE_KEY)

    // Then fetch fresh data
    return this.fetchExchangeRate()
  }

  // Get cache info for debugging
  getCacheInfo(): {
    hasCache: boolean
    cacheAge?: number
    source?: string
    remainingRequests: number
  } {
    const cached = this.getCachedRate()
    const remainingRequests = this.getRemainingRequests()

    if (!cached) {
      return { hasCache: false, remainingRequests }
    }

    const cacheAge = Date.now() - new Date(cached.lastUpdated).getTime()

    return {
      hasCache: true,
      cacheAge,
      source: cached.source,
      remainingRequests,
    }
  }
}

// Export singleton instance
export const exchangeRateService = new ExchangeRateService()
