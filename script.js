// ==============================
// APEX Predict AI Version 2.1 XL
// Main Application Script
// ==============================

"use strict";


// ==============================
// LOGIN
// ==============================

function login() {

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");


    if (!username || !password) {

        window.location.href =
            "./dashboard.html";

        return;
    }


    if (
        username.value.trim() === "" ||
        password.value.trim() === ""
    ) {

        alert(
            "Please enter your username and password."
        );

        return;
    }


    window.location.href =
        "./dashboard.html";
}



// ==============================
// NAVIGATION
// ==============================

function openDashboard() {

    window.location.href =
        "./dashboard.html";
}


function openPredictions() {

    window.location.href =
        "./predictions.html";
}


function openAnalysis() {

    window.location.href =
        "./analysis.html";
}


function openStatistics() {

    window.location.href =
        "./statistics.html";
}


function openLiveScores() {

    window.location.href =
        "./livescores.html";
}


function openLeagues() {

    window.location.href =
        "./leagues.html";
}


function openHeadToHead() {

    window.location.href =
        "./head2head.html";
}


function openSettings() {

    window.location.href =
        "./settings.html";
}



// ==============================
// LOGOUT
// ==============================

function logout() {

    if (
        confirm(
            "Logout from APEX Predict AI?"
        )
    ) {

        window.location.href =
            "./index.html";
    }
}



// ==============================
// GOOGLE SHEETS
// ==============================

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";


const GOOGLE_SHEETS_TIMEOUT =
    12000;



// ==============================
// SECURITY / HTML FORMATTING
// ==============================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


function formatCellValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "—";
    }


    if (
        typeof value === "number"
    ) {

        return String(value);
    }


    return escapeHtml(value)
        .replace(/\n/g, "<br>");
}



// ==============================
// CONNECTION STATUS
// ==============================

function setConnectionStatus(
    message,
    type
) {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    if (!statusElement) {
        return;
    }


    statusElement.textContent =
        message;


    if (type === "success") {

        statusElement.style.color =
            "#b9f6ca";

    }

    else if (type === "error") {

        statusElement.style.color =
            "#ffb4ab";

    }

    else {

        statusElement.style.color =
            "#ffd54f";
    }
}



// ==============================
// FETCH GOOGLE SHEETS DATA
// ==============================

async function fetchGoogleSheetsData() {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            function () {

                controller.abort();

            },
            GOOGLE_SHEETS_TIMEOUT
        );


    try {

        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "GET",
                    cache: "no-store",
                    signal:
                        controller.signal
                }
            );


        if (!response.ok) {

            throw new Error(
                "Google Sheets HTTP " +
                response.status
            );
        }


        return await response.json();

    }

    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "Google Sheets request timed out after 12 seconds."
            );
        }


        throw error;

    }

    finally {

        clearTimeout(timeout);
    }
}



// ==============================
// CONNECT TO GOOGLE SHEETS
// ==============================

async function connectPrototype() {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    if (!statusElement) {
        return null;
    }


    setConnectionStatus(
        "🔄 Connecting to Google Sheets...",
        "loading"
    );


    try {

        const data =
            await fetchGoogleSheetsData();


        console.log(
            "APEX Predict AI Google Sheets response:",
            data
        );


        if (
            data &&
            data.status === "CONNECTED"
        ) {

            setConnectionStatus(
                "✅ Google Sheets Connected",
                "success"
            );

        }

        else {

            setConnectionStatus(
                "⚠️ Google Sheets responded, but connection status needs attention.",
                "loading"
            );
        }


        return data;

    }

    catch (error) {

        console.error(
            "APEX Predict AI Google Sheets connection error:",
            error
        );


        setConnectionStatus(
            "❌ Google Sheets Connection Failed: " +
            error.message,
            "error"
        );


        return null;
    }
}



// ==============================
// RENDER MATCH DATABASE
// ==============================

function renderMatchDatabase(data) {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    if (
        !statusElement ||
        !data
    ) {

        return;
    }


    const matchDatabase =
        data.matchDatabase;


    if (
        !matchDatabase ||
        !matchDatabase.exists ||
        !Array.isArray(
            matchDatabase.objects
        )
    ) {

        console.warn(
            "APEX Predict AI: MATCH DATABASE was not returned by Google Sheets."
        );

        return;
    }


    const matches =
        matchDatabase.objects;


    let panel =
        document.getElementById(
            "matchDataPanel"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );


        panel.id =
            "matchDataPanel";


        statusElement.insertAdjacentElement(
            "afterend",
            panel
        );
    }


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
        "0 12px 35px rgba(0,0,0,.25)";


    if (matches.length === 0) {

        panel.innerHTML = `

            <h2>
                ⚽ APEX MATCH DATABASE
            </h2>

            <p>
                No matches are currently loaded.
            </p>

        `;

        return;
    }


    panel.innerHTML = `

        <h2 style="margin-top:0;">

            ⚽ APEX MATCH DATABASE

        </h2>


        <p style="margin-bottom:18px;">

            <strong>
                ${matches.length}
            </strong>

            match(es) loaded from Google Sheets.

        </p>


        ${matches.map(
            function (match, index) {

                const league =
                    match["League"] || "";


                const homeTeam =
                    match["Home Team"] || "";


                const awayTeam =
                    match["Away Team"] || "";


                const prediction =
                    match["Prediction"] || "";


                const confidence =
                    match["Confidence %"] || "";


                const riskLevel =
                    match["Risk Level"] || "";


                const recommendedMarket =
                    match[
                        "recommended market"
                    ] || "";


                return `

                    <div style="
                        margin-top:18px;
                        padding:18px;
                        border:1px solid #e5e5e5;
                        border-radius:12px;
                        background:#fafafa;
                    ">


                        <h3 style="
                            margin-top:0;
                            margin-bottom:10px;
                        ">

                            ⚽ Match
                            ${index + 1}

                        </h3>


                        <div style="
                            margin-bottom:14px;
                        ">


                            <div style="
                                font-weight:700;
                                font-size:1.05rem;
                            ">

                                ${formatCellValue(
                                    league
                                )}

                            </div>


                            <div style="
                                margin-top:4px;
                            ">

                                <strong>
                                    ${formatCellValue(
                                        homeTeam
                                    )}
                                </strong>

                                vs

                                <strong>
                                    ${formatCellValue(
                                        awayTeam
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div style="
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(220px,1fr)
                                );
                            gap:8px;
                        ">


                            <p>

                                <strong>
                                    Prediction:
                                </strong>

                                ${formatCellValue(
                                    prediction
                                )}

                            </p>


                            <p>

                                <strong>
                                    Confidence:
                                </strong>

                                ${formatCellValue(
                                    confidence
                                )}

                                ${
                                    confidence !== ""
                                        ? "%"
                                        : ""
                                }

                            </p>


                            <p>

                                <strong>
                                    Risk Level:
                                </strong>

                                ${formatCellValue(
                                    riskLevel
                                )}

                            </p>


                            <p>

                                <strong>
                                    Recommended Market:
                                </strong>

                                ${formatCellValue(
                                    recommendedMarket
                                )}

                            </p>


                        </div>


                        <div style="
                            margin-top:16px;
                            padding-top:16px;
                            border-top:1px solid #ddd;
                        ">


                            <h4 style="
                                margin:
                                    0 0 12px 0;
                            ">

                                Full Match Data

                            </h4>


                            <div style="
                                display:grid;
                                grid-template-columns:
                                    repeat(
                                        auto-fit,
                                        minmax(240px,1fr)
                                    );
                                gap:10px;
                            ">


                                ${Object.entries(
                                    match
                                ).map(
                                    function (
                                        [key, value]
                                    ) {

                                        return `

                                            <div style="
                                                padding:
                                                    10px 12px;
                                                border:
                                                    1px solid #ececec;
                                                border-radius:
                                                    10px;
                                                background:
                                                    #fff;
                                            ">


                                                <div style="
                                                    font-size:
                                                        .82rem;
                                                    font-weight:
                                                        700;
                                                    color:
                                                        #444;
                                                    margin-bottom:
                                                        4px;
                                                ">

                                                    ${escapeHtml(
                                                        key
                                                    )}

                                                </div>


                                                <div style="
                                                    font-size:
                                                        .95rem;
                                                    line-height:
                                                        1.35;
                                                ">

                                                    ${formatCellValue(
                                                        value
                                                    )}

                                                </div>


                                            </div>

                                        `;
                                    }
                                ).join("")}


                            </div>

                        </div>


                    </div>

                `;

            }
        ).join("")}

    `;
}



// ==============================
// LOAD MATCH DATABASE
// ==============================

async function loadMatchDatabase(
    data
) {

    if (data) {

        renderMatchDatabase(
            data
        );

        return data;
    }


    const freshData =
        await connectPrototype();


    if (freshData) {

        renderMatchDatabase(
            freshData
        );
    }


    return freshData;
}



// ==============================
// INITIALIZE APEX DASHBOARD
// ==============================

async function initializeAPEXDashboard() {

    if (
        window.__APEX_INITIALIZED__
    ) {

        return;
    }


    window.__APEX_INITIALIZED__ =
        true;


    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    if (!statusElement) {

        return;
    }


    const data =
        await connectPrototype();


    if (data) {

        renderMatchDatabase(
            data
        );
    }
}



// ==============================
// STARTUP
// ==============================

window.addEventListener(
    "DOMContentLoaded",
    initializeAPEXDashboard
);



// ==============================
// GLOBAL FUNCTIONS
// ==============================

window.login =
    login;

window.openDashboard =
    openDashboard;

window.openPredictions =
    openPredictions;

window.openAnalysis =
    openAnalysis;

window.openStatistics =
    openStatistics;

window.openLiveScores =
    openLiveScores;

window.openLeagues =
    openLeagues;

window.openHeadToHead =
    openHeadToHead;

window.openSettings =
    openSettings;

window.logout =
    logout;

window.connectPrototype =
    connectPrototype;

window.loadMatchDatabase =
    loadMatchDatabase;
