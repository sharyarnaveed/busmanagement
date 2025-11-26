"use client"

import { cn } from "@/lib/utils"
import type { Seat } from "@/lib/types"

interface SeatButtonProps {
  seat: Seat
  onClick: (seat: Seat) => void
  size?: "sm" | "md" | "lg"
  showDetails?: boolean
}

function SeatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Seat back */}
      <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14C20 14.5523 19.5523 15 19 15H5C4.44772 15 4 14.5523 4 14V6Z" />
      {/* Seat cushion */}
      <path d="M3 16C3 15.4477 3.44772 15 4 15H20C20.5523 15 21 15.4477 21 16V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V16Z" />
      {/* Armrests */}
      <path d="M2 10C2 9.44772 2.44772 9 3 9H4V15H3C2.44772 15 2 14.5523 2 14V10Z" />
      <path d="M20 9H21C21.5523 9 22 9.44772 22 10V14C22 14.5523 21.5523 15 21 15H20V9Z" />
    </svg>
  )
}

export function SeatButton({ seat, onClick, size = "md", showDetails = false }: SeatButtonProps) {
  const getSeatColor = () => {
    if (!seat.isBooked) return "text-gray-400 hover:text-gray-500"
    if (seat.gender === "female") return "text-pink-500 hover:text-pink-600"
    return "text-blue-500 hover:text-blue-600"
  }

  const sizeClasses = {
    sm: "w-12 h-14",
    md: "w-14 h-16",
    lg: "w-16 h-18",
  }

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  }

  return (
    <button
      onClick={() => onClick(seat)}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-200 group",
        getSeatColor(),
        sizeClasses[size],
      )}
    >
      <div className="relative">
        <SeatIcon className={cn(iconSizes[size], "drop-shadow-md transition-transform group-hover:scale-105")} />
        {/* Seat number overlay */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold",
            seat.isBooked ? "text-white" : "text-gray-600",
            size === "sm" ? "text-xs -mt-1" : size === "md" ? "text-sm -mt-1" : "text-base -mt-1",
          )}
        >
          {seat.id}
        </span>
      </div>
      {/* Only show name for booked male seats */}
      {showDetails && seat.isBooked && seat.gender === "male" && seat.passengerName && (
        <span className="text-[9px] truncate max-w-full px-1 text-gray-600 font-medium">
          {seat.passengerName.split(" ")[0]}
        </span>
      )}
    </button>
  );
}
