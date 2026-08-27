<script>
"use strict";

/* =========================================================
   APEX PREDICT AI
   SHARED FRONTEND ENGINE
   VERSION 2.1 XL
   ========================================================= */

const APEX_CONFIG = Object.freeze({

    API_URL:
        "https://script.google.com/macros/s/AKfycbxygAHM7CTxHK5SXXCoc7AyfhivumaYJDKSYv5OFdI_woZdSnpVgBM400W8Gkny1Y8I/exec",

    TIMEOUT: 45000,

    RETRIES: 2,

    MAX_MATCHES: 30

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function go(page){

    const allowedPages = [
        "dashboard.html",
        "predictions.html",
        "analysis.html",
        "statistics.html",
        "livescores.html",
        "leagues.html",
        "headtohead.html",
        "settings.html"
    ];

    window.location.href =
        "./" +
        (
            allowedPages.includes(page)
                ? page
                : "dashboard.html"
        );
}


function openDashboard(){
    go("dashboard.html");
}


function openPredictions(){
    go("predictions.html");
}


function openAnalysis(){
    go("analysis.html");
}


function openStatistics(){
    go("statistics.html");
}


function openLiveScores(){
    go("livescores.html");
}


function openLeagues(){
    go("leagues.html");
}


function openHeadToHead(){
    go("headtohead.html");
}


function openSettings(){
    go("settings.html");
}


function logout(){

    window.location.href =
        "./index.html";
}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}


function formatValue(value){

    if(
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ){

        return "—";
    }

    return escapeHtml(value);
}


/* =========================================================
   KEY NORMALISATION
   ========================================================= */

function normaliseKey(value){

    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g," ");
}


/* =========================================================
   FLEXIBLE FIELD READER
   ========================================================= */

function getValue(
    object,
    names
){

    if(
        !object ||
        typeof object !== "object"
    ){

        return "";
    }

    const keys =
        Object.keys(object);

    for(
        const wantedName of names
    ){

        const wanted =
            normaliseKey(
                wantedName
            );

        const found =
            keys.find(
                key =>
                    normaliseKey(key) ===
                    wanted
            );

        if(
            found !== undefined &&
            object[found] !== null &&
            object[found] !== undefined &&
            String(
                object[found]
            ).trim() !== ""
        ){

            return object[found];
        }
    }

    return "";
}


/* =========================================================
   NUMBERS
   ========================================================= */

function numberValue(value){

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){

        return null;
    }

    const parsed =
        parseFloat(
            String(value)
                .replace("%","")
                .replace(",",".")
                .trim()
        );

    return Number.isFinite(parsed)
        ? parsed
        : null;
}


function percentage(value){

    const parsed =
        numberValue(value);

    return parsed === null
        ? "—"
        : Math.round(parsed) + "%";
}


/* =========================================================
   MATCH FIELD HELPERS
   ========================================================= */

function getFixtureId(match){

    return getValue(
        match,
        [
            "Fixture ID",
            "API Fixture ID",
            "fixture_id",
            "Fixture",
            "ID"
        ]
    );
}


function getDate(match){

    return getValue(
        match,
        [
            "Date",
            "Match Date",
            "Fixture Date",
            "date"
        ]
    );
}


function getTime(match){

    return getValue(
        match,
        [
            "Time",
            "Match Time",
            "Kickoff",
            "Kick-off",
            "Kick Off",
            "Start Time"
        ]
    );
}


function getHomeTeam(match){

    return getValue(
        match,
        [
            "Home Team",
            "Home",
            "HomeTeam",
            "Team Home"
        ]
    );
}


function getAwayTeam(match){

    return getValue(
        match,
        [
            "Away Team",
            "Away",
            "AwayTeam",
            "Team Away"
        ]
    );
}


function getLeague(match){

    return getValue(
        match,
        [
            "League",
            "Competition",
            "League Name",
            "Tournament"
        ]
    );
}


function getPrediction(match){

    return getValue(
        match,
        [
            "Prediction",
            "AI Prediction",
            "Prediction Advice",
            "Advice"
        ]
    );
}


function getConfidence(match){

    return numberValue(
        getValue(
            match,
            [
                "Final Confidence",
                "Final confidence",
                "Final Confidence %",
                "Final confidence %",
                "Confidence %",
                "Confidence",
                "AI Confidence"
            ]
        )
    );
}


function getRisk(match){

    const direct =
        getValue(
            match,
            [
                "Risk Level",
                "Risk",
                "Risk Category",
                "Risk Rating",
                "AI Risk"
            ]
        );

    if(
        direct !== ""
    ){

        return String(
            direct
        );
    }

    const score =
        getConfidence(match);

    if(
        score === null
    ){

        return "";
    }

    if(
        score >= 70
    ){

        return "LOW";
    }

    if(
        score >= 55
    ){

        return "MEDIUM";
    }

    return "HIGH";
}


function getMarket(match){

    const direct =
        getValue(
            match,
            [
                "recommended market",
                "Recommended Market",
                "Recommended market",
                "Market",
                "Betting Market",
                "Selection Market",
                "Prediction Market"
            ]
        );

    if(
        direct !== ""
    ){

        return String(
            direct
        );
    }

    const prediction =
        String(
            getPrediction(match)
        ).toLowerCase();

    if(
        prediction.includes(
            "double chance"
        )
    ){

        return "Double Chance";
    }

    if(
        prediction.includes("over 0.5") ||
        prediction.includes("+0.5")
    ){

        return "Over 0.5 Goals";
    }

    if(
        prediction.includes("over 1.5") ||
        prediction.includes("+1.5")
    ){

        return "Over 1.5 Goals";
    }

    if(
        prediction.includes("over 2.5") ||
        prediction.includes("+2.5")
    ){

        return "Over 2.5 Goals";
    }

    if(
        prediction.includes("under 2.5") ||
        prediction.includes("-2.5")
    ){

        return "Under 2.5 Goals";
    }

    if(
        prediction.includes("under 3.5") ||
        prediction.includes("-3.5")
    ){

        return "Under 3.5 Goals";
    }

    if(
        prediction.includes("btts") ||
        prediction.includes(
            "both teams to score"
        )
    ){

        return "Both Teams To Score";
    }

    if(
        prediction.includes("draw")
    ){

        return "Draw";
    }

    return "";
}


function getHomeGoals(match){

    return getValue(
        match,
        [
            "Home Goals Scored Avg",
            "Home Goals Scored",
            "Home Avg Goals"
        ]
    );
}


function getAwayGoals(match){

    return getValue(
        match,
        [
            "Away Goals Scored Avg",
            "Away Goals Scored",
            "Away Avg Goals"
        ]
    );
}


function getHomeGoalsConceded(match){

    return getValue(
        match,
        [
            "Home Goals Conceded Avg",
            "Home Goals Conceded"
        ]
    );
}


function getAwayGoalsConceded(match){

    return getValue(
        match,
        [
            "Away Goals Conceded Avg",
            "Away Goals Conceded"
        ]
    );
}


function getBTTS(match){

    return numberValue(
        getValue(
            match,
            [
                "BTTS %",
                "BTTS"
            ]
        )
    );
}


function getOver15(match){

    return numberValue(
        getValue(
            match,
            [
                "Over 1.5 %",
                "Over 1.5"
            ]
        )
    );
}


function getOver25(match){

    return numberValue(
        getValue(
            match,
            [
                "Over 2.5 %",
                "Over 2.5"
            ]
        )
    );
}


function getHomeWin(match){

    return numberValue(
        getValue(
            match,
            [
                "Home Win %",
                "Home Win"
            ]
        )
    );
}


function getAwayWin(match){

    return numberValue(
        getValue(
            match,
            [
                "Away Win %",
                "Away Win"
            ]
        )
    );
}


function getHomeAdvantage(match){

    return getValue(
        match,
        [
            "Home Advantage",
            "Home Advantage Score"
        ]
    );
}


function getH2HScore(match){

    return getValue(
        match,
        [
            "Head to Head Score",
            "Head To Head Score",
            "H2H Score",
            "head - to - head-score"
        ]
    );
}


function getOddsHome(match){

    return numberValue(
        getValue(
            match,
            [
                "Odds Home",
                "Home Odds",
                "Bookmaker Odds Home"
            ]
        )
    );
}


function getOddsDraw(match){

    return numberValue(
        getValue(
            match,
            [
                "Odds Draw",
                "Draw Odds",
                "Bookmaker Odds Draw"
            ]
        )
    );
}


function getOddsAway(match){

    return numberValue(
        getValue(
            match,
            [
                "Odds Away",
                "Away Odds",
                "Bookmaker Odds Away"
            ]
        )
    );
}


/* =========================================================
   AI STATUS
   ========================================================= */

function getRiskClass(risk){

    const text =
        String(
            risk || ""
        ).toLowerCase();

    if(
        text.includes("low")
    ){

        return "low";
    }

    if(
        text.includes("medium") ||
        text.includes("moderate")
    ){

        return "medium";
    }

    if(
        text.includes("high")
    ){

        return "high";
    }

    return "unknown";
}


function getAIStatus(match){

    const confidence =
        getConfidence(
            match
        );

    if(
        confidence === null
    ){

        return "WATCH";
    }

    if(
        confidence >= 80
    ){

        return "STRONG BET";
    }

    if(
        confidence >= 70
    ){

        return "GOOD BET";
    }

    if(
        confidence >= 60
    ){

        return "POSSIBLE BET";
    }

    return "WATCH";
}


/* =========================================================
   BACKEND RESPONSE EXTRACTION
   ========================================================= */

function getMatches(data){

    /*
     * Current APEX backend contract:
     *
     * {
     *     status: "SUCCESS",
     *     matches: [...]
     * }
     *
     * This is checked first.
     */

    if(
        data &&
        Array.isArray(
            data.matches
        )
    ){

        return data.matches;
    }


    if(
        data &&
        data.matchDatabase &&
        Array.isArray(
            data.matchDatabase.objects
        )
    ){

        return data.matchDatabase.objects;
    }


    if(
        data &&
        data.smartGate &&
        Array.isArray(
            data.smartGate.objects
        )
    ){

        return data.smartGate.objects;
    }


    if(
        data &&
        Array.isArray(
            data.smartGate
        )
    ){

        return data.smartGate;
    }


    if(
        data &&
        Array.isArray(
            data.data
        )
    ){

        return data.data;
    }


    return [];
}


/* =========================================================
   MATCH VALIDATION
   ========================================================= */

function isUsableMatch(match){

    if(
        !match ||
        typeof match !== "object"
    ){

        return false;
    }

    const home =
        String(
            getHomeTeam(match)
        ).trim();

    const away =
        String(
            getAwayTeam(match)
        ).trim();

    const prediction =
        String(
            getPrediction(match)
        ).trim();

    return(
        home !== "" &&
        away !== "" &&
        prediction !== "" &&
        prediction.toLowerCase() !==
            "no predictions available"
    );
}


/* =========================================================
   DUPLICATE PROTECTION
   ========================================================= */

function getMatchIdentity(
    match,
    index
){

    const fixture =
        String(
            getFixtureId(match)
        ).trim();

    if(
        fixture !== ""
    ){

        return(
            "fixture:" +
            normaliseKey(
                fixture
            )
        );
    }


    const identity = [

        normaliseKey(
            getDate(match)
        ),

        normaliseKey(
            getHomeTeam(match)
        ),

        normaliseKey(
            getAwayTeam(match)
        ),

        normaliseKey(
            getLeague(match)
        )

    ].join("|");


    if(
        identity !== "|||"
    ){

        return identity;
    }


    return(
        "row:" +
        index
    );
}


function prepareMatches(
    source
){

    const seen =
        new Set();

    const result =
        [];


    const matches =
        Array.isArray(source)
            ? source
            : [];


    matches.forEach(
        function(
            match,
            index
        ){

            if(
                !isUsableMatch(
                    match
                )
            ){

                return;
            }


            const identity =
                getMatchIdentity(
                    match,
                    index
                );


            if(
                seen.has(
                    identity
                )
            ){

                return;
            }


            seen.add(
                identity
            );


            result.push(
                match
            );
        }
    );


    /*
     * Keep the strongest predictions first.
     *
     * This does NOT change Smart Gate.
     * It only controls frontend ordering.
     */

    result.sort(
        function(
            a,
            b
        ){

            return(
                (
                    getConfidence(b) ||
                    0
                )
                -
                (
                    getConfidence(a) ||
                    0
                )
            );
        }
    );


    return result.slice(
        0,
        APEX_CONFIG.MAX_MATCHES
    );
}


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function setConnectionStatus(
    message,
    type
){

    const elements =
        document.querySelectorAll(
            "#connectionStatus"
        );


    elements.forEach(
        function(element){

            element.textContent =
                message;

            element.className =
                "connection " +
                (
                    type ||
                    ""
                );
        }
    );
}


/* =========================================================
   FETCH APEX BACKEND
   ========================================================= */

async function fetchAPEXData(){

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            function(){

                controller.abort();

            },
            APEX_CONFIG.TIMEOUT
        );


    try{

        const url =
            APEX_CONFIG.API_URL +
            "?request=dashboard" +
            "&limit=" +
            APEX_CONFIG.MAX_MATCHES +
            "&ts=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method:"GET",
                    cache:"no-store",
                    redirect:"follow",
                    signal:
                        controller.signal
                }
            );


        const raw =
            await response.text();


        if(
            !response.ok
        ){

            throw new Error(
                "APEX backend HTTP " +
                response.status
            );
        }


        if(
            !raw.trim()
        ){

            throw new Error(
                "APEX backend returned an empty response."
            );
        }


        let data;


        try{

            data =
                JSON.parse(
                    raw
                );

        }catch(error){

            console.error(
                "APEX raw response:",
                raw
            );

            throw new Error(
                "APEX backend returned invalid JSON."
            );
        }


        if(
            data &&
            data.status &&
            String(
                data.status
            ).toUpperCase() ===
            "ERROR"
        ){

            throw new Error(
                data.message ||
                "APEX backend returned an error."
            );
        }


        return data;


    }catch(error){

        if(
            error.name ===
            "AbortError"
        ){

            throw new Error(
                "APEX backend request timed out."
            );
        }


        throw error;


    }finally{

        clearTimeout(
            timeout
        );
    }
}


/* =========================================================
   FETCH WITH RETRIES
   ========================================================= */

async function loadAPEXData(){

    let lastError =
        null;


    for(
        let attempt = 0;

        attempt <=
        APEX_CONFIG.RETRIES;

        attempt++
    ){

        try{

            return await fetchAPEXData();

        }catch(error){

            lastError =
                error;


            if(
                attempt <
                APEX_CONFIG.RETRIES
            ){

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1200
                        )
                );
            }
        }
    }


    throw(
        lastError ||
        new Error(
            "Unable to connect to APEX backend."
        )
    );
}


/* =========================================================
   GENERIC DASHBOARD RENDER
   ========================================================= */

function renderDashboardData(
    data
){

    const source =
        getMatches(
            data
        );


    const matches =
        prepareMatches(
            source
        );


    /*
     * Shared status.
     */

    setConnectionStatus(
        "✅ APEX AI Connected · " +
        matches.length +
        " matches loaded",
        "success"
    );


    /*
     * KPI fields.
     */

    const matchesCount =
        document.getElementById(
            "matchesCount"
        );

    if(
        matchesCount
    ){

        matchesCount.textContent =
            matches.length;
    }


    const predictionCount =
        document.getElementById(
            "predictionCount"
        );

    if(
        predictionCount
    ){

        predictionCount.textContent =
            matches.length;
    }


    const confidenceValues =
        matches
            .map(
                getConfidence
            )
            .filter(
                value =>
                    value !== null
            );


    const best =
        confidenceValues.length
            ? Math.max(
                ...confidenceValues
            )
            : null;


    const bestConfidence =
        document.getElementById(
            "bestConfidence"
        );

    if(
        bestConfidence
    ){

        bestConfidence.textContent =
            best === null
                ? "—"
                : best + "%";
    }


    const bestConfidenceNote =
        document.getElementById(
            "bestConfidenceNote"
        );

    if(
        bestConfidenceNote
    ){

        bestConfidenceNote.textContent =
            best === null
                ? "No confidence data"
                : "Highest final confidence";
    }


    const lowRisk =
        matches.filter(
            match =>
                getRiskClass(
                    getRisk(match)
                ) === "low"
        ).length;


    const lowRiskCount =
        document.getElementById(
            "lowRiskCount"
        );

    if(
        lowRiskCount
    ){

        lowRiskCount.textContent =
            lowRisk;
    }


    /*
     * Featured match.
     */

    const featured =
        matches[0];


    const featuredContainer =
        document.getElementById(
            "featuredMatch"
        );


    if(
        featuredContainer
    ){

        if(
            !featured
        ){

            featuredContainer.innerHTML =
                `
                <div class="state">
                    No qualified APEX prediction available.
                </div>
                `;

        }else{

            const confidence =
                getConfidence(
                    featured
                );


            const width =
                confidence === null
                    ? 0
                    : Math.max(
                        0,
                        Math.min(
                            100,
                            confidence
                        )
                    );


            featuredContainer.innerHTML = `

                <div class="featured-league">

                    🏆 ${formatValue(
                        getLeague(featured)
                    )}

                </div>


                <div class="featured-teams">


                    <div class="team">

                        ${formatValue(
                            getHomeTeam(featured)
                        )}

                        <small>
                            HOME
                        </small>

                    </div>


                    <div class="vs">
                        VS
                    </div>


                    <div class="team">

                        ${formatValue(
                            getAwayTeam(featured)
                        )}

                        <small>
                            AWAY
                        </small>

                    </div>

                </div>


                <div class="featured-prediction">

                    <span
                        class="
                            featured-prediction-label
                        "
                    >
                        AI PREDICTION
                    </span>


                    <div
                        class="
                            featured-prediction-value
                        "
                    >

                        ${formatValue(
                            getPrediction(featured)
                        )}

                    </div>

                </div>


                <div class="featured-metrics">


                    <div class="featured-metric">

                        <div
                            class="featured-metric-title"
                        >
                            CONFIDENCE
                        </div>

                        <div
                            class="
                                featured-metric-value
                                green
                            "
                        >

                            ${formatValue(
                                percentage(
                                    confidence
                                )
                            )}

                        </div>

                    </div>


                    <div class="featured-metric">

                        <div
                            class="featured-metric-title"
                        >
                            MARKET
                        </div>

                        <div
                            class="featured-metric-value"
                        >

                            ${formatValue(
                                getMarket(
                                    featured
                                )
                            )}

                        </div>

                    </div>


                    <div class="featured-metric">

                        <div
                            class="featured-metric-title"
                        >
                            RISK
                        </div>

                        <div
                            class="featured-metric-value"
                        >

                            ${formatValue(
                                getRisk(
                                    featured
                                )
                            )}

                        </div>

                    </div>


                    <div class="featured-metric">

                        <div
                            class="featured-metric-title"
                        >
                            AI STATUS
                        </div>

                        <div
                            class="featured-metric-value"
                        >

                            ${formatValue(
                                getAIStatus(
                                    featured
                                )
                            )}

                        </div>

                    </div>


                </div>


                <div class="score-wrap">

                    <div class="score-head">

                        <span>
                            AI CONFIDENCE
                        </span>

                        <strong>
                            ${width} / 100
                        </strong>

                    </div>


                    <div class="score-bar">

                        <div
                            class="score-fill"
                            style="
                                width:${width}%;
                            "
                        ></div>

                    </div>

                </div>

            `;
        }
    }


    /*
     * Summary.
     */

    const analysis =
        document.getElementById(
            "analysisSummary"
        );


    if(
        analysis
    ){

        const average =
            confidenceValues.length
                ? Math.round(
                    confidenceValues.reduce(
                        (
                            total,
                            value
                        ) =>
                            total + value,
                        0
                    ) /
                    confidenceValues.length
                )
                : null;


        analysis.innerHTML = `

            <div class="summary-grid">


                <div class="summary-box">

                    <span>
                        SELECTED MATCHES
                    </span>

                    <strong>
                        ${matches.length}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        AVERAGE CONFIDENCE
                    </span>

                    <strong>
                        ${formatValue(
                            percentage(
                                average
                            )
                        )}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        LOW RISK
                    </span>

                    <strong>
                        ${lowRisk}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        DATA STATUS
                    </span>

                    <strong>
                        Connected
                    </strong>

                </div>


            </div>

        `;
    }


    /*
     * Confidence panel.
     */

    const confidencePanel =
        document.getElementById(
            "confidenceSummary"
        );


    const factorPanel =
        document.getElementById(
            "factorSummary"
        );


    if(
        confidencePanel &&
        factorPanel
    ){

        if(
            !featured
        ){

            confidencePanel.innerHTML =
                `
                <div class="state">
                    No confidence data.
                </div>
                `;

            factorPanel.innerHTML =
                "";

        }else{

            const score =
                getConfidence(
                    featured
                );


            const width =
                score === null
                    ? 0
                    : Math.max(
                        0,
                        Math.min(
                            100,
                            score
                        )
                    );


            confidencePanel.innerHTML = `

                <div class="confidence-number">

                    ${formatValue(
                        percentage(
                            score
                        )
                    )}

                </div>


                <div class="confidence-label">

                    Final Confidence

                </div>


                <div class="progress">

                    <div
                        class="progress-bar"
                        style="
                            width:${width}%;
                        "
                    ></div>

                </div>

            `;


            factorPanel.innerHTML = `

                <div class="factor-row">

                    <span class="factor-name">
                        Prediction
                    </span>

                    <span class="factor-score">
                        ${formatValue(
                            getPrediction(
                                featured
                            )
                        )}
                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        Market
                    </span>

                    <span class="factor-score">
                        ${formatValue(
                            getMarket(
                                featured
                            )
                        )}
                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        Risk
                    </span>

                    <span class="factor-score">
                        ${formatValue(
                            getRisk(
                                featured
                            )
                        )}
                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        Home Goals Avg
                    </span>

                    <span class="factor-score">
                        ${formatValue(
                            getHomeGoals(
                                featured
                            )
                        )}
                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        Away Goals Avg
                    </span>

                    <span class="factor-score">
                        ${formatValue(
                            getAwayGoals(
                                featured
                            )
                        )}
                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        BTTS
                    </span>

                    <span class="factor-score">

                        ${
                            getBTTS(featured) !== null
                                ? formatValue(
                                    getBTTS(featured)
                                ) + "%"
                                : "—"
                        }

                    </span>

                </div>


                <div class="factor-row">

                    <span class="factor-name">
                        Over 1.5
                    </span>

                    <span class="factor-score">

                        ${
                            getOver15(featured) !== null
                                ? formatValue(
                                    getOver15(featured)
                                ) + "%"
                                : "—"
                        }

                    </span>

                </div>

            `;
        }
    }


    /*
     * Match list.
     */

    const list =
        document.getElementById(
            "matchList"
        );


    if(
        list
    ){

        if(
            !matches.length
        ){

            list.innerHTML =
                `
                <div class="state">
                    No qualified APEX matches available.
                </div>
                `;

        }else{

            list.innerHTML =
                matches
                    .map(
                        function(
                            match,
                            index
                        ){

                            const confidence =
                                getConfidence(
                                    match
                                );

                            const risk =
                                getRisk(
                                    match
                                );

                            const riskClass =
                                getRiskClass(
                                    risk
                                );


                            return `

                                <article
                                    class="match-row"
                                >

                                    <div
                                        class="match-number"
                                    >
                                        ${index + 1}
                                    </div>


                                    <div>

                                        <div
                                            class="
                                                match-teams-small
                                            "
                                        >

                                            ${formatValue(
                                                getHomeTeam(
                                                    match
                                                )
                                            )}

                                            <span>
                                                VS
                                            </span>

                                            ${formatValue(
                                                getAwayTeam(
                                                    match
                                                )
                                            )}

                                        </div>


                                        <div
                                            class="
                                                match-league
                                            "
                                        >

                                            ${formatValue(
                                                getLeague(
                                                    match
                                                )
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        class="
                                            match-prediction
                                        "
                                    >

                                        ${formatValue(
                                            getPrediction(
                                                match
                                            )
                                        )}


                                        <span
                                            class="
                                                market-small
                                            "
                                        >

                                            ${formatValue(
                                                getMarket(
                                                    match
                                                )
                                            )}

                                        </span>

                                    </div>


                                    <div>

                                        <div
                                            class="
                                                match-confidence
                                            "
                                        >

                                            ${formatValue(
                                                percentage(
                                                    confidence
                                                )
                                            )}

                                        </div>


                                        <span
                                            class="
                                                decision
                                                ${riskClass}
                                            "
                                        >

                                            ${formatValue(
                                                risk ||
                                                "UNKNOWN"
                                            )}

                                        </span>

                                    </div>


                                    <div
                                        class="match-info"
                                    >

                                        <div>
                                            Home:
                                            ${formatValue(
                                                getHomeGoals(
                                                    match
                                                )
                                            )}
                                        </div>

                                        <div>
                                            Away:
                                            ${formatValue(
                                                getAwayGoals(
                                                    match
                                                )
                                            )}
                                        </div>

                                        <div>
                                            BTTS:
                                            ${
                                                getBTTS(match) !== null
                                                    ? formatValue(
                                                        getBTTS(
                                                            match
                                                        )
                                                    ) + "%"
                                                    : "—"
                                            }
                                        </div>

                                    </div>


                                    <div>

                                        <span
                                            class="
                                                decision
                                                ${riskClass}
                                            "
                                        >

                                            ${formatValue(
                                                getAIStatus(
                                                    match
                                                )
                                            )}

                                        </span>

                                    </div>

                                </article>

                            `;
                        }
                    )
                    .join("");
        }
    }


    /*
     * Useful diagnostic information.
     */

    console.log(
        "APEX FRONTEND DATA",
        {
            backendMatches:
                source.length,

            displayedMatches:
                matches.length,

            maximum:
                APEX_CONFIG.MAX_MATCHES,

            response:
                data
        }
    );
}


/* =========================================================
   SHARED DATA LOADER
   ========================================================= */

async function initializeAPEX(){

    try{

        setConnectionStatus(
            "🔄 Connecting to APEX AI...",
            "loading"
        );


        const data =
            await loadAPEXData();


        renderDashboardData(
            data
        );


    }catch(error){

        console.error(
            "APEX frontend error:",
            error
        );


        setConnectionStatus(
            "❌ APEX connection failed",
            "error"
        );


        const targets = [

            "featuredMatch",
            "analysisSummary",
            "confidenceSummary",
            "factorSummary",
            "matchList"

        ];


        targets.forEach(
            function(id){

                const element =
                    document.getElementById(
                        id
                    );

                if(
                    element
                ){

                    element.innerHTML =
                        `
                        <div class="state error">

                            ${formatValue(
                                error.message
                            )}

                        </div>
                        `;
                }
            }
        );
    }
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.APEX_CONFIG =
    APEX_CONFIG;

window.go =
    go;

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

window.fetchAPEXData =
    fetchAPEXData;

window.loadAPEXData =
    loadAPEXData;

window.getMatches =
    getMatches;

window.prepareMatches =
    prepareMatches;


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        initializeAPEX();

    }
);

</script>
