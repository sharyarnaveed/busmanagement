"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSeats } from "@/lib/store"
import type { Seat } from "@/lib/types"
import { SeatDetailsDialog } from "@/components/seat-details-dialog"
import { cn } from "@/lib/utils"

export default function AdminSeatsPage() {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    async function fetchSeats() {
      try {
        const res = await fetch("/api/getseats")
        const result = await res.json()
        // Map API data to Seat type
        const apiSeats = (result.seats || []).map((s: any) => ({
          id: s.seatno || s.id,
          isBooked: !!s.fullname,
          passengerName: s.fullname || undefined,
          registrationNo: s.regno || undefined,
          gender: s.gender || undefined,
        }))
        setSeats(apiSeats)
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchSeats()
  }, [])

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Seats</h1>
        <p className="text-muted-foreground">View detailed information for all seats</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-400" />
          <span className="text-sm text-muted-foreground">Male</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-400" />
          <span className="text-sm text-muted-foreground">Female</span>
        </div>
      </div>

      {/* Seat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {seats.map((seat) => (
          <Card
            key={seat.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              seat.isBooked
                ? seat.gender === "female"
                  ? "border-pink-300 bg-pink-50"
                  : "border-blue-300 bg-blue-50"
                : "border-gray-200",
            )}
            onClick={() => handleSeatClick(seat)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Seat #{seat.id}</CardTitle>
                <Badge
                  variant={seat.isBooked ? "default" : "outline"}
                  className={cn(
                    seat.isBooked
                      ? seat.gender === "female"
                        ? "bg-pink-400 hover:bg-pink-500"
                        : "bg-blue-400 hover:bg-blue-500"
                      : "",
                  )}
                >
                  {seat.isBooked ? "Booked" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {seat.isBooked ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{seat.passengerName}</p>
                  <p className="text-muted-foreground">{seat.registrationNo}</p>
                  <p className="text-muted-foreground capitalize">{seat.gender}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No booking</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seat Details Dialog */}
      <SeatDetailsDialog seat={selectedSeat} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  )
}
