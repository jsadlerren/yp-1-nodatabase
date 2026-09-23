import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleMapsAddressPicker } from '../components/GoogleMapsAddressPicker';
import {
  ShieldCheck,
  Users,
  Package,
  DollarSign,
  Images,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
  MapPin,
  Truck,
  ExternalLink,
  Search,
  Sliders,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserAccount, Order, ProductPrice, DeliveryAddress, PrintFinish, OrderStatus } from '../types';

export const AdminView: React.FC = () => {
  const {
    users,
    orders,
    products,
    updateProductPrice,
    addProduct,
    deleteProduct,
    updateUser,
    updateUserAddress,
    deleteUser,
    removeUserPhoto,
    addUserPhoto,
    updateOrder,
    setCurrentPage,
    setSelectedOrderId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'prices' | 'photos'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing User State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userAddressEdit, setUserAddressEdit] = useState<DeliveryAddress | null>(null);

  // Editing Order State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Adding/Editing Product State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<ProductPrice, 'id'>>({
    name: 'Gallery Metal Print 11" x 14"',
    size: '11x14"',
    finish: 'metallic',
    price: 24.99,
    description: 'High-definition dye-sublimation on coated aluminum.',
    popular: false,
  });

  // KPI Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPhotosUploaded = users.reduce((sum, u) => sum + u.uploadedPhotos.length, 0);

  // Filtered Users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.dhlTrackingNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
    });
    if (userAddressEdit) {
      updateUserAddress(editingUser.id, userAddressEdit);
    }
    setEditingUser(null);
    setUserAddressEdit(null);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder.id, {
      status: editingOrder.status,
      dhlTrackingNo: editingOrder.dhlTrackingNo,
      customerName: editingOrder.customerName,
      customerEmail: editingOrder.customerEmail,
      shippingAddress: editingOrder.shippingAddress,
    });
    setEditingOrder(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setIsAddingProduct(false);
  };

  return (
    <div className="pb-36 pt-6 max-w-7xl mx-auto px-4">
      {/* Admin Title & KPI Cards */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Admin Control Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage users, modify addresses, inspect uploaded photos, update orders & DHL tracking, and edit product pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Go to Storefront
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ${totalRevenue.toFixed(2)}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">
              {orders.length} orders processed
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Active Users</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {users.length}
            </p>
            <span className="text-[11px] text-slate-500">Registered customers</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Photos Archived</span>
              <Images className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalPhotosUploaded}
            </p>
            <span className="text-[11px] text-slate-500">In customer vaults</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Catalog Products</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {products.length}
            </p>
            <span className="text-[11px] text-slate-500">Active print formats</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 mb-6">
        <div className="flex gap-2 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`pb-3 border-b-2 px-3 transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 px-3 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`pb-3 border-b-2 px-3 transition-all flex items-center gap-2 ${
              activeTab === 'prices'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Product Prices ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`pb-3 border-b-2 px-3 transition-all flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>All User Photos Vault</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative pb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, order, tracking..."
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                User Accounts & Assigned Records
              </span>
              <span className="text-slate-500">
                Click "Edit User & Address" to edit profile and delivery destination
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Shipping Address</th>
                    <th className="py-3 px-4 text-center">Photos Vault</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {user.address ? (
                          <div className="text-[11px] text-slate-600 truncate">
                            <p className="font-medium text-slate-800">{user.address.street}</p>
                            <p className="text-slate-500">
                              {user.address.city}, {user.address.state} {user.address.zipCode}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No address set</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md font-mono">
                          {user.uploadedPhotos.length} photos
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(user);
                            setUserAddressEdit(
                              user.address || {
                                fullName: user.name,
                                street: '',
                                city: '',
                                state: '',
                                zipCode: '',
                                country: 'United States',
                                lat: 40.7128,
                                lng: -74.006,
                              }
                            );
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Address & Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete user ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit User & Address Modal */}
          {editingUser && userAddressEdit && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-base text-slate-900">
                    Edit User Profile & Delivery Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, name: e.target.value })
                        }
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                        }
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Role
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as 'user' | 'admin',
                        })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    >
                      <option value="user">Customer (User)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      Edit User Shipping Address
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={userAddressEdit.street}
                          onChange={(e) =>
                            setUserAddressEdit({ ...userAddressEdit, street: e.target.value })
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={userAddressEdit.city}
                            onChange={(e) =>
                              setUserAddressEdit({ ...userAddressEdit, city: e.target.value })
                            }
                            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={userAddressEdit.state}
                            onChange={(e) =>
                              setUserAddressEdit({ ...userAddressEdit, state: e.target.value })
                            }
                            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={userAddressEdit.zipCode}
                            onChange={(e) =>
                              setUserAddressEdit({ ...userAddressEdit, zipCode: e.target.value })
                            }
                            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>

                      {/* Interactive Google Map in Admin view */}
                      <div>
                        <GoogleMapsAddressPicker
                          address={userAddressEdit}
                          onAddressChange={(updated) => setUserAddressEdit(updated)}
                          interactive={true}
                          height="200px"
                          zoom={13}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">
                All Orders & DHL Deliveries
              </span>
              <span className="text-slate-500">
                Update delivery address, tracking numbers, and fulfillment status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order No & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">DHL Tracking</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-700 block">
                          {ord.orderNo}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-500">{ord.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-800 block text-[11px]">
                          {ord.dhlTrackingNo}
                        </span>
                        <span className="text-[10px] text-amber-700">
                          {ord.shippingMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingOrder(ord)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Edit Order
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setCurrentPage('invoice');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Order Modal */}
          {editingOrder && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-base text-slate-900">
                    Edit Order: {editingOrder.orderNo}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Printed">Printed</option>
                      <option value="Handed to DHL">Handed to DHL</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      DHL Tracking Number
                    </label>
                    <input
                      type="text"
                      value={editingOrder.dhlTrackingNo}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          dhlTrackingNo: e.target.value,
                        })
                      }
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Full Name
                    </label>
                    <input
                      type="text"
                      value={editingOrder.customerName}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                      Edit Shipping Address for this Order
                    </h4>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress.street}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: {
                            ...editingOrder.shippingAddress,
                            street: e.target.value,
                          },
                        })
                      }
                      placeholder="Street"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingOrder.shippingAddress.city}
                        onChange={(e) =>
                          setEditingOrder({
                            ...editingOrder,
                            shippingAddress: {
                              ...editingOrder.shippingAddress,
                              city: e.target.value,
                            },
                          })
                        }
                        placeholder="City"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                      />
                      <input
                        type="text"
                        value={editingOrder.shippingAddress.zipCode}
                        onChange={(e) =>
                          setEditingOrder({
                            ...editingOrder,
                            shippingAddress: {
                              ...editingOrder.shippingAddress,
                              zipCode: e.target.value,
                            },
                          })
                        }
                        placeholder="ZIP"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Save Order Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRICE OF PRODUCTS */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Photo Print Catalog & Pricing Management
              </h3>
              <p className="text-xs text-slate-500">
                Edit prices for print formats, paper finishes, or create custom product offerings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingProduct(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product Format</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{prod.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Size: {prod.size} • Finish: {prod.finish.toUpperCase()}
                      </span>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {prod.finish}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                </div>

                {/* Price input controller */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500">Price: $</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.05"
                      value={prod.price}
                      onChange={(e) => updateProductPrice(prod.id, parseFloat(e.target.value) || 0)}
                      className="w-24 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (products.length > 1 && confirm(`Delete product ${prod.name}?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Product Modal */}
          {isAddingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-base text-slate-900">Add New Print Product</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Dimensions (e.g. 11x14")
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.size}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, size: e.target.value })
                        }
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Paper Finish
                      </label>
                      <select
                        value={newProduct.finish}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            finish: e.target.value as PrintFinish,
                          })
                        }
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 capitalize"
                      >
                        <option value="glossy">Glossy</option>
                        <option value="matte">Matte</option>
                        <option value="canvas">Canvas</option>
                        <option value="metallic">Metallic</option>
                        <option value="luster">Luster</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Create Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ALL USER PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                User Photo Archives Management
              </h3>
              <p className="text-xs text-slate-500">
                Review all photos uploaded by users across the system. Delete or audit user photo assets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {users.flatMap((u) =>
              u.uploadedPhotos.map((photo) => (
                <div
                  key={`${u.id}_${photo.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-950">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove photo ${photo.name} from user ${u.name}?`)) {
                          removeUserPhoto(u.id, photo.id);
                        }
                      }}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete photo from user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2 text-[11px]">
                    <p className="font-semibold text-slate-900 truncate">{photo.name}</p>
                    <p className="text-slate-400 truncate text-[10px]">User: {u.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
