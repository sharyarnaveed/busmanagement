"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeatGrid } from "@/components/seat-grid"
import { SeatDetailsDialog } from "@/components/seat-details-dialog"
import { getSeats } from "@/lib/store"
import type { Seat } from "@/lib/types"
import { Users, Armchair, UserCheck, Bus } from "lucide-react"

export default function AdminDashboard() {
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

  const totalSeats = 55
  const bookedSeats = seats.filter((s) => s.isBooked).length
  const availableSeats = totalSeats - bookedSeats
  const malePassengers = seats.filter((s) => s.gender === "male").length
  const femalePassengers = seats.filter((s) => s.gender === "female").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage bus seats and view bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Seats</CardDescription>
            <Bus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Available</CardDescription>
            <Armchair className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{availableSeats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Booked</CardDescription>
            <UserCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bookedSeats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Male</CardDescription>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{malePassengers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Female</CardDescription>
            <Users className="w-4 h-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{femalePassengers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seat Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Seat Layout</CardTitle>
          <CardDescription>Click on any seat to view booking details</CardDescription>
        </CardHeader>
        <CardContent>
          <SeatGrid seats={seats} onSeatClick={handleSeatClick} showDetails />
        </CardContent>
      </Card>

      {/* Seat Details Dialog */}
      <SeatDetailsDialog seat={selectedSeat} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  )
}
