"use client";

import { useEffect, useState } from "react";
import { Settings, Bell, Shield, Save, User, Lock, Phone, Mail, Loader2, CheckCircle2, AlertCircle, Trash2, AlertTriangle } from "lucide-react";
import { getCurrentUser, updateMyProfile, deleteMyProfile } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TechnicianSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Account details states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification switches states
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [instantPayouts, setInstantPayouts] = useState(true);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Feedback banners
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadUserSettings() {
      try {
        setLoading(true);
        const me = await getCurrentUser();
        if (me) {
          setName(me.name || "");
          setEmail(me.email || "");
          setPhone(me.phone || "");
        }
      } catch {
        /* Keep defaults */
      } finally {
        setLoading(false);
      }
    }
    loadUserSettings();
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAccount(true);
      setErrorMsg("");
      setSuccessMsg("");

      await updateMyProfile({
        name,
        email,
        phone,
      });

      setSuccessMsg("Account profile details updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update account details.");
    } finally {
      setSavingAccount(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      setErrorMsg("");
      setSuccessMsg("");

      await updateMyProfile({
        password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Password changed successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteMyProfile();
      router.push("/login");
    } catch (err: any) {
      alert(err?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Technician Account & Settings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Manage job dispatch notifications, contact information, and security credentials.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading account settings...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Profile Details */}
          <form onSubmit={handleUpdateAccount} className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <User className="h-4 w-4 text-amber-500" />
              <span>Personal Account Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Number / Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingAccount}
                className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
              >
                {savingAccount ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Save className="h-4 w-4 text-amber-400" />}
                <span>Save Profile Info</span>
              </button>
            </div>
          </form>

          {/* Change Security Password */}
          <form onSubmit={handleChangePassword} className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>Change Security Password</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
              >
                {savingPassword ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Lock className="h-4 w-4 text-amber-400" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Dispatch Notifications */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Bell className="h-4 w-4 text-amber-500" />
              <span>Dispatch Notifications & Preferences</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-stone-900">SMS Job Dispatch Alerts</span>
                  <span className="text-[11px] text-stone-400">Get instant text alerts when a new job dispatch is assigned to you.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-stone-900">Email Booking Summaries</span>
                  <span className="text-[11px] text-stone-400">Receive daily summary emails of customer appointments and schedules.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailSummaries}
                  onChange={(e) => setEmailSummaries(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-stone-900">Payout & Settlement Receipts</span>
                  <span className="text-[11px] text-stone-400">Get automatic receipts when bank deposit settlements complete.</span>
                </div>
                <input
                  type="checkbox"
                  checked={instantPayouts}
                  onChange={(e) => setInstantPayouts(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone / Delete Account */}
          <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-5 sm:p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-rose-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-rose-600" />
              <span>Account Management & Danger Zone</span>
            </h3>
            <p className="text-xs text-rose-700 font-medium">
              Permanently delete your technician account and remove your service catalog from the platform.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-rose-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-stone-900">Delete Account?</h3>
              <p className="mt-1 text-xs text-stone-500 font-medium">
                This action is permanent. All your service offerings, job history, and ratings will be erased.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 justify-center">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

