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

    }

}
