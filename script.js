// ==============================
// APEX Predict AI Version 2.1 Stable
// Main Application Script
// ==============================


// ==============================
// LOGIN
// ==============================

function login() {

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!username || !password) {
        window.location.href = "dashboard.html";
        return;
    }

    if (
        username.value.trim() === "" ||
        password.value.trim() === ""
    ) {
        alert("Please enter your username and password.");
        return;
    }

    alert("Welcome to APEX Predict AI");

    window.location.href = "dashboard.html";
}


// ==============================
// NAVIGATION
// ==============================

function openDashboard() {
    window.location.href = "dashboard.html";
}

function openPredictions() {
    window.location.href = "predictions.html";
}

function openAnalysis() {
    window.location.href = "analysis.html";
}

function openStatistics() {
    window.location.href = "statistics.html";
}

function openLiveScores() {
    window.location.href = "livescores.html";
}

function openLeagues() {
    window.location.href = "leagues.html";
}

function openHeadToHead() {
    window.location.href = "head2head.html";
}

function openSettings() {
    window.location.href = "settings.html";
}


// ==============================
// LOGOUT
// ==============================

function logout() {

    if (confirm("Logout from APEX Predict AI?")) {
        window.location.href = "index.html";
    }
}


// ==============================
// GOOGLE SHEETS CONNECTION
// ==============================

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";


async function connectPrototype() {

    const statusElement =
        document.getElementById("connectionStatus");

    // Pages without connectionStatus do not need
    // the visible connection message.
    if (!statusElement) {
        return;
    }

    try {

        statusElement.textContent =
            "🔄 Connecting to Google Sheets...";

        const response =
            await fetch(GOOGLE_SHEETS_API);

        if (!response.ok) {
            throw new Error(
                "Connection failed: HTTP " + response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "APEX Predict AI Google Sheets response:"
        );
        console.log(data);

        if (data.status === "CONNECTED") {
            statusElement.textContent =
                "✅ Google Sheets Connected";
        } else {
            statusElement.textContent =
                "⚠️ Google Sheets connection requires attention";
        }

    } catch (error) {

        console.error(
            "APEX Predict AI Google Sheets connection error:",
            error
        );

        statusElement.textContent =
            "❌ Google Sheets Connection Failed";
    }
}


// ==============================
// LOAD MATCH DATABASE
// ==============================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatCellValue(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "number") {
        return String(value);
    }

    return escapeHtml(value)
        .replace(/\n/g, "<br>");
}

async function loadMatchDatabase() {

    const statusElement =
        document.getElementById("connectionStatus");

    if (!statusElement) {
        return;
    }

    try {

        const response =
            await fetch(GOOGLE_SHEETS_API);

        if (!response.ok) {
            throw new Error(
                "Match database request failed: HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "APEX Predict AI Match Database:",
            data
        );

        const matchDatabase =
            data.matchDatabase;

        if (
            !matchDatabase ||
            !matchDatabase.exists ||
            !matchDatabase.objects ||
            matchDatabase.objects.length === 0
        ) {
            return;
        }

        let panel =
            document.getElementById("matchDataPanel");

        if (!panel) {
            panel =
                document.createElement("div");

            panel.id =
                "matchDataPanel";

            panel.style.marginTop =
                "20px";

            panel.style.padding =
                "20px";

            panel.style.borderRadius =
                "12px";

            panel.style.background =
                "#ffffff";

            panel.style.border =
                "1px solid #ddd";

            panel.style.boxShadow =
                "0 8px 24px rgba(0,0,0,0.06)";

            statusElement.insertAdjacentElement(
                "afterend",
                panel
            );
        }

        const matches =
            matchDatabase.objects;

        panel.innerHTML = `
            <h2 style="margin-top:0;">
                ⚽ APEX MATCH DATABASE
            </h2>

            <p style="margin-bottom:18px;">
                <strong>${matches.length}</strong> match(es) loaded from Google Sheets.
            </p>

            ${matches.map((match, index) => {

                const league = match["League"] || "";
                const homeTeam = match["Home Team"] || "";
                const awayTeam = match["Away Team"] || "";
                const prediction = match["Prediction"] || "";
                const confidence = match["Confidence %"] || "";
                const riskLevel = match["Risk Level"] || "";
                const recommendedMarket = match["recommended market"] || "";

                return `
                    <div style="
                        margin-top:18px;
                        padding:18px;
                        border:1px solid #e5e5e5;
                        border-radius:12px;
                        background:#fafafa;
                    ">

                        <h3 style="margin-top:0; margin-bottom:10px;">
                            ⚽ Match ${index + 1}
                        </h3>

                        <div style="margin-bottom:14px;">
                            <div style="font-weight:700; font-size:1.05rem;">
                                ${formatCellValue(league)}
                            </div>
                            <div style="margin-top:4px;">
                                <strong>${formatCellValue(homeTeam)}</strong>
                                vs
                                <strong>${formatCellValue(awayTeam)}</strong>
                            </div>
                        </div>

                        <div style="
                            display:grid;
                            grid-template-columns: 1fr;
                            gap:8px;
                        ">
                            <p><strong>Prediction:</strong> ${formatCellValue(prediction)}</p>
                            <p><strong>Confidence:</strong> ${formatCellValue(confidence)}${confidence !== "" ? "%" : ""}</p>
                            <p><strong>Risk Level:</strong> ${formatCellValue(riskLevel)}</p>
                            <p><strong>Recommended Market:</strong> ${formatCellValue(recommendedMarket)}</p>
                        </div>

                        <div style="
                            margin-top:16px;
                            padding-top:16px;
                            border-top:1px solid #ddd;
                        ">
                            <h4 style="margin:0 0 12px 0;">
                                Full Match Data
                            </h4>

                            <div style="
                                display:grid;
                                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                                gap:10px;
                            ">
                                ${Object.entries(match).map(([key, value]) => `
                                    <div style="
                                        padding:10px 12px;
                                        border:1px solid #ececec;
                                        border-radius:10px;
                                        background:#fff;
                                    ">
                                        <div style="
                                            font-size:0.82rem;
                                            font-weight:700;
                                            color:#444;
                                            margin-bottom:4px;
                                        ">
                                            ${escapeHtml(key)}
                                        </div>
                                        <div style="font-size:0.95rem; line-height:1.35;">
                                            ${formatCellValue(value)}
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>

                    </div>
                `;
            }).join("")}
        `;

    } catch (error) {

        console.error(
            "APEX Predict AI Match Database error:",
            error
        );
    }
}


// ==============================
// STARTUP
// ==============================

window.addEventListener(
    "DOMContentLoaded",
    connectPrototype
);

window.addEventListener(
    "DOMContentLoaded",
    loadMatchDatabase
);
