// Property Dashboard Component for Vercel Deployment
// Main dashboard showing properties table and management interface

"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "./vercel-property-form";
import type { Property, DashboardStats } from "./vercel-property-schema";

interface PropertyDashboardProps {
  properties: Property[];
  stats: DashboardStats;
  onCreateProperty: (property: any) => void;
  onUpdateProperty: (unitId: string, property: any) => void;
  onDeleteProperty: (unitId: string) => void;
  isLoading?: boolean;
}

export function PropertyDashboard({ 
  properties, 
  stats, 
  onCreateProperty, 
  onUpdateProperty, 
  onDeleteProperty,
  isLoading = false 
}: PropertyDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.UNITID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.MANAGEREMAIL && property.MANAGEREMAIL.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setShowEditDialog(true);
  };

  const handleCreateSubmit = (data: any) => {
    onCreateProperty(data);
    setShowCreateDialog(false);
  };

  const handleEditSubmit = (data: any) => {
    if (selectedProperty) {
      onUpdateProperty(selectedProperty.UNITID, data);
      setShowEditDialog(false);
      setSelectedProperty(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary", 
      draft: "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProperties}</div>
            <p className="text-xs text-muted-foreground">
              Properties currently accepting guests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.voiceCallsToday}</div>
            <p className="text-xs text-muted-foreground">
              Guest support interactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Voice assistant response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfactionScore}</div>
            <p className="text-xs text-muted-foreground">
              Guest satisfaction rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Properties</CardTitle>
              <CardDescription>
                Manage your vacation rental properties and voice assistant settings
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Unit ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Properties Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Network Name</TableHead>
                  <TableHead>Manager Email</TableHead>
                  <TableHead>Voice Calls</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {properties.length === 0 ? (
                        <div className="text-muted-foreground">
                          <p className="text-lg font-medium mb-2">No properties yet</p>
                          <p>Create your first property to get started with voice assistance</p>
                          <Button 
                            onClick={() => setShowCreateDialog(true)}
                            className="mt-4"
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Property
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No properties match your search criteria</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.UNITID}>
                      <TableCell className="font-medium">{property.UNITID}</TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell>{property.NETWORKNAME}</TableCell>
                      <TableCell>{property.MANAGEREMAIL || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {property.voiceCallsThisWeek || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.CHECKIN}</TableCell>
                      <TableCell>{property.CHECKOUT}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(property)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDeleteProperty(property.UNITID)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Property Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Property</DialogTitle>
          </DialogHeader>
          <PropertyForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setShowCreateDialog(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <PropertyForm
              property={selectedProperty}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedProperty(null);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}