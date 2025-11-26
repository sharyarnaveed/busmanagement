import { NextResponse } from "next/server"
import supabase from "@/lib/SupbaseClient"

export async function DELETE() {
  // Find seats older than 4 hours
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  // Delete all seats created before fourHoursAgo
  const { error } = await supabase
    .from("seats")
    .delete()
    .lt("created_at", fourHoursAgo)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ message: "Old seats deleted successfully" })
}
