import { useEffect, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  Download,
  DollarSign,
  Percent,
  Store,
  Clock,
  X,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RestaurantService,
  type Restaurant,
} from "@/services/restaurant.service";
import {
  CalculationService,
  type TipCalculation,
} from "@/services/calculation.service";

type SortField = "date" | "restaurant" | "billAmount" | "tipPercentage" | "totalTip";
type SortOrder = "asc" | "desc";

export function Tips() {
  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<TipCalculation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<TipCalculation[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState<TipCalculation | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    restaurantId: 0,
    billAmount: 0,
    tipPercentage: 15,
    numberOfPeople: 1,
    totalTip: 0,
    totalBill: 0,
    perPerson: 0,
    notes: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredCalculations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCalculations = filteredCalculations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Statistics
  const [stats, setStats] = useState({
    totalTips: 0,
    averageTip: 0,
    averagePercentage: 0,
    totalVisits: 0,
    totalBillAmount: 0,
  });

  const restaurantService = new RestaurantService();
  const calculationService = new CalculationService();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [calculations, searchTerm, selectedRestaurant, sortField, sortOrder, dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [calcData, restaurantData] = await Promise.all([
        calculationService.findAll(),
        restaurantService.findAll(),
      ]);

      setCalculations(calcData);
      setRestaurants(restaurantData);
      calculateStats(calcData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load tips data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: TipCalculation[]) => {
    const totalTips = data.reduce((sum, calc) => sum + calc.totalTip, 0);
    const totalBillAmount = data.reduce((sum, calc) => sum + calc.billAmount, 0);
    const averageTip = data.length > 0 ? totalTips / data.length : 0;
    const averagePercentage = data.length > 0
      ? data.reduce((sum, calc) => sum + calc.tipPercentage, 0) / data.length
      : 0;

    setStats({
      totalTips,
      averageTip,
      averagePercentage,
      totalVisits: data.length,
      totalBillAmount,
    });
  };

  const applyFilters = () => {
    let filtered = [...calculations];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (calc) =>
          calc.notes?.toLowerCase().includes(term) ||
          getRestaurantName(calc.restaurantId).toLowerCase().includes(term)
      );
    }

    // Restaurant filter
    if (selectedRestaurant !== "all") {
      filtered = filtered.filter(
        (calc) => calc.restaurantId === selectedRestaurant
      );
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (calc) => calc.createdAt.split("T")[0] >= dateRange.from
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (calc) => calc.createdAt.split("T")[0] <= dateRange.to
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "date":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "restaurant":
          aVal = getRestaurantName(a.restaurantId);
          bVal = getRestaurantName(b.restaurantId);
          break;
        case "billAmount":
          aVal = a.billAmount;
          bVal = b.billAmount;
          break;
        case "tipPercentage":
          aVal = a.tipPercentage;
          bVal = b.tipPercentage;
          break;
        case "totalTip":
          aVal = a.totalTip;
          bVal = b.totalTip;
          break;
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCalculations(filtered);
    setCurrentPage(1);
  };

  const handleCalculate = () => {
    const tipAmount = (formData.billAmount * formData.tipPercentage) / 100;
    const totalWithTip = formData.billAmount + tipAmount;
    const perPerson = formData.numberOfPeople > 0 
      ? totalWithTip / formData.numberOfPeople 
      : 0;

    setFormData({
      ...formData,
      totalTip: parseFloat(tipAmount.toFixed(2)),
      totalBill: parseFloat(totalWithTip.toFixed(2)),
      perPerson: parseFloat(perPerson.toFixed(2)),
    });
  };

  const handleCreate = async () => {
    if (!formData.restaurantId || !formData.billAmount) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    try {
      const id = await calculationService.create({
        restaurantId: formData.restaurantId,
        billAmount: formData.billAmount,
        tipPercentage: formData.tipPercentage,
        numberOfPeople: formData.numberOfPeople,
        totalTip: formData.totalTip,
        totalBill: formData.totalBill,
        perPerson: formData.perPerson,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      });

      // Fetch the created calculation to get the full object
      const created = await calculationService.findById(id);
      if (created) {
        setCalculations([created, ...calculations]);
      }
      
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Tip added successfully!");
    } catch (error) {
      console.error("Failed to create tip:", error);
      toast.error("Failed to add tip. Please try again.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCalculation?.id) return;
    try {
      await calculationService.update(selectedCalculation.id, {
        billAmount: selectedCalculation.billAmount,
        tipPercentage: selectedCalculation.tipPercentage,
        numberOfPeople: selectedCalculation.numberOfPeople,
        totalTip: selectedCalculation.totalTip,
        totalBill: selectedCalculation.totalBill,
        perPerson: selectedCalculation.perPerson,
        notes: selectedCalculation.notes || "",
        createdAt: selectedCalculation.createdAt,
      });

      await loadData();
      setIsViewSheetOpen(false);
      setIsEditMode(false);
      setSelectedCalculation(null);
      toast.success("Tip updated successfully!");
    } catch (error) {
      console.error("Failed to update tip:", error);
      toast.error("Failed to update tip. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tip?")) return;
    try {
      await calculationService.delete(id);
      setIsViewSheetOpen(false);
      setSelectedCalculation(null);
      await loadData();
      toast.success("Tip deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tip:", error);
      toast.error("Failed to delete tip. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      restaurantId: 0,
      billAmount: 0,
      tipPercentage: 15,
      numberOfPeople: 1,
      totalTip: 0,
      totalBill: 0,
      perPerson: 0,
      notes: "",
    });
  };

  const openViewSheet = (calculation: TipCalculation) => {
    setSelectedCalculation(calculation);
    setIsEditMode(false);
    setIsViewSheetOpen(true);
  };

  const openEditSheet = (calculation: TipCalculation) => {
    setSelectedCalculation(calculation);
    setIsEditMode(true);
    setIsViewSheetOpen(true);
  };

  const getRestaurantName = (restaurantId: number) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.name || "Unknown Restaurant";
  };

  const getRestaurantTipPercentage = (restaurantId: number) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.tipPercentage || 0;
  };

  const formatCurrency = (amount: number, restaurantId?: number) => {
    let currencySymbol = "$";
    if (restaurantId) {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      currencySymbol = restaurant?.currency || "$";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportCSV = () => {
    if (filteredCalculations.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Date",
      "Restaurant",
      "Bill Amount",
      "Tip %",
      "Tip Amount",
      "Total Bill",
      "People",
      "Per Person",
      "Notes",
    ];

    const rows = filteredCalculations.map((calc) => [
      formatDate(calc.createdAt),
      getRestaurantName(calc.restaurantId),
      calc.billAmount.toFixed(2),
      calc.tipPercentage.toFixed(1),
      calc.totalTip.toFixed(2),
      calc.totalBill.toFixed(2),
      calc.numberOfPeople,
      calc.perPerson.toFixed(2),
      calc.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tips_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRestaurant("all");
    setDateRange({ from: "", to: "" });
    setSortField("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tips</h2>
          <p className="text-muted-foreground">
            Manage and track all your restaurant tips
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {Object.values(dateRange).some(v => v) && (
              <Badge variant="secondary" className="ml-2">Active</Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tip
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Total Tips</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(stats.totalTips)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Average Tip</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(stats.averageTip)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Percent className="h-4 w-4" />
              <span className="text-sm font-medium">Avg Tip %</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {stats.averagePercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total Visits</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {stats.totalVisits}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by restaurant or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={String(selectedRestaurant)}
                onValueChange={(value) => 
                  setSelectedRestaurant(value === "all" ? "all" : Number(value))
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Restaurants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Restaurants</SelectItem>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="w-[150px]"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                placeholder="From"
              />
              <Input
                type="date"
                className="w-[150px]"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                placeholder="To"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[130px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortField("date")}>
                    Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("restaurant")}>
                    Restaurant {sortField === "restaurant" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("billAmount")}>
                    Bill Amount {sortField === "billAmount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("tipPercentage")}>
                    Tip % {sortField === "tipPercentage" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("totalTip")}>
                    Tip Amount {sortField === "totalTip" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead className="text-right">Bill</TableHead>
              <TableHead className="text-right">Tip %</TableHead>
              <TableHead className="text-right">Tip</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Per Person</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCalculations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {calculations.length === 0
                    ? "No tips yet. Start tracking your tips!"
                    : "No tips match your filters. Try adjusting them."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCalculations.map((calculation) => (
                <TableRow key={calculation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(calculation.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      {getRestaurantName(calculation.restaurantId)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(calculation.billAmount, calculation.restaurantId)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {calculation.tipPercentage}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(calculation.totalTip, calculation.restaurantId)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(calculation.totalBill, calculation.restaurantId)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(calculation.perPerson, calculation.restaurantId)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openViewSheet(calculation)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditSheet(calculation)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => calculation.id && handleDelete(calculation.id)}
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

        {/* Pagination */}
        {!loading && filteredCalculations.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredCalculations.length)} of{" "}
              {filteredCalculations.length} entries
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Tip</DialogTitle>
            <DialogDescription>
              Enter the tip details below. All fields with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Restaurant *</Label>
              <Select
                value={String(formData.restaurantId)}
                onValueChange={(value) => {
                  const id = Number(value);
                  const tipPercent = getRestaurantTipPercentage(id);
                  setFormData({ 
                    ...formData, 
                    restaurantId: id,
                    tipPercentage: tipPercent || 15
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                      {restaurant.name} ({restaurant.tipPercentage}% default)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bill Amount ($) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.billAmount || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, billAmount: value });
                }}
                onBlur={handleCalculate}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tip Percentage (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="15"
                  value={formData.tipPercentage || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, tipPercentage: value });
                  }}
                  onBlur={handleCalculate}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of People</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.numberOfPeople || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setFormData({ ...formData, numberOfPeople: value });
                  }}
                  onBlur={handleCalculate}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tip Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Calculated automatically"
                value={formData.totalTip || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Bill ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Calculated automatically"
                  value={formData.totalBill || ""}
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Per Person ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Calculated automatically"
                  value={formData.perPerson || ""}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                placeholder="Add any notes (optional)"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.restaurantId || !formData.billAmount}
            >
              Add Tip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <SheetTitle className="text-2xl font-semibold flex items-center gap-2">
              <span>{isEditMode ? "Edit" : "View"} Tip</span>
              {selectedCalculation && (
                <Badge variant="outline" className="text-xs font-normal">
                  ID: {selectedCalculation.id}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Update the tip details below."
                : "View tip details and manage this record."}
            </SheetDescription>
          </SheetHeader>

          {selectedCalculation && (
            <div className="space-y-6 py-6 px-4">
              {/* Restaurant */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Restaurant</Label>
                {isEditMode ? (
                  <Select
                    value={String(selectedCalculation.restaurantId)}
                    onValueChange={(value) => {
                      const id = Number(value);
                      const tipPercent = getRestaurantTipPercentage(id);
                      setSelectedCalculation({
                        ...selectedCalculation,
                        restaurantId: id,
                        tipPercentage: tipPercent || 15,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span>{getRestaurantName(selectedCalculation.restaurantId)}</span>
                  </div>
                )}
              </div>

              {/* Bill Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Bill Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedCalculation.billAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setSelectedCalculation({
                      ...selectedCalculation,
                      billAmount: value,
                    });
                  }}
                  disabled={!isEditMode}
                  className={!isEditMode ? "bg-muted/50" : ""}
                />
              </div>

              {/* Tip Percentage & People */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tip %</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedCalculation.tipPercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setSelectedCalculation({
                        ...selectedCalculation,
                        tipPercentage: value,
                      });
                    }}
                    disabled={!isEditMode}
                    className={!isEditMode ? "bg-muted/50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">People</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedCalculation.numberOfPeople}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setSelectedCalculation({
                        ...selectedCalculation,
                        numberOfPeople: value,
                      });
                    }}
                    disabled={!isEditMode}
                    className={!isEditMode ? "bg-muted/50" : ""}
                  />
                </div>
              </div>

              {/* Calculated Values */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Tip Amount</Label>
                  <div className="text-lg font-semibold font-mono">
                    {formatCurrency(selectedCalculation.totalTip, selectedCalculation.restaurantId)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Total Bill</Label>
                  <div className="text-lg font-semibold font-mono">
                    {formatCurrency(selectedCalculation.totalBill, selectedCalculation.restaurantId)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Per Person</Label>
                  <div className="text-lg font-semibold font-mono">
                    {formatCurrency(selectedCalculation.perPerson, selectedCalculation.restaurantId)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes</Label>
                <Input
                  value={selectedCalculation.notes || ""}
                  onChange={(e) =>
                    setSelectedCalculation({
                      ...selectedCalculation,
                      notes: e.target.value,
                    })
                  }
                  disabled={!isEditMode}
                  className={!isEditMode ? "bg-muted/50" : ""}
                  placeholder="No notes"
                />
              </div>

              {/* Timestamps */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                <p className="text-xs text-muted-foreground">
                  Created:{" "}
                  <span className="font-mono">
                    {formatDate(selectedCalculation.createdAt)}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {isEditMode ? (
                  <>
                    <Button className="flex-1" onClick={handleUpdate}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditMode(false);
                        loadData();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => setIsEditMode(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() =>
                        selectedCalculation.id &&
                        handleDelete(selectedCalculation.id)
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Helper component for sorting icon
function ArrowUpDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}
