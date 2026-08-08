// ==============================
// APEX Predict AI Version 2.1 Stable
// Main Application Script
// ==============================

function login() {

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!username || !password) {
        window.location.href = "dashboard.html";
        return;
    }

    if (username.value.trim() === "" || password.value.trim() === "") {
        alert("Please enter your username and password.");
        return;
    }

    alert("Welcome to APEX Predict AI");

    window.location.href = "dashboard.html";
}

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

function logout() {

    if(confirm("Logout from Apex Predict AI?")){

        window.location.href = "index.html";

// ===============================
// Google Sheets Connection
// ===============================

const GOOGLE_SHEETS_API =
"https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";

async function connectPrototype() {

    const statusElement =
        document.getElementById("connectionStatus");

    try {

        if (statusElement) {
            statusElement.textContent =
                "🔄 Connecting to Google Sheets...";
        }

        const response =
            await fetch(GOOGLE_SHEETS_API);

        if (!response.ok) {
            throw new Error(
                "Connection failed: HTTP " + response.status
            );
        }

        const data =
            await response.json();

        console.log("APEX Predict AI Google Sheets response:");
        console.log(data);

        if (statusElement) {

            if (data.status === "CONNECTED") {

                statusElement.textContent =
                    "✅ Google Sheets Connected";

            } else {

                statusElement.textContent =
                    "⚠️ Google Sheets connection requires attention";

            }
        }

    } catch (error) {

        console.error(
            "APEX Predict AI Google Sheets connection error:",
            error
        );

        if (statusElement) {
            statusElement.textContent =
                "❌ Google Sheets Connection Failed";
        }
    }
}


// Wait until the dashboard HTML has loaded
// before looking for #connectionStatus.

window.addEventListener(
    "DOMContentLoaded",
    connectPrototype
);
