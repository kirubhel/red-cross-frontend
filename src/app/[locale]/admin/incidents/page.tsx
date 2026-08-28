"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Search, Filter, AlertTriangle, CheckCircle, FileText } from "lucide-react";

interface Incident {
  id: string;
  person_id: string;
  reporter_id: string;
  incident_date: string;
  incident_type: string;
  location: string;
  narrative: string;
  confidentiality_level: string;
  medical_followup: string;
  status: string;
  created_at: string;
}

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    person_id: "",
    incident_date: new Date().toISOString().split("T")[0],
    incident_type: "ACCIDENT",
    location: "",
    narrative: "",
    confidentiality_level: "RESTRICTED",
    medical_followup: "",
  });

  useEffect(() => {
    fetchIncidents();
  }, [filterType]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = filterType
        ? `/api/v1/incidents?confidentiality=${filterType}`
        : "/api/v1/incidents";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch (err) {
      console.error("Failed to load incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          person_id: "",
          incident_date: new Date().toISOString().split("T")[0],
          incident_type: "ACCIDENT",
          location: "",
          narrative: "",
          confidentiality_level: "RESTRICTED",
          medical_followup: "",
        });
        fetchIncidents();
      }
    } catch (err) {
      console.error("Error creating incident:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            Volunteer Protection & Incident Records
          </h1>
          <p className="text-sm text-gray-500">
            Confidential incident logging, medical follow-up, and protection case management.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus className="h-4 w-4" /> Log Incident Record
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4 text-gray-400" />
          <span>Confidentiality Filter:</span>
        </div>
        {["", "PUBLIC", "INTERNAL", "RESTRICTED"].map((level) => (
          <button
            key={level}
            onClick={() => setFilterType(level)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === level
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {level === "" ? "All Levels" : level}
          </button>
        ))}
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading incident reports...</div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No incident records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-100 font-medium">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Narrative</th>
                  <th className="py-3 px-4">Confidentiality</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">
                      {inc.incident_date ? inc.incident_date.split("T")[0] : inc.created_at?.split("T")[0]}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{inc.incident_type}</td>
                    <td className="py-3 px-4 text-gray-600">{inc.location || "N/A"}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-600">{inc.narrative}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          inc.confidentiality_level === "RESTRICTED"
                            ? "bg-red-100 text-red-800"
                            : inc.confidentiality_level === "INTERNAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {inc.confidentiality_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" /> Log Confidential Incident Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Person ID / Volunteer UUID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.person_id}
                  onChange={(e) => setFormData({ ...formData, person_id: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Incident Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Incident Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={formData.incident_type}
                    onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
                  >
                    <option value="ACCIDENT">Accident</option>
                    <option value="PROTECTION_ISSUE">Protection Issue</option>
                    <option value="HEALTH_EMERGENCY">Health Emergency</option>
                    <option value="PSS_REFERRAL">PSS Referral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location / Branch</label>
                <input
                  type="text"
                  placeholder="Location or field site"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Incident Narrative</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed description of what occurred..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.narrative}
                  onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confidentiality Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.confidentiality_level}
                  onChange={(e) => setFormData({ ...formData, confidentiality_level: e.target.value })}
                >
                  <option value="PUBLIC">Public</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="RESTRICTED">Restricted (DPO / Protection Team Only)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                >
                  Save Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
