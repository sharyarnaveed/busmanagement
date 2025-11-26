"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Seat } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface SeatDetailsDialogProps {
  seat: Seat | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SeatDetailsDialog({ seat, open, onOpenChange }: SeatDetailsDialogProps) {
  if (!seat) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Seat #{seat.id}
            <Badge
              variant={seat.isBooked ? (seat.gender === "female" ? "default" : "secondary") : "outline"}
              className={seat.isBooked ? (seat.gender === "female" ? "bg-pink-400" : "bg-blue-400 text-white") : ""}
            >
              {seat.isBooked ? (seat.gender === "female" ? "Female" : "Male") : "Available"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {seat.isBooked ? (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Passenger Name</span>
                <span className="font-medium">{seat.passengerName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Registration No</span>
                <span className="font-medium">{seat.registrationNo}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium capitalize">{seat.gender}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Status</span>
                <Badge className={seat.gender === "female" ? "bg-pink-400" : "bg-blue-400"}>Booked</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">This seat is currently available for booking.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
