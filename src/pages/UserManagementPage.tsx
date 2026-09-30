import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSecurity } from '../context/SecurityContext';
import { UserCheck, Plus, UserX, Shield, Edit2, Search } from 'lucide-react';
import { Modal } from '../components/common/Modal';

const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'Sarah Connor', email: 'admin@worldmonitor.demo', role: 'Security Administrator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', status: 'Active', lastActive: 'Just now' },
  { id: 'usr-2', name: 'Alex Rivera', email: 'analyst@worldmonitor.demo', role: 'Security Analyst', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', status: 'Active', lastActive: '5m ago' },
  { id: 'usr-3', name: 'Morgan Vance', email: 'viewer@worldmonitor.demo', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', status: 'Active', lastActive: '12m ago' },
  { id: 'usr-4', name: 'Jordan Smith', email: 'jordan.smith@worldmonitor.demo', role: 'Security Analyst', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', status: 'Active', lastActive: '2h ago' },
  { id: 'usr-5', name: 'Taylor Reed', email: 'taylor.reed@worldmonitor.demo', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80', status: 'Suspended', lastActive: '3d ago' },
];

export const UserManagementPage: React.FC = () => {
  const { currentRole } = useAuth();
  const { logAuditEvent } = useSecurity();

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Security Analyst');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'usr-' + (users.length + 1),
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      status: 'Active',
      lastActive: 'Just now',
    };
    setUsers(prev => [...prev, newUser]);
    logAuditEvent('Created User Account', `${newUser.name} (${newUser.role})`, 'Success');
    setModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const toggleUserStatus = (user: User) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    logAuditEvent(`${nextStatus === 'Active' ? 'Re-enabled' : 'Disabled'} User Account`, user.email, 'Success');
  };

  const handleUpdateRole = (user: User, newRoleVal: UserRole) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRoleVal } : u));
    logAuditEvent(`Updated Role to ${newRoleVal}`, user.email, 'Success');
    setEditUser(null);
  };

  if (currentRole !== 'Security Administrator') {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
        <Shield className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          User management and role provisioning require the <strong>Security Administrator</strong> operational persona. Use the role switcher in the top navigation bar to switch personas for this demo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyan-400" />
            User Management & RBAC
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision analyst and operator access with role segregation (Administrator, Analyst, Viewer)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operators by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Users Table (Section 26) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3.5 px-4">Operator Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                      />
                      <span className="font-semibold text-white">{user.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-cyan-300">
                    {user.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-200">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        user.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {user.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Role</span>
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`px-2.5 py-1 rounded text-[11px] border transition-colors inline-flex items-center gap-1 ${
                        user.status === 'Active'
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      <UserX className="w-3 h-3" />
                      <span>{user.status === 'Active' ? 'Disable' : 'Enable'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision New Operator Account"
        subtitle="Create an authorized identity for platform operations"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dana Scully"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Corporate Email
            </label>
            <input
              type="email"
              required
              placeholder="dana.scully@worldmonitor.demo"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Initial Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Security Administrator">Security Administrator</option>
              <option value="Security Analyst">Security Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      {editUser && (
        <Modal
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          title={`Edit Role: ${editUser.name}`}
          subtitle={editUser.email}
        >
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Updated Operational Persona
            </label>
            <div className="space-y-2">
              {(['Security Administrator', 'Security Analyst', 'Viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleUpdateRole(editUser, r)}
                  className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    editUser.role === r
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{r}</span>
                  {editUser.role === r && <span className="text-cyan-400 font-mono text-xs">Current</span>}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
