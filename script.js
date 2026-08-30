<script>
"use strict";

/* =========================================================
   APEX PREDICT AI
   DASHBOARD FRONTEND ENGINE
   VERSION 2.1 XL
   CONTROLLED SOURCE: AI ANALYSIS / SMART GATE V7
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


function formatValue(
    value,
    fallback = "—"
){

    if(
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ){

        return fallback;
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
                    normaliseKey(key) === wanted
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
   ACTUAL AI ANALYSIS FIELD HELPERS
   ========================================================= */

/*
 * AI ANALYSIS actually contains:
 *
 * Match
 * Goal Score
 * Form Score
 * Attack Score
 * Defence Score
 * Total Score
 * Confidence %
 * Risk Level
 * Home Advantage
 * BTTS Score
 * Over 1.5 Score
 * Over 2.5 Score
 * Head-to-Head Score
 * Odds Value
 * AI Decision
 * Recommended Market
 */


function getMatch(match){

    return getValue(
        match,
        [
            "Match"
        ]
    );
}


function splitMatch(match){

    const full =
        String(
            getMatch(match)
        ).trim();

    if(!full){

        return {
            home:"—",
            away:"—"
        };
    }

    const parts =
        full.split(
            /\s+VS\s+/i
        );

    if(parts.length >= 2){

        return {

            home:
                parts[0].trim(),

            away:
                parts
                    .slice(1)
                    .join(" VS ")
                    .trim()

        };
    }

    return {

        home:
            full,

        away:
            "—"

    };
}


function getPrediction(match){

    /*
     * Recommended Market is the actual calculated
     * market produced by the AI Engine.
     */

    const market =
        getValue(
            match,
            [
                "Recommended Market",
                "recommended market"
            ]
        );

    if(
        market !== ""
    ){

        return String(market);
    }

    return getValue(
        match,
        [
            "Prediction",
            "AI Prediction"
        ]
    );
}


function getMarket(match){

    return getValue(
        match,
        [
            "Recommended Market",
            "recommended market",
            "Market"
        ]
    );
}


function getConfidence(match){

    return numberValue(
        getValue(
            match,
            [
                "Confidence %",
                "Confidence",
                "Final Confidence",
                "Final confidence"
            ]
        )
    );
}


function getRisk(match){

    return getValue(
        match,
        [
            "Risk Level",
            "Risk"
        ]
    );
}


function getDecision(match){

    const decision =
        getValue(
            match,
            [
                "AI Decision",
                "Decision"
            ]
        );

    if(
        decision !== ""
    ){

        return String(decision);
    }

    const risk =
        String(
            getRisk(match)
        ).toUpperCase();

    if(
        risk === "LOW"
    ){

        return "GOOD BET";
    }

    if(
        risk === "MEDIUM"
    ){

        return "POSSIBLE BET";
    }

    if(
        risk === "HIGH"
    ){

        return "WATCH";
    }

    return "APEX AI";
}


function getRiskClass(risk){

    const value =
        String(
            risk || ""
        ).toLowerCase();

    if(
        value.includes("low")
    ){

        return "low";
    }

    if(
        value.includes("medium") ||
        value.includes("moderate")
    ){

        return "medium";
    }

    if(
        value.includes("high")
    ){

        return "high";
    }

    return "unknown";
}


function getGoalScore(match){

    return getValue(
        match,
        [
            "Goal Score"
        ]
    );
}


function getFormScore(match){

    return getValue(
        match,
        [
            "Form Score"
        ]
    );
}


function getAttackScore(match){

    return getValue(
        match,
        [
            "Attack Score"
        ]
    );
}


function getDefenceScore(match){

    return getValue(
        match,
        [
            "Defence Score"
        ]
    );
}


function getTotalScore(match){

    return getValue(
        match,
        [
            "Total Score"
        ]
    );
}


function getHomeAdvantage(match){

    return getValue(
        match,
        [
            "Home Advantage"
        ]
    );
}


function getBTTSScore(match){

    return getValue(
        match,
        [
            "BTTS Score"
        ]
    );
}


function getOver15Score(match){

    return getValue(
        match,
        [
            "Over 1.5 Score"
        ]
    );
}


function getOver25Score(match){

    return getValue(
        match,
        [
            "Over 2.5 Score"
        ]
    );
}


function getH2HScore(match){

    return getValue(
        match,
        [
            "Head-to-Head Score",
            "Head to Head Score",
            "Head To Head Score"
        ]
    );
}


function getOddsValue(match){

    return getValue(
        match,
        [
            "Odds Value"
        ]
    );
}


/* =========================================================
   API RESPONSE NORMALISATION
   ========================================================= */

function extractRecords(payload){

    if(
        payload &&
        Array.isArray(payload.matches)
    ){

        return payload.matches;
    }


    if(
        payload &&
        Array.isArray(payload.data)
    ){

        return payload.data;
    }


    if(
        payload &&
        payload.data &&
        Array.isArray(
            payload.data.matches
        )
    ){

        return payload.data.matches;
    }


    return [];
}


/* =========================================================
   VALIDATE AI RECORD
   ========================================================= */

function isValidAIRecord(match){

    if(
        !match ||
        typeof match !== "object"
    ){

        return false;
    }

    const matchName =
        String(
            getMatch(match)
        ).trim();

    const market =
        String(
            getMarket(match)
        ).trim();

    const confidence =
        getConfidence(match);

    if(
        matchName === ""
    ){

        return false;
    }

    if(
        market === ""
    ){

        return false;
    }

    if(
        confidence === null ||
        confidence <= 0
    ){

        return false;
    }

    return true;
}


/* =========================================================
   PREPARE EXACT 30 RECORDS
   ========================================================= */

function prepareMatches(source){

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
                !isValidAIRecord(
                    match
                )
            ){

                return;
            }

            const identity =
                normaliseKey(
                    getMatch(match)
                );

            if(
                identity &&
                seen.has(identity)
            ){

                return;
            }

            if(identity){

                seen.add(identity);
            }

            result.push(match);

        }
    );


    /*
     * The backend already preserves Smart Gate order.
     * If Smart Gate Rank exists, use it.
     * Otherwise retain the API order.
     */

    result.sort(
        function(a,b){

            const rankA =
                numberValue(
                    getValue(
                        a,
                        [
                            "Smart Gate Rank",
                            "Rank"
                        ]
                    )
                );

            const rankB =
                numberValue(
                    getValue(
                        b,
                        [
                            "Smart Gate Rank",
                            "Rank"
                        ]
                    )
                );

            if(
                rankA !== null &&
                rankB !== null
            ){

                return rankA - rankB;
            }

            return 0;
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

    const element =
        document.getElementById(
            "connectionStatus"
        );

    if(!element){

        return;
    }

    element.textContent =
        message;

    element.className =
        "connection " +
        (
            type || ""
        );
}


/* =========================================================
   FETCH CONTROLLED AI ANALYSIS
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

        /*
         * IMPORTANT:
         *
         * Read the actual AI ANALYSIS sheet.
         * We do NOT use the old ?request=dashboard
         * route that was returning mixed records.
         */

        const url =
            APEX_CONFIG.API_URL +
            "?sheet=" +
            encodeURIComponent(
                "AI ANALYSIS"
            ) +
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


        if(!response.ok){

            throw new Error(
                "APEX backend HTTP " +
                response.status
            );
        }


        if(!raw.trim()){

            throw new Error(
                "APEX backend returned an empty response."
            );
        }


        let payload;


        try{

            payload =
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
            payload &&
            String(
                payload.status || ""
            ).toUpperCase() ===
            "ERROR"
        ){

            throw new Error(
                payload.message ||
                "APEX backend returned an error."
            );
        }


        /*
         * Existing Code.gs sheet endpoint returns:
         *
         * {
         *   status: "CONNECTED",
         *   headers: [...],
         *   data: [...]
         * }
         *
         * Convert that format into normal objects.
         */

        if(
            payload &&
            Array.isArray(
                payload.headers
            ) &&
            Array.isArray(
                payload.data
            )
        ){

            payload.matches =
                payload.data.map(
                    function(row){

                        const record =
                            {};

                        payload.headers.forEach(
                            function(
                                header,
                                index
                            ){

                                record[
                                    String(header).trim()
                                ] =
                                    row[index];

                            }
                        );

                        return record;
                    }
                );
        }


        return payload;


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
   RETRY LOADER
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
                    function(resolve){

                        setTimeout(
                            resolve,
                            1200
                        );

                    }
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
   LOAD AND RENDER DASHBOARD
   ========================================================= */

async function loadDashboard(){

    try{

        setConnectionStatus(
            "🔄 Loading AI Analysis...",
            "loading"
        );


        const data =
            await loadAPEXData();


        const source =
            extractRecords(
                data
            );


        const matches =
            prepareMatches(
                source
            );


        if(
            matches.length === 0
        ){

            throw new Error(
                "AI ANALYSIS returned no valid calculated matches."
            );
        }


        renderDashboard(
            matches
        );


        setConnectionStatus(
            "✅ APEX AI Connected · " +
            matches.length +
            " calculated matches",
            "success"
        );


    }catch(error){

        console.error(
            "APEX dashboard error:",
            error
        );


        setConnectionStatus(
            "❌ APEX connection failed",
            "error"
        );


        const featuredState =
            document.getElementById(
                "featuredState"
            );

        if(featuredState){

            featuredState.style.display =
                "block";

            featuredState.className =
                "state error";

            featuredState.textContent =
                error.message;
        }


        const matchesState =
            document.getElementById(
                "matchesState"
            );

        if(matchesState){

            matchesState.style.display =
                "block";

            matchesState.className =
                "state error";

            matchesState.textContent =
                error.message;
        }
    }
}


/* =========================================================
   MAIN DASHBOARD RENDER
   ========================================================= */

function renderDashboard(matches){

    updateKPIs(
        matches
    );

    updateFeatured(
        matches[0]
    );

    updateSummary(
        matches
    );

    renderMatchList(
        matches
    );
}


/* =========================================================
   KPI SECTION
   ========================================================= */

function updateKPIs(matches){

    const matchesCount =
        document.getElementById(
            "matchesCount"
        );

    if(matchesCount){

        matchesCount.textContent =
            matches.length;
    }


    const predictions =
        matches.filter(
            function(match){

                return (
                    String(
                        getPrediction(
                            match
                        )
                    ).trim() !== ""
                );
            }
        ).length;


    const predictionCount =
        document.getElementById(
            "predictionCount"
        );

    if(predictionCount){

        predictionCount.textContent =
            predictions;
    }


    const confidences =
        matches
            .map(
                getConfidence
            )
            .filter(
                function(value){

                    return value !== null;
                }
            );


    const best =
        confidences.length
            ? Math.max(
                ...confidences
            )
            : null;


    const bestConfidence =
        document.getElementById(
            "bestConfidence"
        );

    if(bestConfidence){

        bestConfidence.textContent =
            best === null
                ? "—"
                : best + "%";
    }


    const lowRisk =
        matches.filter(
            function(match){

                return (
                    String(
                        getRisk(match)
                    ).toUpperCase()
                    ===
                    "LOW"
                );
            }
        ).length;


    const lowRiskCount =
        document.getElementById(
            "lowRiskCount"
        );

    if(lowRiskCount){

        lowRiskCount.textContent =
            lowRisk;
    }
}


/* =========================================================
   FEATURED MATCH
   ========================================================= */

function updateFeatured(match){

    const state =
        document.getElementById(
            "featuredState"
        );

    const content =
        document.getElementById(
            "featuredContent"
        );


    if(!match){

        if(state){

            state.style.display =
                "block";

            state.textContent =
                "No qualified APEX prediction available.";
        }

        if(content){

            content.style.display =
                "none";
        }

        return;
    }


    if(state){

        state.style.display =
            "none";
    }


    if(content){

        content.style.display =
            "block";
    }


    const teams =
        splitMatch(
            match
        );


    const confidence =
        getConfidence(
            match
        );


    const risk =
        getRisk(
            match
        );


    const prediction =
        getPrediction(
            match
        );


    const market =
        getMarket(
            match
        );


    const league =
        getValue(
            match,
            [
                "League",
                "Competition"
            ]
        );


    const leagueText =
        league !== ""
            ? "🏆 " + league
            : "🤖 Smart Gate V7 · AI Analysis";


    const featuredLeague =
        document.getElementById(
            "featuredLeague"
        );

    if(featuredLeague){

        featuredLeague.textContent =
            leagueText;
    }


    const featuredHome =
        document.getElementById(
            "featuredHome"
        );

    if(featuredHome){

        featuredHome.textContent =
            teams.home;
    }


    const featuredAway =
        document.getElementById(
            "featuredAway"
        );

    if(featuredAway){

        featuredAway.textContent =
            teams.away;
    }


    const featuredPrediction =
        document.getElementById(
            "featuredPrediction"
        );

    if(featuredPrediction){

        featuredPrediction.textContent =
            prediction || "—";
    }


    const featuredConfidence =
        document.getElementById(
            "featuredConfidence"
        );

    if(featuredConfidence){

        featuredConfidence.textContent =
            percentage(
                confidence
            );
    }


    const featuredMarket =
        document.getElementById(
            "featuredMarket"
        );

    if(featuredMarket){

        featuredMarket.textContent =
            market || "—";
    }


    const featuredRisk =
        document.getElementById(
            "featuredRisk"
        );

    if(featuredRisk){

        featuredRisk.textContent =
            risk || "UNKNOWN";
    }


    const featuredStatus =
        document.getElementById(
            "featuredStatus"
        );

    if(featuredStatus){

        featuredStatus.textContent =
            getDecision(
                match
            );
    }


    const score =
        confidence === null
            ? 0
            : Math.max(
                0,
                Math.min(
                    100,
                    confidence
                )
            );


    const featuredScore =
        document.getElementById(
            "featuredScore"
        );

    if(featuredScore){

        featuredScore.textContent =
            score +
            " / 100";
    }


    const featuredScoreFill =
        document.getElementById(
            "featuredScoreFill"
        );

    if(featuredScoreFill){

        featuredScoreFill.style.width =
            score + "%";
    }


    const confidenceNumber =
        document.getElementById(
            "confidenceNumber"
        );

    if(confidenceNumber){

        confidenceNumber.textContent =
            percentage(
                confidence
            );
    }


    const confidenceProgress =
        document.getElementById(
            "confidenceProgress"
        );

    if(confidenceProgress){

        confidenceProgress.style.width =
            score + "%";
    }


    const factorPrediction =
        document.getElementById(
            "factorPrediction"
        );

    if(factorPrediction){

        factorPrediction.textContent =
            prediction || "—";
    }


    const factorMarket =
        document.getElementById(
            "factorMarket"
        );

    if(factorMarket){

        factorMarket.textContent =
            market || "—";
    }


    const factorRisk =
        document.getElementById(
            "factorRisk"
        );

    if(factorRisk){

        factorRisk.textContent =
            risk || "—";
    }


    setText(
        "factorGoalScore",
        getGoalScore(match)
    );

    setText(
        "factorFormScore",
        getFormScore(match)
    );

    setText(
        "factorAttackScore",
        getAttackScore(match)
    );

    setText(
        "factorDefenceScore",
        getDefenceScore(match)
    );

    setText(
        "factorBTTSScore",
        getBTTSScore(match)
    );

    setText(
        "factorOver15Score",
        getOver15Score(match)
    );

    setText(
        "factorOver25Score",
        getOver25Score(match)
    );

    setText(
        "factorH2HScore",
        getH2HScore(match)
    );

    setText(
        "factorOddsValue",
        getOddsValue(match)
    );
}


/* =========================================================
   SET TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
){

    const element =
        document.getElementById(
            id
        );

    if(!element){

        return;
    }

    element.textContent =
        (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        )
            ? "—"
            : String(value);
}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(matches){

    if(!matches.length){

        return;
    }


    const confidenceValues =
        matches
            .map(
                getConfidence
            )
            .filter(
                function(value){

                    return value !== null;
                }
            );


    const average =
        confidenceValues.length
            ? Math.round(
                confidenceValues.reduce(
                    function(
                        total,
                        value
                    ){

                        return (
                            total +
                            value
                        );

                    },
                    0
                ) /
                confidenceValues.length
            )
            : null;


    const lowRisk =
        matches.filter(
            function(match){

                return (
                    String(
                        getRisk(match)
                    ).toUpperCase()
                    ===
                    "LOW"
                );
            }
        ).length;


    const markets = {};


    matches.forEach(
        function(match){

            const market =
                getMarket(
                    match
                );


            if(!market){

                return;
            }


            markets[market] =
                (
                    markets[market] ||
                    0
                ) + 1;

        }
    );


    let mainMarket =
        "—";

    let highestCount =
        0;


    Object.keys(markets).forEach(
        function(market){

            if(
                markets[market] >
                highestCount
            ){

                highestCount =
                    markets[market];

                mainMarket =
                    market;
            }

        }
    );


    setText(
        "summaryMatches",
        matches.length
    );


    setText(
        "summaryConfidence",
        average === null
            ? "—"
            : average + "%"
    );


    setText(
        "summaryLowRisk",
        lowRisk
    );


    setText(
        "summaryMarket",
        mainMarket
    );
}


/* =========================================================
   MATCH LIST
   ========================================================= */

function renderMatchList(matches){

    const state =
        document.getElementById(
            "matchesState"
        );

    const table =
        document.getElementById(
            "matchesTable"
        );

    const container =
        document.getElementById(
            "matchRows"
        );


    if(!container){

        return;
    }


    container.innerHTML =
        "";


    matches.forEach(
        function(
            match,
            index
        ){

            const teams =
                splitMatch(
                    match
                );


            const prediction =
                getPrediction(
                    match
                );


            const market =
                getMarket(
                    match
                );


            const confidence =
                getConfidence(
                    match
                );


            const risk =
                getRisk(
                    match
                );


            const decision =
                getDecision(
                    match
                );


            const riskClass =
                getRiskClass(
                    risk
                );


            const goalScore =
                getGoalScore(
                    match
                );


            const formScore =
                getFormScore(
                    match
                );


            const attackScore =
                getAttackScore(
                    match
                );


            const defenceScore =
                getDefenceScore(
                    match
                );


            const totalScore =
                getTotalScore(
                    match
                );


            const btts =
                getBTTSScore(
                    match
                );


            const over15 =
                getOver15Score(
                    match
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "match-row";


            row.innerHTML = `

                <div class="match-number">

                    ${index + 1}

                </div>


                <div>

                    <div
                        class="match-teams-small"
                    >

                        ${escapeHtml(
                            teams.home
                        )}

                        <span>
                            VS
                        </span>

                        ${escapeHtml(
                            teams.away
                        )}

                    </div>


                    <div
                        class="match-league"
                    >

                        AI ANALYSIS ·
                        Smart Gate V7

                    </div>

                </div>


                <div
                    class="match-prediction"
                >

                    ${escapeHtml(
                        prediction || "—"
                    )}

                    <span
                        class="market-small"
                    >

                        ${escapeHtml(
                            market || "—"
                        )}

                    </span>

                </div>


                <div
                    class="match-confidence"
                >

                    ${escapeHtml(
                        percentage(
                            confidence
                        )
                    )}

                </div>


                <div
                    class="match-info"
                >

                    Goal:
                    ${escapeHtml(
                        goalScore || "—"
                    )}<br>

                    Form:
                    ${escapeHtml(
                        formScore || "—"
                    )}<br>

                    Attack:
                    ${escapeHtml(
                        attackScore || "—"
                    )}<br>

                    Defence:
                    ${escapeHtml(
                        defenceScore || "—"
                    )}<br>

                    Total:
                    ${escapeHtml(
                        totalScore || "—"
                    )}<br>

                    BTTS:
                    ${escapeHtml(
                        btts || "—"
                    )}<br>

                    O1.5:
                    ${escapeHtml(
                        over15 || "—"
                    )}

                </div>


                <div>

                    <span
                        class="
                            decision
                            ${riskClass}
                        "
                    >

                        ${escapeHtml(
                            decision
                        )}

                    </span>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );


    if(state){

        state.style.display =
            "none";
    }


    if(table){

        table.style.display =
            "block";
    }
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadDashboard();

    }
);


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

window.loadDashboard =
    loadDashboard;

window.loadAPEXData =
    loadAPEXData;

window.fetchAPEXData =
    fetchAPEXData;

window.getPrediction =
    getPrediction;

window.getConfidence =
    getConfidence;

window.getMarket =
    getMarket;

window.getRisk =
    getRisk;

</script>
