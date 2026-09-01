import { addMinutes, format, isBefore, parse } from "date-fns";

export type AvailabilityRule = {
  startTime: string;
  endTime: string;
  slotDuration: number;
};

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(total: number) {
  const hours = Math.floor(total / 60).toString().padStart(2, "0");
  const minutes = (total % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function addMinutesToTime(time: string, minutes: number) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function generateSlots(rule: AvailabilityRule) {
  const slots: string[] = [];
  let current = parse(rule.startTime, "HH:mm", new Date());
  const end = parse(rule.endTime, "HH:mm", new Date());

  while (isBefore(addMinutes(current, rule.slotDuration), addMinutes(end, 1))) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, rule.slotDuration);
  }

  return slots;
}

export function isTimeWithinRule(startTime: string, rule: AvailabilityRule) {
  const start = timeToMinutes(startTime);
  const dayStart = timeToMinutes(rule.startTime);
  const dayEnd = timeToMinutes(rule.endTime);
  return start >= dayStart && start + rule.slotDuration <= dayEnd && (start - dayStart) % rule.slotDuration === 0;
}
