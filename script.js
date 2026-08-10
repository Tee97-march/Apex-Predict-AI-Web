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
            "Connection failed: HTTP " +  
            response.status  
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
// START GOOGLE SHEETS CONNECTION
// ==============================

window.addEventListener(
"DOMContentLoaded",
connectPrototype
);
// ==============================
// LOAD MATCH DATABASE
// ==============================

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

        statusElement.insertAdjacentElement(  
            "afterend",  
            panel  
        );  
    }  

    const matches =  
        matchDatabase.objects;  

    panel.innerHTML = `  
        <h2>⚽ Match Database</h2>  

        ${matches.map((match, index) => `  

            <div style="  
                margin-top:15px;  
                padding:15px;  
                border:1px solid #ddd;  
                border-radius:10px;  
            ">  

                <h3>  
                    Match ${index + 1}  
                </h3>  

                <p>  
                    <strong>League:</strong>  
                    ${match["League"] || ""}  
                </p>  

                <p>  
                    <strong>  
                        ${match["Home Team"] || ""}  
                    </strong>  
                    vs  
                    <strong>  
                        ${match["Away Team"] || ""}  
                    </strong>  
                </p>  

                <p>  
                    <strong>Prediction:</strong>  
                    ${match["Prediction"] || ""}  
                </p>  

                <p>  
                    <strong>Confidence:</strong>  
                    ${match["Confidence %"] || ""}%  
                </p>  

                <p>  
                    <strong>Risk Level:</strong>  
                    ${match["Risk Level"] || ""}  
                </p>  

                <p>  
                    <strong>Recommended Market:</strong>  
                    ${match["recommended market"] || ""}  
                </p>  

            </div>  

        `).join("")}  
    `;  

} catch (error) {  

    console.error(  
        "APEX Predict AI Match Database error:",  
        error  
    );  
}

}

// ==============================
// START MATCH DATABASE
// ==============================

window.addEventListener(
"DOMContentLoaded",
loadMatchDatabase
); ?              
