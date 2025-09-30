import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, Activity, AlertTriangle, Settings, Plus, Edit, Trash2 } from "lucide-react";
import { SensorNode, Alert } from "@/hooks/useSensorData";

interface User {
  id: string;
  email: string;
  created_at: string;
  profiles?: {
    full_name: string;
    role: 'admin' | 'operator';
  };
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<SensorNode | null>(null);
  const [nodeForm, setNodeForm] = useState({ name: '', location: '', status: 'active' });

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          role,
          created_at
        `);

      if (error) throw error;
      const users = data?.map(profile => ({
        id: profile.user_id,
        email: 'user@example.com', // You'd need to fetch this from auth.users
        created_at: profile.created_at,
        profiles: {
          full_name: profile.full_name,
          role: profile.role as 'admin' | 'operator'
        }
      })) || [];
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchNodes = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_nodes')
        .select('*')
        .order('name');

      if (error) throw error;
      setNodes(data || []);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          sensor_nodes (name, location)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data as Alert[] || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'operator') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      await fetchUsers();
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const saveNode = async () => {
    try {
      if (editingNode) {
        const { error } = await supabase
          .from('sensor_nodes')
          .update(nodeForm)
          .eq('id', editingNode.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sensor_nodes')
          .insert(nodeForm);

        if (error) throw error;
      }

      await fetchNodes();
      setDialogOpen(false);
      setEditingNode(null);
      setNodeForm({ name: '', location: '', status: 'active' });
      toast({
        title: "Success",
        description: editingNode ? "Node updated successfully" : "Node created successfully",
      });
    } catch (error) {
      console.error('Error saving node:', error);
      toast({
        title: "Error",
        description: "Failed to save node",
        variant: "destructive",
      });
    }
  };

  const deleteNode = async (nodeId: string) => {
    try {
      const { error } = await supabase
        .from('sensor_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      await fetchNodes();
      toast({
        title: "Success",
        description: "Node deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting node:', error);
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchNodes(), fetchAlerts()]);
      setLoading(false);
    };

    loadData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have administrator privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, sensors, and system settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Total Users</div>
            </div>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Active Sensors</div>
            </div>
            <div className="text-2xl font-bold">{nodes.filter(n => n.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Unacknowledged Alerts</div>
            </div>
            <div className="text-2xl font-bold">{alerts.filter(a => !a.acknowledged).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">System Status</div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Nodes</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.profiles?.full_name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant={user.profiles?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.profiles?.role || 'operator'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          value={user.profiles?.role || 'operator'}
                          onValueChange={(value) => updateUserRole(user.id, value as 'admin' | 'operator')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sensor Nodes</CardTitle>
                  <CardDescription>Manage sensor node locations and settings</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingNode(null);
                      setNodeForm({ name: '', location: '', status: 'active' });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Node
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingNode ? 'Edit' : 'Add'} Sensor Node</DialogTitle>
                      <DialogDescription>
                        Configure sensor node details and location
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={nodeForm.name}
                          onChange={(e) => setNodeForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Main Sensor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={nodeForm.location}
                          onChange={(e) => setNodeForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Building A - Room 101"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={nodeForm.status}
                          onValueChange={(value) => setNodeForm(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={saveNode} className="w-full">
                        {editingNode ? 'Update' : 'Create'} Node
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-medium">{node.name}</TableCell>
                      <TableCell>{node.location}</TableCell>
                      <TableCell>
                        <Badge variant={node.status === 'active' ? 'default' : 'secondary'}>
                          {node.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingNode(node);
                              setNodeForm({ name: node.name, location: node.location || '', status: node.status });
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNode(node.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>Monitor and manage system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      <div>
                        <p className="font-medium">{alert.alert_type}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.sensor_nodes?.name} - {alert.sensor_nodes?.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(alert.created_at).toLocaleString()}</p>
                      {alert.acknowledged && (
                        <Badge variant="outline" className="mt-1">Acknowledged</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}