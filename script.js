"use strict";

/* =========================================================
APEX PREDICT AI
FINAL DASHBOARD FRONTEND
VERSION 2.1 XL
SOURCE: AI ANALYSIS / SMART GATE V7
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
window.location.href = "./index.html";
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

function formatValue(value,fallback="—"){

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

function getValue(object,names){

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
        normaliseKey(wantedName);

    const found =
        keys.find(
            key =>
                normaliseKey(key) === wanted
        );

    if(
        found !== undefined &&
        object[found] !== null &&
        object[found] !== undefined &&
        String(object[found]).trim() !== ""
    ){

        return object[found];
    }
}

return "";

}

/* =========================================================
NUMBER HELPERS
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
AI ANALYSIS FIELD HELPERS
========================================================= */

function getMatch(match){

return getValue(
    match,
    [
        "Match"
    ]
);

}

function splitMatch(match){

const value =
    String(
        getMatch(match)
    ).trim();

if(!value){

    return {
        home:"—",
        away:"—"
    };
}

const parts =
    value.split(
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

const partsLower =
    value.split(
        /\s+v\s+/i
    );

if(partsLower.length >= 2){

    return {

        home:
            partsLower[0].trim(),

        away:
            partsLower
                .slice(1)
                .join(" v ")
                .trim()

    };
}

return {

    home:value,

    away:"—"

};

}

function getPrediction(match){

const prediction =
    getValue(
        match,
        [
            "Prediction",
            "AI Prediction"
        ]
    );

if(
    prediction !== ""
){

    return String(prediction);
}

return getValue(
    match,
    [
        "Recommended Market",
        "recommended market"
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

/* =========================================================
AI SCORE FIELDS
========================================================= */

function getGoalScore(match){

return getValue(
    match,
    ["Goal Score"]
);

}

function getFormScore(match){

return getValue(
    match,
    ["Form Score"]
);

}

function getAttackScore(match){

return getValue(
    match,
    ["Attack Score"]
);

}

function getDefenceScore(match){

return getValue(
    match,
    ["Defence Score"]
);

}

function getTotalScore(match){

return getValue(
    match,
    ["Total Score"]
);

}

function getHomeAdvantage(match){

return getValue(
    match,
    ["Home Advantage"]
);

}

function getBTTSScore(match){

return getValue(
    match,
    ["BTTS Score"]
);

}

function getOver15Score(match){

return getValue(
    match,
    ["Over 1.5 Score"]
);

}

function getOver25Score(match){

return getValue(
    match,
    ["Over 2.5 Score"]
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
    ["Odds Value"]
);

}

/* =========================================================
RESPONSE CONVERSION
========================================================= */

function convertRowsToObjects(headers,rows){

if(
    !Array.isArray(headers) ||
    !Array.isArray(rows)
){

    return [];
}

return rows.map(
    function(row){

        if(
            row &&
            typeof row === "object" &&
            !Array.isArray(row)
        ){

            return row;
        }

        const record = {};

        headers.forEach(
            function(header,index){

                record[
                    String(header).trim()
                ] =
                    Array.isArray(row)
                        ? row[index]
                        : "";

            }
        );

        return record;
    }
);

}

/* =========================================================
BACKEND RESPONSE EXTRACTION
========================================================= */

function extractRecords(payload){

if(
    !payload ||
    typeof payload !== "object"
){

    return [];
}


/*
 * 1. Direct matches array.
 */

if(
    Array.isArray(
        payload.matches
    )
){

    return payload.matches;
}


/*
 * 2. Spreadsheet response:
 *
 * {
 *   headers:[...],
 *   data:[
 *      [...],
 *      [...]
 *   ]
 * }
 *
 * THIS CHECK MUST HAPPEN BEFORE
 * RETURNING payload.data DIRECTLY.
 */

if(
    Array.isArray(
        payload.headers
    ) &&
    Array.isArray(
        payload.data
    )
){

    return convertRowsToObjects(
        payload.headers,
        payload.data
    );
}


/*
 * 3. Direct object array.
 */

if(
    Array.isArray(
        payload.data
    )
){

    return payload.data;
}


/*
 * 4. Wrapped matches.
 */

if(
    payload.data &&
    Array.isArray(
        payload.data.matches
    )
){

    return payload.data.matches;
}


/*
 * 5. Alternative backend structures.
 */

if(
    payload.matchDatabase &&
    Array.isArray(
        payload.matchDatabase.objects
    )
){

    return payload.matchDatabase.objects;
}


if(
    payload.smartGate &&
    Array.isArray(
        payload.smartGate.objects
    )
){

    return payload.smartGate.objects;
}


if(
    Array.isArray(
        payload.smartGate
    )
){

    return payload.smartGate;
}


return [];

}

/* =========================================================
VALID AI RECORD
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

return(
    matchName !== "" &&
    market !== "" &&
    confidence !== null &&
    confidence > 0
);

}

/* =========================================================
PREPARE EXACT 30
========================================================= */

function prepareMatches(source){

const result = [];

const seen =
    new Set();

const matches =
    Array.isArray(source)
        ? source
        : [];


matches.forEach(
    function(match){

        if(
            !isValidAIRecord(match)
        ){

            return;
        }


        /*
         * AI ANALYSIS is the authoritative final set.
         */

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
 * Preserve Smart Gate order when rank exists.
 * Otherwise preserve backend order.
 */

const ranked =
    result.some(
        function(match){

            return (
                numberValue(
                    getValue(
                        match,
                        [
                            "Smart Gate Rank",
                            "Rank"
                        ]
                    )
                ) !== null
            );

        }
    );


if(ranked){

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


            if(rankA === null) return 1;
            if(rankB === null) return -1;

            return rankA - rankB;

        }
    );

}


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
        type ||
        ""
    );

}

/* =========================================================
FETCH AI ANALYSIS
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
        "?sheet=" +
        encodeURIComponent(
            "AI ANALYSIS"
        ) +
        "&ts=" +
        Date.now();


    console.log(
        "APEX dashboard request:",
        url
    );


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


    console.log(
        "APEX raw response:",
        raw
    );


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


    let payload;


    try{

        payload =
            JSON.parse(raw);

    }catch(error){

        throw new Error(
            "APEX backend returned invalid JSON."
        );
    }


    if(
        String(
            payload.status ||
            ""
        ).toUpperCase() ===
        "ERROR"
    ){

        throw new Error(
            payload.message ||
            "APEX backend returned an error."
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

    clearTimeout(timeout);
}

}

/* =========================================================
RETRIES
========================================================= */

async function loadAPEXData(){

let lastError = null;


for(
    let attempt = 0;

    attempt <=
    APEX_CONFIG.RETRIES;

    attempt++
){

    try{

        return await fetchAPEXData();

    }catch(error){

        lastError = error;


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
DASHBOARD LOAD
========================================================= */

async function loadDashboard(){

try{

    setConnectionStatus(
        "🔄 Loading AI Analysis...",
        "loading"
    );


    const payload =
        await loadAPEXData();


    const source =
        extractRecords(payload);


    console.log(
        "APEX records received:",
        source.length,
        source
    );


    const matches =
        prepareMatches(source);


    console.log(
        "APEX valid calculated matches:",
        matches.length,
        matches
    );


    if(
        matches.length === 0
    ){

        throw new Error(
            "AI ANALYSIS returned records, but no valid calculated matches were found."
        );
    }


    renderDashboard(matches);


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
MAIN RENDER
========================================================= */

function renderDashboard(matches){

updateKPIs(matches);

updateFeatured(matches[0]);

updateSummary(matches);

renderMatchList(matches);

}

/* =========================================================
KPI
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


const predictionCount =
    document.getElementById(
        "predictionCount"
    );


if(predictionCount){

    predictionCount.textContent =
        matches.filter(
            function(match){

                return (
                    getPrediction(match) !== ""
                );

            }
        ).length;
}


const values =
    matches
        .map(getConfidence)
        .filter(
            function(value){

                return value !== null;
            }
        );


const best =
    values.length
        ? Math.max(...values)
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
                ).toUpperCase() ===
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
FEATURED
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

        state.className =
            "state error";

        state.textContent =
            "No calculated APEX selection available.";
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
    splitMatch(match);


const confidence =
    getConfidence(match);


const risk =
    getRisk(match);


const prediction =
    getPrediction(match);


const market =
    getMarket(match);


const league =
    getValue(
        match,
        [
            "League",
            "Competition"
        ]
    );


const featuredLeague =
    document.getElementById(
        "featuredLeague"
    );


if(featuredLeague){

    featuredLeague.textContent =
        league !== ""
            ? "🏆 " + league
            : "🤖 Smart Gate V7 · AI Analysis";
}


setText(
    "featuredHome",
    teams.home
);


setText(
    "featuredAway",
    teams.away
);


setText(
    "featuredPrediction",
    prediction || "—"
);


setText(
    "featuredConfidence",
    percentage(confidence)
);


setText(
    "featuredMarket",
    market || "—"
);


setText(
    "featuredRisk",
    risk || "UNKNOWN"
);


setText(
    "featuredStatus",
    getDecision(match)
);


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


setText(
    "featuredScore",
    score + " / 100"
);


const scoreFill =
    document.getElementById(
        "featuredScoreFill"
    );


if(scoreFill){

    scoreFill.style.width =
        score + "%";
}


setText(
    "confidenceNumber",
    percentage(confidence)
);


const progress =
    document.getElementById(
        "confidenceProgress"
    );


if(progress){

    progress.style.width =
        score + "%";
}


setText(
    "factorPrediction",
    prediction || "—"
);


setText(
    "factorMarket",
    market || "—"
);


setText(
    "factorRisk",
    risk || "—"
);


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
TEXT
========================================================= */

function setText(id,value){

const element =
    document.getElementById(id);


if(!element){

    return;
}


if(
    value === null ||
    value === undefined ||
    String(value).trim() === ""
){

    element.textContent =
        "—";

    return;
}


element.textContent =
    String(value);

}

/* =========================================================
SUMMARY
========================================================= */

function updateSummary(matches){

if(!matches.length){

    return;
}


const values =
    matches
        .map(getConfidence)
        .filter(
            function(value){

                return value !== null;
            }
        );


const average =
    values.length
        ? Math.round(
            values.reduce(
                function(total,value){

                    return total + value;

                },
                0
            ) /
            values.length
        )
        : null;


const lowRisk =
    matches.filter(
        function(match){

            return (
                String(
                    getRisk(match)
                ).toUpperCase() ===
                "LOW"
            );
        }
    ).length;


const markets = {};


matches.forEach(
    function(match){

        const market =
            getMarket(match);


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
    function(match,index){

        const teams =
            splitMatch(match);


        const prediction =
            getPrediction(match);


        const market =
            getMarket(match);


        const confidence =
            getConfidence(match);


        const risk =
            getRisk(match);


        const decision =
            getDecision(match);


        const riskClass =
            getRiskClass(risk);


        const goalScore =
            getGoalScore(match);


        const formScore =
            getFormScore(match);


        const attackScore =
            getAttackScore(match);


        const defenceScore =
            getDefenceScore(match);


        const totalScore =
            getTotalScore(match);


        const bttsScore =
            getBTTSScore(match);


        const over15Score =
            getOver15Score(match);


        const over25Score =
            getOver25Score(match);


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

                <div class="match-teams-small">

                    ${escapeHtml(
                        teams.home
                    )}

                    <span>VS</span>

                    ${escapeHtml(
                        teams.away
                    )}

                </div>

                <div class="match-league">
                    AI ANALYSIS · Smart Gate V7
                </div>

            </div>

            <div class="match-prediction">

                ${escapeHtml(
                    prediction || "—"
                )}

                <span class="market-small">

                    ${escapeHtml(
                        market || "—"
                    )}

                </span>

            </div>

            <div class="match-confidence">

                ${escapeHtml(
                    percentage(confidence)
                )}

            </div>

            <div class="match-info">

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
                    bttsScore || "—"
                )}<br>

                O1.5:
                ${escapeHtml(
                    over15Score || "—"
                )}<br>

                O2.5:
                ${escapeHtml(
                    over25Score || "—"
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


        container.appendChild(row);

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

/* =========================================================
START
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function(){

    loadDashboard();

}

);
