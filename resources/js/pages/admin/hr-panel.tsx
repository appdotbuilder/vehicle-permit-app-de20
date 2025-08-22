import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
}

interface VehiclePermit {
    id: number;
    employee: Employee;
    vehicle_type: string;
    license_plate: string;
    usage_start: string;
    usage_end: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected';
    hr_comments: string | null;
    created_at: string;
    hr_action_at: string | null;
}

interface Props {
    permits: {
        data: VehiclePermit[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function HRPanel({ permits, stats, flash }: Props) {
    const [selectedPermit, setSelectedPermit] = useState<VehiclePermit | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [comments, setComments] = useState('');
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⏳ Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Approved</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">❌ Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleAction = (permit: VehiclePermit, actionType: 'approve' | 'reject') => {
        setSelectedPermit(permit);
        setAction(actionType);
        setComments(permit.hr_comments || '');
    };

    const submitAction = () => {
        if (!selectedPermit || !action) return;

        setProcessing(true);

        router.put(route('permits.update', selectedPermit.id), {
            status: action === 'approve' ? 'approved' : 'rejected',
            hr_comments: comments,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedPermit(null);
                setAction(null);
                setComments('');
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="🏢 HR Admin Panel - Vehicle Permits" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">🏢 HR Admin Panel</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.visit('/')}>
                                    🏠 Home
                                </Button>
                                <Button variant="outline" onClick={() => router.visit('/admin/general')}>
                                    ⚙️ General Admin
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
                                <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-600">⏳ Pending</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-green-600">✅ Approved</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-red-600">❌ Rejected</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Permits Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🚗 Vehicle Permit Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Usage Period</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permits.data.map((permit) => (
                                            <TableRow key={permit.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{permit.employee.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {permit.employee.employee_id} • {permit.employee.department}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{permit.vehicle_type}</div>
                                                        <div className="text-sm text-gray-500">{permit.license_plate}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>Start: {formatDateTime(permit.usage_start)}</div>
                                                        <div>End: {formatDateTime(permit.usage_end)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs truncate" title={permit.purpose}>
                                                        {permit.purpose || 'No purpose specified'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(permit.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDateTime(permit.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {permit.status === 'pending' ? (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                                onClick={() => handleAction(permit, 'approve')}
                                                            >
                                                                ✅ Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                                onClick={() => handleAction(permit, 'reject')}
                                                            >
                                                                ❌ Reject
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">
                                                            {permit.hr_action_at && (
                                                                <>Actioned: {formatDateTime(permit.hr_action_at)}</>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                
                                {permits.data.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No permit requests found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Modal */}
                {selectedPermit && action && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>
                                    {action === 'approve' ? '✅ Approve' : '❌ Reject'} Permit Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm">
                                        <div><strong>Employee:</strong> {selectedPermit.employee.name}</div>
                                        <div><strong>Vehicle:</strong> {selectedPermit.vehicle_type} - {selectedPermit.license_plate}</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="comments">HR Comments (Optional)</Label>
                                    <Textarea
                                        id="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder={`Add comments for this ${action} action...`}
                                        rows={3}
                                    />
                                </div>
                                
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedPermit(null);
                                            setAction(null);
                                            setComments('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={submitAction}
                                        disabled={processing}
                                        className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                    >
                                        {processing ? 'Processing...' : `${action === 'approve' ? '✅ Approve' : '❌ Reject'}`}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}