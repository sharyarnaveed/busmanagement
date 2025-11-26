import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/SupbaseClient";
import type { BookingFormData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { seatId, fullName, registrationNo, gender } =
      body as BookingFormData & { seatId: number };
    if (!seatId || !fullName || !registrationNo || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save booking to Supabase
    const { data, error } = await supabase.from("seats").insert([
      {
        seatno: seatId,
        fullname: fullName,
        regno: registrationNo,
        gender,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
