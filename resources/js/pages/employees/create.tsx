import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateEmployee() {
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        department: '',
        grade: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('employees.store'), formData, {
            preserveScroll: true,
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const departments = [
        'IT',
        'HR', 
        'Finance',
        'Operations',
        'Marketing',
        'Sales',
        'Administration',
        'Security',
        'Legal',
        'Other',
    ];

    const grades = [
        'Intern',
        'Junior',
        'Senior',
        'Lead',
        'Manager',
        'Senior Manager',
        'Director',
        'Senior Director',
        'VP',
        'SVP',
    ];

    return (
        <>
            <Head title="➕ Add Employee" />
            <AppShell>
                <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">➕ Add Employee</h1>
                        <p className="text-gray-600">Create a new employee record</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="employee_id">Employee ID *</Label>
                                    <Input
                                        id="employee_id"
                                        type="text"
                                        value={formData.employee_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                                        placeholder="Enter employee ID (e.g., EMP001)"
                                        className={errors.employee_id ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.employee_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.employee_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter full name"
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="department">Department *</Label>
                                    <Select value={formData.department} onValueChange={(value) => 
                                        setFormData(prev => ({ ...prev, department: value }))
                                    }>
                                        <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.department && (
                                        <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="grade">Grade *</Label>
                                    <Select value={formData.grade} onValueChange={(value) => 
                                        setFormData(prev => ({ ...prev, grade: value }))
                                    }>
                                        <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.grade && (
                                        <p className="text-sm text-red-600 mt-1">{errors.grade}</p>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('employees.index'))}
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing ? 'Creating...' : '✅ Create Employee'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        </>
    );
}