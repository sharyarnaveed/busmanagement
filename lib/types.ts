export interface Seat {
  id: number
  isBooked: boolean
  passengerName?: string
  registrationNo?: string
  gender?: "male" | "female"
}

export interface BookingFormData {
  fullName: string
  registrationNo: string
  gender: "male" | "female"
}
