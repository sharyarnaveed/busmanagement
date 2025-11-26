import { NextResponse } from "next/server";
import supabase from "@/lib/SupbaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("seats")
    .select("id, fullname, regno, seatno, gender, created_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ seats: data });
}
