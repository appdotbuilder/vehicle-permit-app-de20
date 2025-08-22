import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface EmployeeData {
    name: string;
    department: string;
    grade: string;
}

export default function Welcome({ flash }: Props) {
    const [formData, setFormData] = useState({
        employee_id: '',
        vehicle_type: '',
        license_plate: '',
        usage_start: '',
        usage_end: '',
        purpose: '',
    });
    
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchEmployeeData = async (employeeId: string) => {
        if (!employeeId.trim()) {
            setEmployeeData(null);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(route('employees.details', { employee_id: employeeId }));
            if (response.ok) {
                const data = await response.json();
                setEmployeeData(data);
                setErrors(prev => ({ ...prev, employee_id: '' }));
            } else {
                setEmployeeData(null);
                setErrors(prev => ({ ...prev, employee_id: 'Employee not found' }));
            }
        } catch {
            setEmployeeData(null);
            setErrors(prev => ({ ...prev, employee_id: 'Error fetching employee data' }));
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeIdChange = (value: string) => {
        setFormData(prev => ({ ...prev, employee_id: value }));
        
        // Debounce API call
        const timeoutId = setTimeout(() => {
            fetchEmployeeData(value);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(route('permits.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFormData({
                    employee_id: '',
                    vehicle_type: '',
                    license_plate: '',
                    usage_start: '',
                    usage_end: '',
                    purpose: '',
                });
                setEmployeeData(null);
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => {
                setSubmitting(false);
            },
        });
    };

    const vehicleTypes = [
        'Sedan',
        'SUV', 
        'Van',
        'Truck',
        'Motorcycle',
        'Bus',
        'Other',
    ];

    return (
        <>
            <Head title="🚗 Vehicle Usage Permits - Submit Your Request" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">🚗 Vehicle Usage Permits</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.visit('/admin/hr')}>
                                    🏢 HR Panel
                                </Button>
                                <Button variant="outline" onClick={() => router.visit('/admin/general')}>
                                    ⚙️ Admin Panel
                                </Button>
                                <Button onClick={() => router.visit('/login')}>
                                    🔐 Login
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex">
                                <div className="text-green-600 text-sm">
                                    ✅ {flash.success}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            🚙 Request Vehicle Usage Permit
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Submit your vehicle usage request easily. HR will receive instant notifications and process your request promptly.
                        </p>
                    </div>

                    {/* Features Overview */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">🆔 Auto-Fill Data</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-gray-600">
                                    Enter your employee ID and your details will be automatically filled from the database.
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">📱 Instant Notifications</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-gray-600">
                                    HR receives WhatsApp notifications immediately when you submit a request.
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">✅ Real-time Updates</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-gray-600">
                                    Get notified via WhatsApp when your request is approved or rejected.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Form */}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>🚗 Submit Vehicle Permit Request</CardTitle>
                            <CardDescription>
                                Fill out the form below to request a vehicle usage permit.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Employee ID */}
                                <div>
                                    <Label htmlFor="employee_id">Employee ID *</Label>
                                    <Input
                                        id="employee_id"
                                        type="text"
                                        value={formData.employee_id}
                                        onChange={(e) => handleEmployeeIdChange(e.target.value)}
                                        placeholder="Enter your employee ID (e.g., EMP001)"
                                        className={errors.employee_id ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.employee_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.employee_id}</p>
                                    )}
                                    {loading && (
                                        <p className="text-sm text-blue-600 mt-1">🔍 Looking up employee...</p>
                                    )}
                                </div>

                                {/* Employee Details (Auto-filled) */}
                                {employeeData && (
                                    <div className="bg-green-50 p-4 rounded-md border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-2">✅ Employee Found</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <Label className="text-green-700">Name</Label>
                                                <p className="font-medium">{employeeData.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-green-700">Department</Label>
                                                <p className="font-medium">{employeeData.department}</p>
                                            </div>
                                            <div>
                                                <Label className="text-green-700">Grade</Label>
                                                <p className="font-medium">{employeeData.grade}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Type */}
                                <div>
                                    <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                                    <Select value={formData.vehicle_type} onValueChange={(value) => 
                                        setFormData(prev => ({ ...prev, vehicle_type: value }))
                                    }>
                                        <SelectTrigger className={errors.vehicle_type ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicleTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_type && (
                                        <p className="text-sm text-red-600 mt-1">{errors.vehicle_type}</p>
                                    )}
                                </div>

                                {/* License Plate */}
                                <div>
                                    <Label htmlFor="license_plate">License Plate *</Label>
                                    <Input
                                        id="license_plate"
                                        type="text"
                                        value={formData.license_plate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
                                        placeholder="Enter license plate number"
                                        className={errors.license_plate ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.license_plate && (
                                        <p className="text-sm text-red-600 mt-1">{errors.license_plate}</p>
                                    )}
                                </div>

                                {/* Usage Start */}
                                <div>
                                    <Label htmlFor="usage_start">Usage Start Date & Time *</Label>
                                    <Input
                                        id="usage_start"
                                        type="datetime-local"
                                        value={formData.usage_start}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usage_start: e.target.value }))}
                                        className={errors.usage_start ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.usage_start && (
                                        <p className="text-sm text-red-600 mt-1">{errors.usage_start}</p>
                                    )}
                                </div>

                                {/* Usage End */}
                                <div>
                                    <Label htmlFor="usage_end">Usage End Date & Time *</Label>
                                    <Input
                                        id="usage_end"
                                        type="datetime-local"
                                        value={formData.usage_end}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usage_end: e.target.value }))}
                                        className={errors.usage_end ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.usage_end && (
                                        <p className="text-sm text-red-600 mt-1">{errors.usage_end}</p>
                                    )}
                                </div>

                                {/* Purpose */}
                                <div>
                                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                                    <Textarea
                                        id="purpose"
                                        value={formData.purpose}
                                        onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                                        placeholder="Describe the purpose of vehicle usage"
                                        rows={3}
                                        className={errors.purpose ? 'border-red-500' : ''}
                                    />
                                    {errors.purpose && (
                                        <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={submitting || !employeeData}
                                    size="lg"
                                >
                                    {submitting ? '📤 Submitting...' : '🚗 Submit Permit Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}