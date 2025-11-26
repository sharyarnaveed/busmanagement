import type { Seat } from "./types"

// Mock data store - simulates a backend
let seats: Seat[] = []
let totalSeats = 55

export function initializeSeats(count: number): Seat[] {
  totalSeats = count
  seats = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    isBooked: false,
  }))

  // Add some mock bookings for demo
  if (count >= 10) {
    seats[0] = { id: 1, isBooked: true, passengerName: "John Doe", registrationNo: "REG001", gender: "male" }
    seats[2] = { id: 3, isBooked: true, passengerName: "Jane Smith", registrationNo: "REG002", gender: "female" }
    seats[5] = { id: 6, isBooked: true, passengerName: "Mike Johnson", registrationNo: "REG003", gender: "male" }
    seats[10] = { id: 11, isBooked: true, passengerName: "Sarah Wilson", registrationNo: "REG004", gender: "female" }
  }

  return seats
}

export function getSeats(): Seat[] {
  if (seats.length === 0) {
    initializeSeats(totalSeats)
  }
  return seats
}

export function getTotalSeats(): number {
  return totalSeats
}

export function setTotalSeats(count: number): Seat[] {
  return initializeSeats(count)
}

export function bookSeat(
  seatId: number,
  data: { passengerName: string; registrationNo: string; gender: "male" | "female" },
): boolean {
  const seat = seats.find((s) => s.id === seatId)
  if (seat && !seat.isBooked) {
    seat.isBooked = true
    seat.passengerName = data.passengerName
    seat.registrationNo = data.registrationNo
    seat.gender = data.gender
    return true
  }
  return false
}

export function getSeatById(seatId: number): Seat | undefined {
  return seats.find((s) => s.id === seatId)
}

// Initialize with default seats
initializeSeats(55)
