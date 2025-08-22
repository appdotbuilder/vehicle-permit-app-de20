import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    permits_count?: number;
    created_at: string;
}

interface Props {
    employees: {
        data: Employee[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    [key: string]: unknown;
}

export default function EmployeesIndex({ employees }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="👥 Employees" />
            <AppShell>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">👥 Employees</h1>
                            <p className="text-gray-600">Manage employee information</p>
                        </div>
                        <Button onClick={() => router.visit(route('employees.create'))}>
                            ➕ Add Employee
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Grade</TableHead>
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
            </AppShell>
        </>
    );
}