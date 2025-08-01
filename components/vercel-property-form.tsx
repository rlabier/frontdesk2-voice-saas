// Property Form Component for Vercel Deployment
// Comprehensive 30+ field form for vacation rental properties

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { insertPropertySchema, type InsertProperty, type Property } from "./vercel-property-schema";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: InsertProperty) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PropertyForm({ property, onSubmit, onCancel, isLoading = false }: PropertyFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: property ? {
      UNITID: property.UNITID,
      status: property.status,
      LOCKCODE: property.LOCKCODE,
      LOCKBOX: property.LOCKBOX,
      LOCKINFO: property.LOCKINFO,
      GATECODE: property.GATECODE,
      GATEINFO: property.GATEINFO,
      NETWORKNAME: property.NETWORKNAME,
      PASSCODE: property.PASSCODE,
      ROUTERINFO: property.ROUTERINFO,
      TVINFO: property.TVINFO,
      NOSIG: property.NOSIG,
      LINENINFO: property.LINENINFO,
      WASHCLOTHS: property.WASHCLOTHS,
      PACKNPLAY: property.PACKNPLAY,
      EXSUPPLYINFO: property.EXSUPPLYINFO,
      DISHWASHER: property.DISHWASHER,
      COFFEEMAKER: property.COFFEEMAKER,
      GARBAGEINFO: property.GARBAGEINFO,
      JACUZZI: property.JACUZZI,
      POOLHEAT: property.POOLHEAT || "",
      LOSTANDFOUND: property.LOSTANDFOUND,
      PASSLOC: property.PASSLOC,
      PARKING: property.PARKING,
      POOLCODE: property.POOLCODE,
      COMPOOLLOC: property.COMPOOLLOC,
      CLUBHOUSE: property.CLUBHOUSE,
      MANAGEREMAIL: property.MANAGEREMAIL || "",
      MANAGERTXT: property.MANAGERTXT || "",
      CHECKIN: property.CHECKIN,
      CHECKOUT: property.CHECKOUT,
      DELIVERYINFO: property.DELIVERYINFO,
      PET: property.PET,
      PARKINGINFO: property.PARKINGINFO,
    } : {
      UNITID: "",
      status: "draft",
    },
  });

  const generateUnitId = () => {
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const unitId = letters + numbers;
    form.setValue("UNITID", unitId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {property ? "Edit Property" : "Create New Property"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {property ? `Editing ${property.UNITID}` : "Add a new vacation rental property to your portfolio"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Basic Information
                <Badge variant={form.watch("status") === "active" ? "default" : "secondary"}>
                  {form.watch("status")}
                </Badge>
              </CardTitle>
              <CardDescription>
                Property identification and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="UNITID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit ID</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="AA1234" 
                            {...field}
                            className="uppercase"
                            maxLength={6}
                          />
                        </FormControl>
                        {!property && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateUnitId}
                            size="sm"
                          >
                            Generate
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="access">Access & Security</TabsTrigger>
              <TabsTrigger value="network">Network & Tech</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle>Access & Security Information</CardTitle>
                  <CardDescription>Lock codes, gate access, and security details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="LOCKCODE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lock Code</FormLabel>
                          <FormControl>
                            <Input placeholder="1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="LOCKBOX"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lockbox Code</FormLabel>
                          <FormControl>
                            <Input placeholder="5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="LOCKINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lock Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed instructions for using the lock system"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="GATECODE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gate Code</FormLabel>
                          <FormControl>
                            <Input placeholder="9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="GATEINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gate Access Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Instructions for gate access"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle>Network & Technology</CardTitle>
                  <CardDescription>WiFi, TV, and technical equipment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="NETWORKNAME"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WiFi Network Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Spectrum95cDB9" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="PASSCODE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WiFi Password</FormLabel>
                          <FormControl>
                            <Input placeholder="HappyDays123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ROUTERINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Router Location & Info</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Router location and troubleshooting information"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="TVINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TV & Entertainment Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="TV operation and entertainment system instructions"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="NOSIG"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No Signal Help Link</FormLabel>
                        <FormControl>
                          <Input placeholder="bit.ly/flc_no_sig" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="amenities">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Supplies</CardTitle>
                  <CardDescription>Linens, appliances, and guest amenities information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="LINENINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Linen & Bedding Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Location and details about linens and bedding"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="WASHCLOTHS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Washcloths & Towels Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Information about washcloths and towel availability"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PACKNPLAY"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pack & Play / Baby Equipment</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Baby equipment availability and location"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="EXSUPPLYINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expendable Supplies Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Policy regarding starter supplies and guest responsibilities"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="DISHWASHER"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dishwasher Instructions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How to operate the dishwasher"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="COFFEEMAKER"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coffee Maker Instructions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Coffee maker type and operating instructions"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance & Operations</CardTitle>
                  <CardDescription>Garbage, hot tub, pool, and maintenance information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="GARBAGEINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garbage & Waste Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Garbage collection procedures and location"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="JACUZZI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hot Tub / Jacuzzi Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Hot tub operation and safety instructions"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="POOLHEAT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Heating Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Pool heating system instructions (if applicable)"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="LOSTANDFOUND"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lost & Found Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Lost and found procedures and contact information"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community">
              <Card>
                <CardHeader>
                  <CardTitle>Community Access & Management</CardTitle>
                  <CardDescription>Community amenities, parking, and management contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="PASSLOC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Pass Location</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Where to find community passes"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PARKING"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parking Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parking passes and spot assignments"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="POOLCODE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pool Access Code</FormLabel>
                          <FormControl>
                            <Input placeholder="1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="COMPOOLLOC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Pool Location</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Directions to community pool"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="CLUBHOUSE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clubhouse Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Clubhouse location and access information"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="MANAGEREMAIL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="manager@property.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="MANAGERTXT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Phone/Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="555-0123" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="CHECKIN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-in Time</FormLabel>
                          <FormControl>
                            <Input placeholder="4pm (or 1600)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="CHECKOUT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-out Time</FormLabel>
                          <FormControl>
                            <Input placeholder="11am (or 1100)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <CardTitle>Policies & Rules</CardTitle>
                  <CardDescription>Delivery, pet, and parking policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="DELIVERYINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Package delivery procedures and restrictions"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PET"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Pet policy and restrictions"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PARKINGINFO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parking Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parking rules and vehicle restrictions"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Saving..." : property ? "Update Property" : "Create Property"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}