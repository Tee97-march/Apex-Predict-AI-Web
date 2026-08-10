// ==============================
// APEX Predict AI Version 2.1 Stable
// Main Application Script
// ==============================


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
            "dashboard.html";

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

    alert(
        "Welcome to APEX Predict AI"
    );

    window.location.href =
        "dashboard.html";
}


// ==============================
// NAVIGATION
// ==============================

function openDashboard() {

    window.location.href =
        "dashboard.html";
}

function openPredictions() {

    window.location.href =
        "predictions.html";
}

function openAnalysis() {

    window.location.href =
        "analysis.html";
}

function openStatistics() {

    window.location.href =
        "statistics.html";
}

function openLiveScores() {

    window.location.href =
        "livescores.html";
}

function openLeagues() {

    window.location.href =
        "leagues.html";
}

function openHeadToHead() {

    window.location.href =
        "head2head.html";
}

function openSettings() {

    window.location.href =
        "settings.html";
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
            "index.html";
    }
}


// ==============================
// GOOGLE SHEETS CONNECTION
// ==============================

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";


// ==============================
// GOOGLE SHEETS STATUS
// ==============================

async function connectPrototype() {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );

    if (!statusElement) {
        return;
    }

    try {

        statusElement.textContent =
            "🔄 Connecting to Google Sheets...";


        const response =
            await fetch(
                GOOGLE_SHEETS_API
            );


        if (!response.ok) {

            throw new Error(
                "Connection failed: HTTP " +
                response.status
            );
        }


        const data =
            await response.json();


        console.log(
            "APEX Predict AI Google Sheets response:",
            data
        );


        if (
            data.status ===
            "CONNECTED"
        ) {

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
// SAFE HTML OUTPUT
// ==============================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#39;"
        );
}


// ==============================
// FORMAT DATABASE VALUES
// ==============================

function formatCellValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "—";
    }


    if (
        typeof value ===
        "number"
    ) {

        return String(value);
    }


    return escapeHtml(value)
        .replace(
            /\n/g,
            "<br>"
        );
}


// ==============================
// DATA CARD
// ==============================

function createDataCard(
    label,
    value
) {

    return `

        <div class="apex-data-card">

            <div class="apex-data-label">
                ${escapeHtml(label)}
            </div>

            <div class="apex-data-value">
                ${formatCellValue(value)}
            </div>

        </div>

    `;
}


// ==============================
// DATA SECTION
// ==============================

function createDataSection(
    title,
    icon,
    cards
) {

    return `

        <section class="apex-section">

            <h3 class="apex-section-title">
                ${icon} ${title}
            </h3>

            <div class="apex-data-grid">

                ${cards.join("")}

            </div>

        </section>

    `;
}


// ==============================
// LOAD MATCH DATABASE
// ==============================

async function loadMatchDatabase() {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    if (!statusElement) {
        return;
    }


    try {

        const response =
            await fetch(
                GOOGLE_SHEETS_API
            );


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

            console.warn(
                "APEX Predict AI: No matches found."
            );

            return;
        }


        // ==============================
        // FIND OR CREATE PANEL
        // ==============================

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
                "0 8px 24px rgba(0,0,0,0.08)";


            statusElement.insertAdjacentElement(
                "afterend",
                panel
            );
        }


        const matches =
            matchDatabase.objects;


        // ==============================
        // BUILD DASHBOARD
        // ==============================

        panel.innerHTML = `

            <div class="apex-match-header">

                <h2>
                    ⚽ APEX MATCH DATABASE
                </h2>

                <p>
                    <strong>
                        ${matches.length}
                    </strong>
                    match(es) loaded from Google Sheets.
                </p>

            </div>


            ${matches.map(
                (match, index) => {


                // ==========================
                // BASIC MATCH DATA
                // ==========================

                const date =
                    match["Date"];

                const league =
                    match["League"];

                const homeTeam =
                    match["Home Team"];

                const awayTeam =
                    match["Away Team"];


                // ==========================
                // FORM
                // ==========================

                const homeForm =
                    match["Home Last 5 Form"];

                const awayForm =
                    match["Away Last 5 Form"];

                const homeFormScore =
                    match["Home Form Score"];

                const awayFormScore =
                    match["Away Form Score"];


                // ==========================
                // GOAL STATISTICS
                // ==========================

                const homeAvgGoals =
                    match["Home Avg Goals"];

                const awayAvgGoals =
                    match["Away Avg Goals"];

                const homeGoalsScored =
                    match["Home Goals Scored Avg"];

                const awayGoalsScored =
                    match["Away Goals Scored Avg"];

                const homeGoalsConceded =
                    match["Home Goals Conceded Avg"];

                const awayGoalsConceded =
                    match["Away Goals Conceded Avg"];

                const btts =
                    match["BTTS %"];

                const over15 =
                    match["Over 1.5 %"];

                const over25 =
                    match["Over 2.5 %"];

                const cleanSheets =
                    match["Clean Sheets %"];

                const homeWin =
                    match["Home Win %"];

                const awayWin =
                    match["Away Win %"];


                // ==========================
                // APEX AI ENGINE
                // ==========================

                const prediction =
                    match["Prediction"];

                const confidence =
                    match["Confidence %"];

                const risk =
                    match["Risk Level"];

                const totalAIScore =
                    match["Total Al Score"];

                const finalConfidence =
                    match["Final confidence"];

                const recommendedMarket =
                    match["recommended market"];


                // ==========================
                // HEAD TO HEAD
                // ==========================

                const h2h =
                    match["Head to Head"];

                const h2hScore =
                    match["Head to Head Score"];

                const h2hAvgGoals =
                    match["Head-to-Head Avg Goals"];

                const homeAdvantage =
                    match["Home Advantage"];

                const homeAdvantageScore =
                    match["Home Advantage Score"];


                // ==========================
                // ODDS
                // ==========================

                const oddsHome =
                    match["Odds Home"];

                const oddsDraw =
                    match["Odds Draw"];

                const oddsAway =
                    match["Odds Away"];

                const bookmakerOdds =
                    match["Bookmaker Odds"];

                const oddsValueScore =
                    match["Odds Value Score"];


                // ==========================
                // MATCH OVERVIEW
                // ==========================

                const overviewCards = [

                    createDataCard(
                        "League",
                        league
                    ),

                    createDataCard(
                        "Date",
                        date
                    )

                ];


                // ==========================
                // FORM SECTION
                // ==========================

                const formCards = [

                    createDataCard(
                        "Home Last 5 Form",
                        homeForm
                    ),

                    createDataCard(
                        "Away Last 5 Form",
                        awayForm
                    ),

                    createDataCard(
                        "Home Form Score",
                        homeFormScore
                    ),

                    createDataCard(
                        "Away Form Score",
                        awayFormScore
                    )

                ];


                // ==========================
                // GOALS & STATISTICS
                // ==========================

                const statisticsCards = [

                    createDataCard(
                        "Home Avg Goals",
                        homeAvgGoals
                    ),

                    createDataCard(
                        "Away Avg Goals",
                        awayAvgGoals
                    ),

                    createDataCard(
                        "Home Goals Scored Avg",
                        homeGoalsScored
                    ),

                    createDataCard(
                        "Away Goals Scored Avg",
                        awayGoalsScored
                    ),

                    createDataCard(
                        "Home Goals Conceded Avg",
                        homeGoalsConceded
                    ),

                    createDataCard(
                        "Away Goals Conceded Avg",
                        awayGoalsConceded
                    ),

                    createDataCard(
                        "BTTS %",
                        btts !== undefined &&
                        btts !== "" ?
                        btts + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Over 1.5 %",
                        over15 !== undefined &&
                        over15 !== "" ?
                        over15 + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Over 2.5 %",
                        over25 !== undefined &&
                        over25 !== "" ?
                        over25 + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Clean Sheets %",
                        cleanSheets !== undefined &&
                        cleanSheets !== "" ?
                        cleanSheets + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Home Win %",
                        homeWin !== undefined &&
                        homeWin !== "" ?
                        homeWin + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Away Win %",
                        awayWin !== undefined &&
                        awayWin !== "" ?
                        awayWin + "%" :
                        "—"
                    )

                ];


                // ==========================
                // AI ENGINE SECTION
                // ==========================

                const aiCards = [

                    createDataCard(
                        "Prediction",
                        prediction
                    ),

                    createDataCard(
                        "Confidence",
                        confidence !== undefined &&
                        confidence !== "" ?
                        confidence + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Risk Level",
                        risk
                    ),

                    createDataCard(
                        "Total AI Score",
                        totalAIScore
                    ),

                    createDataCard(
                        "Final Confidence",
                        finalConfidence !== undefined &&
                        finalConfidence !== "" ?
                        finalConfidence + "%" :
                        "—"
                    ),

                    createDataCard(
                        "Recommended Market",
                        recommendedMarket
                    )

                ];


                // ==========================
                // HEAD TO HEAD SECTION
                // ==========================

                const h2hCards = [

                    createDataCard(
                        "Head to Head",
                        h2h
                    ),

                    createDataCard(
                        "Head to Head Score",
                        h2hScore
                    ),

                    createDataCard(
                        "Head-to-Head Avg Goals",
                        h2hAvgGoals
                    ),

                    createDataCard(
                        "Home Advantage",
                        homeAdvantage
                    ),

                    createDataCard(
                        "Home Advantage Score",
                        homeAdvantageScore
                    )

                ];


                // ==========================
                // ODDS SECTION
                // ==========================

                const oddsCards = [

                    createDataCard(
                        "Odds Home",
                        oddsHome
                    ),

                    createDataCard(
                        "Odds Draw",
                        oddsDraw
                    ),

                    createDataCard(
                        "Odds Away",
                        oddsAway
                    ),

                    createDataCard(
                        "Bookmaker Odds",
                        bookmakerOdds
                    ),

                    createDataCard(
                        "Odds Value Score",
                        oddsValueScore
                    )

                ];


                // ==========================
                // RETURN COMPLETE MATCH
                // ==========================

                return `

                    <article
                        class="apex-match-card"
                    >

                        <!-- MATCH HEADER -->

                        <div
                            class="apex-match-title"
                        >

                            <div>

                                <span
                                    class="apex-match-number"
                                >
                                    MATCH ${index + 1}
                                </span>

                                <h3>
                                    ${formatCellValue(
                                        homeTeam
                                    )}

                                    <span>
                                        vs
                                    </span>

                                    ${formatCellValue(
                                        awayTeam
                                    )}
                                </h3>

                                <p>
                                    ${formatCellValue(
                                        league
                                    )}
                                </p>

                            </div>


                            <div
                                class="apex-prediction-badge"
                            >

                                <span>
                                    APEX PREDICTION
                                </span>

        
