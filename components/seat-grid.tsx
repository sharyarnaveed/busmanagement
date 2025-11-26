"use client"

import type { Seat } from "@/lib/types"
import { SeatButton } from "./seat-button"

interface SeatGridProps {
  seats: Seat[]
  onSeatClick: (seat: Seat) => void
  showDetails?: boolean
}

// Layout: 11 rows with 2 seats on left, aisle, 3 seats on right
// Last row: 5 seats spanning full width
// Total seats: 10 rows × 5 seats + 5 back seats = 55 seats

export function SeatGrid({ seats, onSeatClick, showDetails = false }: SeatGridProps) {
  // Generate the bus layout
  // Rows 1-10: Left side (2 seats) | Aisle | Right side (3 seats)
  // Row 11 (back): 5 seats spanning full width

  // Only show name for booked males
  const getSeat = (id: number) => {
    const seat = seats.find((s) => s.id === id) || { id, isBooked: false };
    if (seat.isBooked && seat.gender === "male" && seat.passengerName) {
      return { ...seat, showName: true };
    }
    return { ...seat, showName: false };
  };

  const renderRow = (rowIndex: number) => {
    // Row 1 uses seats 1-5, Row 2 uses seats 6-10, etc.
    const startSeatId = (rowIndex - 1) * 5 + 1

    return (
      <div
        key={rowIndex}
        className="flex items-center justify-center gap-0.5 sm:gap-2 md:gap-4"
      >
        {/* Left side - 2 seats */}
        <div className="flex gap-0.5 sm:gap-1">
          <SeatButton seat={getSeat(startSeatId)} onClick={onSeatClick} size="md" showDetails={getSeat(startSeatId).showName} />
          <SeatButton seat={getSeat(startSeatId + 1)} onClick={onSeatClick} size="md" showDetails={getSeat(startSeatId + 1).showName} />
        </div>

        {/* Aisle - wider and responsive */}
        <div
          className="w-3 sm:w-12 md:w-20 lg:w-28 shrink-0 flex items-center justify-center"
        >
          <div className="w-full h-0.5 bg-gray-200 rounded" />
        </div>

        {/* Right side - 3 seats */}
        <div className="flex gap-0.5 sm:gap-1">
          <SeatButton seat={getSeat(startSeatId + 2)} onClick={onSeatClick} size="md" showDetails={getSeat(startSeatId + 2).showName} />
          <SeatButton seat={getSeat(startSeatId + 3)} onClick={onSeatClick} size="md" showDetails={getSeat(startSeatId + 3).showName} />
          <SeatButton seat={getSeat(startSeatId + 4)} onClick={onSeatClick} size="md" showDetails={getSeat(startSeatId + 4).showName} />
        </div>
      </div>
    );
  }

  const renderBackRow = () => {
    // Back row starts at seat 51 (after 10 rows × 5 seats)
    const startSeatId = 51

    return (
      <div className="flex items-center justify-center gap-0.5 mt-1.5 pt-1.5 border-t border-gray-200">
        {/* 5 seats in a row at the back */}
        {[0, 1, 2, 3, 4].map((i) => (
          <SeatButton
            key={startSeatId + i}
            seat={getSeat(startSeatId + i)}
            onClick={onSeatClick}
            size="md"
            showDetails={getSeat(startSeatId + i).showName}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full px-0">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 xs:gap-3 mb-3 xs:mb-4 justify-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-300" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-400" />
          <span className="text-muted-foreground">Male</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-pink-400" />
          <span className="text-muted-foreground">Female</span>
        </div>
      </div>

      {/* Bus Container */}
      <div className="w-full overflow-x-auto">
        {/* Bus body */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-t-3xl rounded-b-lg p-1 xs:p-2 sm:p-3 relative min-w-[270px] w-full max-w-sm mx-auto">
          {/* Driver area */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-gray-300">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" />
                </svg>
              </div>
              <span className="text-[10px] xs:text-xs font-medium text-gray-600">Driver</span>
            </div>
            <div className="w-7 h-5 xs:w-8 xs:h-5 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
              <span className="text-[8px] text-gray-500">Door</span>
            </div>
          </div>

          {/* Seat rows */}
          <div className="flex flex-col gap-1">
            {/* Rows 1-10 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(renderRow)}

            {/* Row 11 - Back row with 5 seats */}
            {renderBackRow()}
          </div>
        </div>
      </div>

      {/* Total seats info */}
      <div className="text-center mt-3 text-[10px] xs:text-xs text-muted-foreground">
        Total Capacity: 55 seats (50 regular + 5 back row)
      </div>
    </div>
  )
}