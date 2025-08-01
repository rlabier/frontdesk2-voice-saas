// Property schema for Vercel/Supabase deployment
// This matches the exact schema we had in the Replit system

import { z } from "zod";

export const propertySchema = z.object({
  UNITID: z.string().length(6, "UNITID must be exactly 6 characters"),
  userId: z.string().uuid(),
  status: z.enum(["active", "paused", "draft"]).default("draft"),
  
  // Access & Security
  LOCKCODE: z.string().default("1234"),
  LOCKBOX: z.string().default("1234"),
  LOCKINFO: z.string().default("To Open: Enter the code exactly. Then press the button with the lock. To Lock: Close the door, then press the button with the lock. There is no lockbox"),
  GATECODE: z.string().default("1234"),
  GATEINFO: z.string().default("Present the pass sent with your Arrival Information to the guard, along with ID."),
  
  // Network & Technology
  NETWORKNAME: z.string().default("Spectrum95cDB9"),
  PASSCODE: z.string().default("HappyDays123"),
  ROUTERINFO: z.string().default("It's the tall white box next to the TV"),
  TVINFO: z.string().default("Roku TV. Just press 'power' button on the remote, TV will turn on with selection of Roku channels"),
  NOSIG: z.string().default("bit.ly/flc_no_sig"),
  
  // Amenities & Supplies
  LINENINFO: z.string().default("Upstairs, next to the Main Bedroom"),
  WASHCLOTHS: z.string().default("We provide a supply of towels of different sizes, but we do *not* supply washcloths."),
  PACKNPLAY: z.string().default("The Pack-n-Play is in the closet of the Master Bedroom."),
  EXSUPPLYINFO: z.string().default("Please understand that this is a \"Self Catering\" unit, meaning that the host provides a small starter amount of expendable supplies - to get families started out. Items are like Toilet paper, Dish Soap, Detergent, shampoo, hand soap etc. Enough so that families won't need for anything on arrival. However, when these starter supplies run out, it is the guest's responsibility if you want to get more."),
  DISHWASHER: z.string().default("Rinse dishes to remove food items. Place detergent pod in container and close door securely. Press \"Wash Cycle\" button."),
  COFFEEMAKER: z.string().default("Standard 12 Cup Machine (size 4 filters). Coffee and filters not provided."),
  
  // Maintenance & Operations
  GARBAGEINFO: z.string().default("Please take all garbage bags to the community compactor, located to the rear of the community next to the tennis courts."),
  JACUZZI: z.string().default("On the left hand side of the jacuzzi, behind the steps, there is a small control. Set the jets to low medium or hi, and the heater to on. The unit will run for 30 minutes. You may need to run it for several cycles to achieve maximum heat."),
  POOLHEAT: z.string().optional(),
  LOSTANDFOUND: z.string().default("Please note that items found after guest departure are normally discarded by the cleaning team. However we have escalated the issue to the Housekeeping department, which will doublecheck respond within 24 hours."),
  
  // Community Access
  PASSLOC: z.string().default("Community passes are on a lanyard in the kitchen drawer. Please note, there is a $25 fee for replacement if lost."),
  PARKING: z.string().default("Parking passes are in the first kitchen drawer. Hand the tag from your vehicle rear-view mirror."),
  POOLCODE: z.string().default("1234"),
  COMPOOLLOC: z.string().default("The pool is just behind the Clubhouse, across from the community entry gate."),
  CLUBHOUSE: z.string().default("The Clubhouse is just opposite the community entry gate. Bring your Community Pass, found in your kitchen drawer."),
  
  // Management & Contact
  MANAGEREMAIL: z.string().email().optional().or(z.literal("")),
  MANAGERTXT: z.string().optional(),
  CHECKIN: z.string().default("4pm (or 1600)"),
  CHECKOUT: z.string().default("11am (or 1100)"),
  
  // Policies & Rules
  DELIVERYINFO: z.string().default("Please note that as a vacation rental, this unit does *NOT* receive us postal service (mail). Delivery services (FEDEX, DHL Etc) have private policies which frequently change. The community is not set up for delivery to the administration, and the community will not be responsible for packages left outside of units. So: you must first check with your carrier to understand their current policy, and then if they do deliver, you must be present to receive it."),
  PET: z.string().default("We are very sorry but this unit and community are unable to host pets of any kind. Thank you for understanding."),
  PARKINGINFO: z.string().default("No vehicles bearing signage, no commercial vehicles, no trailers or caravans. Vehicles must be in operational condition at all times, and no work may be done on vehicles within the community for any reason. Please note that violators will be towed at your expense, no exceptions."),
});

export const insertPropertySchema = propertySchema.omit({
  userId: true,
});

export const updatePropertySchema = insertPropertySchema.partial();

export type Property = z.infer<typeof propertySchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;

// Voice interaction schema
export const voiceInteractionSchema = z.object({
  id: z.string().uuid(),
  UNITID: z.string().length(6),
  interactionType: z.string(),
  issue: z.string().optional(),
  CALLERNAME: z.string().optional(),
  GUESTEMAIL: z.string().email().optional(),
  PHONENUMBER: z.string().optional(),
  timestamp: z.date(),
});

export type VoiceInteraction = z.infer<typeof voiceInteractionSchema>;

// Dashboard stats interface
export interface DashboardStats {
  activeProperties: number;
  voiceCallsToday: number;
  avgResponseTime: string;
  satisfactionScore: string;
}