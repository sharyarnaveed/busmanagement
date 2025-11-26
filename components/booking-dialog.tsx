"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Seat, BookingFormData } from "@/lib/types";

interface BookingDialogProps {
  seat: Seat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (seatId: number, data: BookingFormData) => void;
}

export function BookingDialog({
  seat,
  open,
  onOpenChange,
  onSubmit,
}: BookingDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<BookingFormData>({
    defaultValues: {
      fullName: "",
      registrationNo: "",
      gender: "male",
    },
  });

  const gender = watch("gender");

  const onFormSubmit = async (data: BookingFormData) => {
    if (!seat) return;
    // Prevent males from booking seats in first 4 rows (seat id 1-20)
    if (seat.id >= 1 && seat.id <= 20 && data.gender === "male") {
      alert("Only females can book seats in the first 4 rows.");
      return;
    }
    try {
      const res = await fetch("/api/bookseat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId: seat.id, ...data }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Call parent onSubmit to refetch seat data
        await onSubmit(seat.id, data);
        reset();
        onOpenChange(false);
      } else {
        alert(result.error || "Booking failed");
      }
    } catch (err: any) {
      alert(err.message || "Booking failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Seat #{seat?.id}</DialogTitle>
          <DialogDescription>
            Fill in your details to book this seat.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register("fullName", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNo">Registration No</Label>
            <Input
              id="registrationNo"
              placeholder="Enter registration number"
              {...register("registrationNo", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) =>
                setValue("gender", value as "male" | "female")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Booking..." : "Book Seat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
