// VENDORS
function addVendor(e) {
    e.preventDefault();

    let name = document.getElementById("vname").value;
    let email = document.getElementById("vemail").value;
    let phone = document.getElementById("vphone").value;

    let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

    vendors.push({ name, email, phone });

    localStorage.setItem("vendors", JSON.stringify(vendors));

    showVendors();
}

// SHOW VENDORS
function showVendors() {
    let list = document.getElementById("vendorList");
    if (!list) return;

    let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

    list.innerHTML = "";

    vendors.forEach(v => {
        list.innerHTML += `<li>${v.name} - ${v.email} - ${v.phone}</li>`;
    });
}

// RFQ
function addRFQ(e) {
    e.preventDefault();

    let title = document.getElementById("rfqTitle").value;
    let desc = document.getElementById("rfqDesc").value;

    let rfqs = JSON.parse(localStorage.getItem("rfqs")) || [];

    rfqs.push({ title, desc });

    localStorage.setItem("rfqs", JSON.stringify(rfqs));

    showRFQ();
}

function showRFQ() {
    let list = document.getElementById("rfqList");
    if (!list) return;

    let rfqs = JSON.parse(localStorage.getItem("rfqs")) || [];

    list.innerHTML = "";

    rfqs.forEach(r => {
        list.innerHTML += `<li><b>${r.title}</b> - ${r.desc}</li>`;
    });
}

// QUOTATIONS
function addQuotation(e) {
    e.preventDefault();

    let rfq = document.getElementById("qrfq").value;
    let vendor = document.getElementById("qvendor").value;
    let price = document.getElementById("qprice").value;

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

    quotes.push({ rfq, vendor, price });

    localStorage.setItem("quotes", JSON.stringify(quotes));

    showQuotes();
}

function showQuotes() {
    let list = document.getElementById("quotationList");
    if (!list) return;

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

    list.innerHTML = "";

    quotes.forEach(q => {
        list.innerHTML += `<li>${q.rfq} | ${q.vendor} | ₹${q.price}</li>`;
    });
}

// AUTO LOAD
window.onload = function () {
    showVendors();
    showRFQ();
    showQuotes();
};