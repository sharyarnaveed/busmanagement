"use client";

import { useState, useEffect } from "react";
import type { BookingFormData, Seat } from "@/lib/types";

// Extend Seat type to include restrictedRow
type SeatWithRestriction = import("@/lib/types").Seat & {
  restrictedRow?: boolean;
};
import { getSeats, bookSeat } from "@/lib/store";
import { SeatGrid } from "@/components/seat-grid";
import { BookingDialog } from "@/components/booking-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bus, CheckCircle2, XCircle, Settings } from "lucide-react";
import Link from "next/link";
export default function UserHomePage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatWithRestriction | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch seats from API
  useEffect(() => {
    const fetchSeats = async () => {
      const res = await fetch("/api/getseats");
      const result = await res.json();
      // Map API data to Seat[]
      const bookedSeats: Seat[] = (result.seats || []).map((s: any) => ({
        id: s.seatno,
        isBooked: !!s.fullname,
        passengerName: s.fullname || undefined,
        registrationNo: s.regno || undefined,
        gender: s.gender || undefined,
      }));
      // Fill remaining seats as available
      const totalSeats = 55;
      const seatsArr: Seat[] = Array.from({ length: totalSeats }, (_, i) => {
        const booked = bookedSeats.find((bs) => bs.id === i + 1);
        return booked || { id: i + 1, isBooked: false };
      });
      setSeats(seatsArr);
    };
    fetchSeats();
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) {
      setAlert({
        type: "error",
        message: "This seat is already booked. Please select another seat.",
      });
      setTimeout(() => setAlert(null), 7000);
      return;
    }
    // Check if seat is in first 4 rows (seat id 1-20)
    if (seat.id >= 1 && seat.id <= 20) {
      // When opening dialog, store seat and check gender on submit
      setSelectedSeat({ ...seat, restrictedRow: true });
    } else {
      setSelectedSeat({ ...seat, restrictedRow: false });
    }
    setDialogOpen(true);
  };

  // After booking, refetch seats
  const handleBooking = async (seatId: number, data: BookingFormData) => {
    // Booking is handled by API in BookingDialog
    // Just refetch seats after booking
    const res = await fetch("/api/getseats");
    const result = await res.json();
    const bookedSeats: Seat[] = (result.seats || []).map((s: any) => ({
      id: s.seatno,
      isBooked: !!s.fullname,
      passengerName: s.fullname || undefined,
      registrationNo: s.regno || undefined,
      gender: s.gender || undefined,
    }));
    const totalSeats = 55;
    const seatsArr: Seat[] = Array.from({ length: totalSeats }, (_, i) => {
      const booked = bookedSeats.find((bs) => bs.id === i + 1);
      return booked || { id: i + 1, isBooked: false };
    });
    setSeats(seatsArr);
    setAlert({
      type: "success",
      message: `Seat #${seatId} has been successfully booked!`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Bus Booking</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              variant={alert.type === "error" ? "destructive" : "default"}
              className={
                alert.type === "success" ? "border-green-500 bg-green-50" : ""
              }
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {alert.type === "success" ? "Success" : "Seat Already Booked"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Seat Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Seat</CardTitle>
            <CardDescription>
              Click on an available seat (gray) to book it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatGrid seats={seats} onSeatClick={handleSeatClick} />
          </CardContent>
        </Card>
      </main>

      {/* Booking Dialog */}
      <BookingDialog
        seat={selectedSeat}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={async (seatId, data) => {
          // Prevent males from booking seats in first 4 rows
          if (
            selectedSeat &&
            selectedSeat.restrictedRow &&
            data.gender === "male"
          ) {
            setAlert({
              type: "error",
              message: "Only females can book seats in the first 4 rows.",
            });
            setDialogOpen(false);
            setTimeout(() => setAlert(null), 3000);
            return;
          }
          await handleBooking(seatId, data);
        }}
      />
    </div>
  );
}
