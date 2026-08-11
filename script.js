// ============================================================
// APEX PREDICT AI
// Version 2.1 XL
// Main Application Script
// ============================================================


// ============================================================
// LOGIN
// ============================================================

function login() {

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const statusElement =
        document.getElementById("status");


    // Make sure the login fields exist
    if (!usernameInput || !passwordInput) {

        console.error(
            "APEX LOGIN ERROR: Login fields not found."
        );

        return;
    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();


    // Require both fields
    if (username === "" || password === "") {

        if (statusElement) {

            statusElement.textContent =
                "⚠️ Please enter your username and password.";

        }

        alert(
            "Please enter your username and password."
        );

        return;
    }


    // Login accepted for prototype
    if (statusElement) {

        statusElement.textContent =
            "✅ Login successful. Opening APEX Predict AI...";

    }


    console.log(
        "APEX Predict AI login successful."
    );


    // Small delay allows the success message
    // to appear before navigation.
    setTimeout(function () {

        window.location.href =
            "dashboard.html";

    }, 300);
}


// ============================================================
// CONNECT LOGIN BUTTON
// ============================================================

function setupLogin() {

    const loginButton =
        document.getElementById("loginBtn");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");


    if (!loginButton) {
        return;
    }


    // Prevent duplicate event listeners
    loginButton.onclick = login;


    // Pressing ENTER in username field
    // triggers login.
    if (usernameInput) {

        usernameInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    login();

                }

            }
        );

    }


    // Pressing ENTER in password field
    // triggers login.
    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    login();

                }

            }
        );

    }


    console.log(
        "APEX login system initialized."
    );
}


// ============================================================
// NAVIGATION
// ============================================================

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


// ============================================================
// LOGOUT
// ============================================================

function logout() {

    const confirmed =
        confirm(
            "Logout from APEX Predict AI?"
        );


    if (confirmed) {

        window.location.href =
            "index.html";

    }
}


// ============================================================
// GOOGLE SHEETS API
// ============================================================

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";


// ============================================================
// GOOGLE SHEETS CONNECTION
// ============================================================

async function connectPrototype() {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    // Login page does not contain
    // connectionStatus.
    if (!statusElement) {

        return;

    }


    try {

        statusElement.textContent =
            "🔄 Connecting to Google Sheets...";


        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "APEX Google Sheets Response:",
            data
        );


        if (
            data &&
            data.status === "CONNECTED"
        ) {

            statusElement.textContent =
                "✅ Google Sheets Connected";

        } else {

            statusElement.textContent =
                "⚠️ Google Sheets connection requires attention";

        }


    } catch (error) {

        console.error(
            "APEX Google Sheets connection error:",
            error
        );


        statusElement.textContent =
            "❌ Google Sheets Connection Failed";

    }

}


// ============================================================
// HTML SAFETY
// ============================================================

function escapeHtml(value) {

    return String(value)
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


// ============================================================
// LOAD MATCH DATABASE
// ============================================================

async function loadMatchDatabase() {

    const statusElement =
        document.getElementById(
            "connectionStatus"
        );


    // Only dashboard-style pages
    // with connectionStatus load
    // the match database.
    if (!statusElement) {

        return;

    }


    try {

        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "APEX Match Database:",
            data
        );


        const matchDatabase =
            data.matchDatabase;


        if (
            !matchDatabase ||
            !matchDatabase.exists ||
            !Array.isArray(
                matchDatabase.objects
            ) ||
            matchDatabase.objects.length === 0
        ) {

            console.log(
                "No matches available."
            );

            return;

        }


        let panel =
            document.getElementById(
                "matchDataPanel"
            );


        // Create panel if dashboard
        // does not already contain one.
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
                        match["recommended market"] || "";


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
                                ⚽ Match ${index + 1}
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
                                    minmax(220px, 1fr)
                                );
                                gap:10px;
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
                                    margin:0 0 12px 0;
                                ">
                                    Full Match Data
                                </h4>


                                <div style="
                                    display:grid;
                                    grid-template-columns:
                                    repeat(
                                        auto-fit,
                                        minmax(240px, 1fr)
                                    );
                                    gap:10px;
                                ">


                                    ${Object.entries(
                                        match
                                    ).map(
                                        function (
                                            entry
                                        ) {

                                            const key =
                                                entry[0];

                                            const value =
                                                entry[1];


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
                                                        0.82rem;

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
                                                        0.95rem;

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


    } catch (error) {

        console.error(
            "APEX Match Database error:",
            error
        );

    }

}


// ============================================================
// APPLICATION STARTUP
// ============================================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "APEX Predict AI starting..."
        );


        // Initialize login
        setupLogin();


        // Connect Google Sheets only
        // on pages that use it.
        connectPrototype();


        // Load match database only
        // on pages that use it.
        loadMatchDatabase();

  
