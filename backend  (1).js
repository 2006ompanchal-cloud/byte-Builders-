// ============================================================
// VENDORBRIDGE - BACKEND SERVER
// Tech: Node.js + Express + In-Memory Store (no DB needed)
// Run: node server.js   (or: npm start)
// Port: 4000
// ============================================================

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ── Request Logger ──────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================
// IN-MEMORY DATA STORE (replace with a DB in production)
// ============================================================

let users = [
  { id: 1, name: "Admin User", email: "admin@vendorbridge.com", password: "admin123", role: "Admin" },
];

let vendors = [
  { id: 1, name: "TechSupplies Co.", category: "IT Equipment", contact: "raj@techsupplies.com", phone: "9876543210", status: "Active", rating: 4.5, totalOrders: 12 },
  { id: 2, name: "Office Furniture Ltd.", category: "Furniture", contact: "priya@officefurn.com", phone: "9876543211", status: "Active", rating: 4.2, totalOrders: 8 },
  { id: 3, name: "Stationery World", category: "Stationery", contact: "amit@stationery.com", phone: "9876543212", status: "Inactive", rating: 3.8, totalOrders: 5 },
  { id: 4, name: "Hardware Hub", category: "Hardware", contact: "neha@hardwarehub.com", phone: "9876543213", status: "Active", rating: 4.7, totalOrders: 20 },
];

let rfqs = [
  { id: "RFQ-001", title: "Office Furniture Purchase", category: "Furniture", deadline: "2026-06-20", status: "Open", vendorCount: 3, budget: 250000, description: "Purchasing office furniture for new wing." },
  { id: "RFQ-002", title: "IT Equipment Q3", category: "IT Equipment", deadline: "2026-06-25", status: "Open", vendorCount: 2, budget: 500000, description: "Laptops and peripherals for Q3." },
  { id: "RFQ-003", title: "Stationery Supplies", category: "Stationery", deadline: "2026-06-15", status: "Closed", vendorCount: 4, budget: 50000, description: "Monthly stationery replenishment." },
];

let quotations = [
  { id: "Q-001", rfqId: "RFQ-001", vendor: "Office Furniture Ltd.", amount: 220000, status: "Submitted", date: "2026-06-05", deliveryDays: 20, warranty: "1 Year", notes: "" },
  { id: "Q-002", rfqId: "RFQ-001", vendor: "Hardware Hub", amount: 195000, status: "Best", date: "2026-06-04", deliveryDays: 15, warranty: "2 Years", notes: "Best pricing guaranteed." },
  { id: "Q-003", rfqId: "RFQ-002", vendor: "TechSupplies Co.", amount: 480000, status: "Submitted", date: "2026-06-06", deliveryDays: 10, warranty: "1 Year", notes: "" },
];

let purchaseOrders = [
  { id: "PO-2026-001", vendor: "Hardware Hub", rfqId: "RFQ-001", amount: 195000, status: "Approved", date: "2026-06-06", paymentStatus: "Pending" },
  { id: "PO-2026-002", vendor: "TechSupplies Co.", rfqId: "RFQ-002", amount: 480000, status: "Pending", date: "2026-06-05", paymentStatus: "Not Paid" },
];

let approvals = [
  { id: 1, rfqId: "RFQ-001", vendor: "Hardware Hub", amount: 195000, level: 2, maxLevel: 3, status: "Pending", comments: [] },
  { id: 2, rfqId: "RFQ-002", vendor: "TechSupplies Co.", amount: 480000, level: 1, maxLevel: 3, status: "Pending", comments: [] },
];

let activityLogs = [
  { id: 1, user: "Admin", action: "Created RFQ-002 for IT Equipment", time: "2026-06-06 10:30 AM", type: "RFQ" },
  { id: 2, user: "Priya M.", action: "Submitted quotation Q-001 for RFQ-001", time: "2026-06-05 02:15 PM", type: "Quotation" },
  { id: 3, user: "Admin", action: "Approved PO-2026-001 for Hardware Hub", time: "2026-06-06 09:00 AM", type: "PO" },
  { id: 4, user: "Raj K.", action: "Added new vendor TechSupplies Co.", time: "2026-06-04 11:00 AM", type: "Vendor" },
];

// ── Helpers ──────────────────────────────────────────────────
let idCounters = { vendor: 5, quotation: 4, po: 3, approval: 3, log: 5 };

function nextId(key) {
  return idCounters[key]++;
}

function addLog(user, action, type) {
  activityLogs.unshift({
    id: nextId("log"),
    user,
    action,
    type,
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  });
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token: `demo-token-${user.id}` });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { firstName, lastName, email, password, phone, role, country } = req.body;
  if (!firstName || !email || !password) return res.status(400).json({ error: "First name, email and password required" });
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: "Email already registered" });
  const newUser = {
    id: users.length + 1,
    name: `${firstName} ${lastName || ""}`.trim(),
    email,
    password,
    phone: phone || "",
    role: role || "Procurement Manager",
    country: country || "India",
  };
  users.push(newUser);
  addLog(newUser.name, `Registered new account`, "Vendor");
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token: `demo-token-${newUser.id}` });
});

// ============================================================
// VENDOR ROUTES
// ============================================================

// GET /api/vendors
app.get("/api/vendors", (req, res) => {
  const { search = "", status } = req.query;
  let result = vendors;
  if (status && status !== "All") result = result.filter((v) => v.status === status);
  if (search) result = result.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );
  res.json(result);
});

// GET /api/vendors/:id
app.get("/api/vendors/:id", (req, res) => {
  const v = vendors.find((v) => v.id === Number(req.params.id));
  if (!v) return res.status(404).json({ error: "Vendor not found" });
  res.json(v);
});

// POST /api/vendors
app.post("/api/vendors", (req, res) => {
  const { name, category, contact, phone, status } = req.body;
  if (!name || !contact) return res.status(400).json({ error: "Name and contact are required" });
  const vendor = { id: nextId("vendor"), name, category: category || "Other", contact, phone: phone || "", status: status || "Active", rating: 4.0, totalOrders: 0 };
  vendors.push(vendor);
  addLog("Admin", `Added new vendor ${name}`, "Vendor");
  res.status(201).json(vendor);
});

// PATCH /api/vendors/:id
app.patch("/api/vendors/:id", (req, res) => {
  const idx = vendors.findIndex((v) => v.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Vendor not found" });
  vendors[idx] = { ...vendors[idx], ...req.body };
  addLog("Admin", `Updated vendor ${vendors[idx].name}`, "Vendor");
  res.json(vendors[idx]);
});

// PATCH /api/vendors/:id/toggle-status
app.patch("/api/vendors/:id/toggle-status", (req, res) => {
  const idx = vendors.findIndex((v) => v.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Vendor not found" });
  vendors[idx].status = vendors[idx].status === "Active" ? "Inactive" : "Active";
  addLog("Admin", `${vendors[idx].status === "Active" ? "Activated" : "Deactivated"} vendor ${vendors[idx].name}`, "Vendor");
  res.json(vendors[idx]);
});

// DELETE /api/vendors/:id
app.delete("/api/vendors/:id", (req, res) => {
  const idx = vendors.findIndex((v) => v.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Vendor not found" });
  const [removed] = vendors.splice(idx, 1);
  addLog("Admin", `Deleted vendor ${removed.name}`, "Vendor");
  res.json({ message: "Deleted successfully" });
});

// ============================================================
// RFQ ROUTES
// ============================================================

// GET /api/rfqs
app.get("/api/rfqs", (req, res) => {
  const { status } = req.query;
  let result = rfqs;
  if (status && status !== "All") result = result.filter((r) => r.status === status);
  res.json(result);
});

// GET /api/rfqs/:id
app.get("/api/rfqs/:id", (req, res) => {
  const r = rfqs.find((r) => r.id === req.params.id);
  if (!r) return res.status(404).json({ error: "RFQ not found" });
  res.json(r);
});

// POST /api/rfqs
app.post("/api/rfqs", (req, res) => {
  const { title, category, deadline, budget, description } = req.body;
  if (!title || !deadline) return res.status(400).json({ error: "Title and deadline required" });
  const newRFQ = {
    id: `RFQ-${String(rfqs.length + 1).padStart(3, "0")}`,
    title,
    category: category || "Other",
    deadline,
    status: "Open",
    vendorCount: 0,
    budget: Number(budget) || 0,
    description: description || "",
  };
  rfqs.unshift(newRFQ);
  addLog("Admin", `Created ${newRFQ.id} for ${title}`, "RFQ");
  res.status(201).json(newRFQ);
});

// PATCH /api/rfqs/:id
app.patch("/api/rfqs/:id", (req, res) => {
  const idx = rfqs.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "RFQ not found" });
  rfqs[idx] = { ...rfqs[idx], ...req.body };
  addLog("Admin", `Updated RFQ ${rfqs[idx].id}`, "RFQ");
  res.json(rfqs[idx]);
});

// PATCH /api/rfqs/:id/close
app.patch("/api/rfqs/:id/close", (req, res) => {
  const idx = rfqs.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "RFQ not found" });
  rfqs[idx].status = "Closed";
  addLog("Admin", `Closed RFQ ${rfqs[idx].id}`, "RFQ");
  res.json(rfqs[idx]);
});

// ============================================================
// QUOTATION ROUTES
// ============================================================

// GET /api/quotations
app.get("/api/quotations", (req, res) => {
  const { rfqId, status } = req.query;
  let result = quotations;
  if (rfqId) result = result.filter((q) => q.rfqId === rfqId);
  if (status && status !== "All") result = result.filter((q) => q.status === status);
  res.json(result);
});

// GET /api/quotations/:id
app.get("/api/quotations/:id", (req, res) => {
  const q = quotations.find((q) => q.id === req.params.id);
  if (!q) return res.status(404).json({ error: "Quotation not found" });
  res.json(q);
});

// POST /api/quotations
app.post("/api/quotations", (req, res) => {
  const { rfqId, vendor, amount, deliveryDays, warranty, notes } = req.body;
  if (!rfqId || !vendor || !amount) return res.status(400).json({ error: "rfqId, vendor, and amount required" });
  const newQ = {
    id: `Q-${String(nextId("quotation")).padStart(3, "0")}`,
    rfqId,
    vendor,
    amount: Number(amount),
    status: "Submitted",
    date: new Date().toISOString().slice(0, 10),
    deliveryDays: deliveryDays || "",
    warranty: warranty || "",
    notes: notes || "",
  };
  quotations.push(newQ);
  addLog(vendor, `Submitted quotation ${newQ.id} for ${rfqId}`, "Quotation");
  res.status(201).json(newQ);
});

// PATCH /api/quotations/:id/mark-best
app.patch("/api/quotations/:id/mark-best", (req, res) => {
  const rfqId = quotations.find((q) => q.id === req.params.id)?.rfqId;
  quotations = quotations.map((q) => {
    if (q.rfqId === rfqId) q.status = q.id === req.params.id ? "Best" : "Submitted";
    return q;
  });
  const updated = quotations.find((q) => q.id === req.params.id);
  if (!updated) return res.status(404).json({ error: "Not found" });
  addLog("Admin", `Marked ${req.params.id} as best quotation`, "Quotation");
  res.json(updated);
});

// ============================================================
// PURCHASE ORDER ROUTES
// ============================================================

// GET /api/purchase-orders
app.get("/api/purchase-orders", (req, res) => {
  const { status } = req.query;
  let result = purchaseOrders;
  if (status && status !== "All") result = result.filter((p) => p.status === status);
  res.json(result);
});

// POST /api/purchase-orders
app.post("/api/purchase-orders", (req, res) => {
  const { vendor, rfqId, amount } = req.body;
  if (!vendor || !rfqId || !amount) return res.status(400).json({ error: "vendor, rfqId, amount required" });
  const newPO = {
    id: `PO-2026-${String(nextId("po")).padStart(3, "0")}`,
    vendor,
    rfqId,
    amount: Number(amount),
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
    paymentStatus: "Not Paid",
  };
  purchaseOrders.push(newPO);
  addLog("Admin", `Created ${newPO.id} for ${vendor}`, "PO");
  res.status(201).json(newPO);
});

// PATCH /api/purchase-orders/:id/approve
app.patch("/api/purchase-orders/:id/approve", (req, res) => {
  const idx = purchaseOrders.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "PO not found" });
  purchaseOrders[idx].status = "Approved";
  addLog("Admin", `Approved ${req.params.id}`, "PO");
  res.json(purchaseOrders[idx]);
});

// PATCH /api/purchase-orders/:id/mark-paid
app.patch("/api/purchase-orders/:id/mark-paid", (req, res) => {
  const idx = purchaseOrders.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "PO not found" });
  purchaseOrders[idx].paymentStatus = "Paid";
  addLog("Finance", `Marked ${req.params.id} payment as Paid`, "PO");
  res.json(purchaseOrders[idx]);
});

// ============================================================
// APPROVAL ROUTES
// ============================================================

// GET /api/approvals
app.get("/api/approvals", (req, res) => {
  const { status } = req.query;
  let result = approvals;
  if (status && status !== "All") result = result.filter((a) => a.status === status);
  res.json(result);
});

// POST /api/approvals/:id/action
app.post("/api/approvals/:id/action", (req, res) => {
  const { action, comment, user = "Admin" } = req.body;
  const idx = approvals.findIndex((a) => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Approval not found" });
  const ap = approvals[idx];

  if (action === "Approve") {
    if (ap.level >= ap.maxLevel) {
      ap.status = "Approved";
    } else {
      ap.level += 1;
    }
  } else if (action === "Reject") {
    ap.status = "Rejected";
  } else {
    return res.status(400).json({ error: "action must be Approve or Reject" });
  }

  if (comment) ap.comments.push({ user, comment, time: new Date().toISOString() });
  addLog(user, `${action}d approval for ${ap.vendor} (${ap.rfqId})`, "PO");
  res.json(ap);
});

// ============================================================
// ACTIVITY LOGS ROUTES
// ============================================================

// GET /api/logs
app.get("/api/logs", (req, res) => {
  const { search = "", type } = req.query;
  let result = activityLogs;
  if (type && type !== "All") result = result.filter((l) => l.type === type);
  if (search) result = result.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.user.toLowerCase().includes(search.toLowerCase())
  );
  res.json(result);
});

// ============================================================
// DASHBOARD STATS ROUTE
// ============================================================

// GET /api/dashboard
app.get("/api/dashboard", (_req, res) => {
  const totalSpend = purchaseOrders.reduce((s, p) => s + p.amount, 0);
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const activeRFQs = rfqs.filter((r) => r.status === "Open").length;
  const activeVendors = vendors.filter((v) => v.status === "Active").length;

  const monthlyData = [
    { month: "Jan", spend: 120000, orders: 5 },
    { month: "Feb", spend: 180000, orders: 8 },
    { month: "Mar", spend: 95000, orders: 4 },
    { month: "Apr", spend: 240000, orders: 10 },
    { month: "May", spend: 310000, orders: 12 },
    { month: "Jun", spend: totalSpend, orders: purchaseOrders.length },
  ];

  const categoryData = [
    { name: "IT Equipment", value: 40 },
    { name: "Furniture", value: 25 },
    { name: "Stationery", value: 15 },
    { name: "Hardware", value: 20 },
  ];

  res.json({
    stats: {
      totalVendors: vendors.length,
      activeVendors,
      activeRFQs,
      totalSpend,
      pendingApprovals,
      totalPOs: purchaseOrders.length,
    },
    monthlyData,
    categoryData,
    recentLogs: activityLogs.slice(0, 5),
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 VendorBridge API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
