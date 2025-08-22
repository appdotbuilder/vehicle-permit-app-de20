import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    permits_count: number;
    created_at: string;
}

interface Props {
    employees: {
        data: Employee[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    stats: {
        total_employees: number;
        total_permits: number;
        pending_permits: number;
        departments: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function GeneralPanel({ employees, stats, flash }: Props) {
    const [exportParams, setExportParams] = useState({
        start_date: '',
        end_date: '',
    });

    const handleExport = () => {
        router.post(route('admin.export'), exportParams);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="⚙️ General Admin Panel - Employee Management" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">⚙️ General Admin Panel</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.visit('/')}>
                                    🏠 Home
                                </Button>
                                <Button variant="outline" onClick={() => router.visit('/admin/hr')}>
                                    🏢 HR Panel
                                </Button>
                                <Button onClick={() => router.visit('/dashboard')}>
                                    📊 Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">👥 Total Employees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_employees}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-blue-600">🚗 Total Permits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{stats.total_permits}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-600">⏳ Pending Permits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending_permits}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-purple-600">🏢 Departments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">{stats.departments}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Export Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>📊 Export Historical Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <Label htmlFor="start_date">Start Date (Optional)</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={exportParams.start_date}
                                        onChange={(e) => setExportParams(prev => ({ ...prev, start_date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">End Date (Optional)</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={exportParams.end_date}
                                        onChange={(e) => setExportParams(prev => ({ ...prev, end_date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Button onClick={handleExport} className="w-full">
                                        📥 Download Excel Report
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Leave dates empty to export all historical data. The report includes all permit requests with employee details.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Employee Management */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>👥 Employee Management</CardTitle>
                            <Button onClick={() => router.visit(route('employees.create'))}>
                                ➕ Add Employee
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Grade</TableHead>
                                            <TableHead>Permits</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employees.data.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-medium">
                                                    {employee.employee_id}
                                                </TableCell>
                                                <TableCell>
                                                    {employee.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                                                        {employee.department}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {employee.grade}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                                                        {employee.permits_count} permits
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(employee.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => router.visit(route('employees.show', employee.id))}
                                                        >
                                                            👁️ View
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => router.visit(route('employees.edit', employee.id))}
                                                        >
                                                            ✏️ Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this employee?')) {
                                                                    router.delete(route('employees.destroy', employee.id));
                                                                }
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                
                                {employees.data.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No employees found. 
                                        <Button 
                                            variant="link" 
                                            onClick={() => router.visit(route('employees.create'))}
                                            className="ml-2"
                                        >
                                            Add the first employee
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}