<script>
"use strict";

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbxeZN80_WiP4hNmfbCMlmFDFHsuZ6QMpW7tDce4MRS8ya6RZQJ0F5DK8OPRaUBGiQfOsw/exec";

const GOOGLE_SHEETS_TIMEOUT = 45000;

function setConnectionStatus(message, type) {
    const element =
        document.getElementById("connectionStatus");

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "connection " + type;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatValue(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    return escapeHtml(value);
}

function getMatches(data) {
    if (
        data &&
        Array.isArray(data.matches)
    ) {
        return data.matches;
    }

    if (
        data &&
        data.matchDatabase &&
        Array.isArray(data.matchDatabase.objects)
    ) {
        return data.matchDatabase.objects;
    }

    if (
        data &&
        data.smartGate &&
        Array.isArray(data.smartGate.objects)
    ) {
        return data.smartGate.objects;
    }

    return [];
}

async function fetchAPEXData() {
    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            GOOGLE_SHEETS_TIMEOUT
        );

    try {
        const response =
            await fetch(
                GOOGLE_SHEETS_API +
                "?request=dashboard&ts=" +
                Date.now(),
                {
                    method: "GET",
                    cache: "no-store",
                    redirect: "follow",
                    signal: controller.signal
                }
            );

        if (!response.ok) {
            throw new Error(
                "HTTP " + response.status
            );
        }

        const data =
            await response.json();

        if (
            data &&
            String(data.status).toUpperCase() ===
            "ERROR"
        ) {
            throw new Error(
                data.message ||
                "APEX backend error"
            );
        }

        return data;

    } finally {
        clearTimeout(timeout);
    }
}

function renderDashboard(data) {
    const matches =
        getMatches(data);

    const limited =
        matches.slice(0, 30);

    const scores =
        limited
            .map(
                match =>
                    Number(
                        match["Final confidence"] ??
                        match["Final Confidence"] ??
                        match["Confidence %"] ??
                        0
                    )
            )
            .filter(
                Number.isFinite
            );

    const best =
        scores.length
            ? Math.max(...scores)
            : null;

    const lowRisk =
        limited.filter(
            match =>
                String(
                    match["Risk Level"] || ""
                ).toLowerCase() === "low"
        ).length;

    const matchesCount =
        document.getElementById(
            "matchesCount"
        );

    const bestConfidence =
        document.getElementById(
            "bestConfidence"
        );

    const bestConfidenceNote =
        document.getElementById(
            "bestConfidenceNote"
        );

    const predictionCount =
        document.getElementById(
            "predictionCount"
        );

    const lowRiskCount =
        document.getElementById(
            "lowRiskCount"
        );

    if (matchesCount) {
        matchesCount.textContent =
            limited.length;
    }

    if (bestConfidence) {
        bestConfidence.textContent =
            best === null
                ? "—"
                : best + "%";
    }

    if (bestConfidenceNote) {
        bestConfidenceNote.textContent =
            best === null
                ? "Waiting for AI data"
                : "Highest final confidence";
    }

    if (predictionCount) {
        predictionCount.textContent =
            limited.length;
    }

    if (lowRiskCount) {
        lowRiskCount.textContent =
            lowRisk;
    }

    const featured =
        limited[0];

    const featuredContainer =
        document.getElementById(
            "featuredMatch"
        );

    if (featuredContainer) {
        if (!featured) {
            featuredContainer.innerHTML =
                '<div class="state">No matches available.</div>';
        } else {
            const finalConfidence =
                featured["Final confidence"] ??
                featured["Final Confidence"] ??
                featured["Confidence %"] ??
                "—";

            featuredContainer.innerHTML = `
                <div class="featured-league">
                    ${formatValue(featured["League"])}
                </div>

                <div class="featured-teams">
                    <div class="team">
                        ${formatValue(featured["Home Team"])}
                    </div>

                    <div class="vs">VS</div>

                    <div class="team">
                        ${formatValue(featured["Away Team"])}
                    </div>
                </div>

                <div class="featured-prediction">
                    <span class="featured-prediction-label">
                        TOP AI PREDICTION
                    </span>

                    <span class="featured-prediction-value">
                        ${formatValue(featured["Prediction"])}
                    </span>
                </div>

                <div class="featured-metrics">
                    <div class="featured-metric">
                        <div class="featured-metric-title">
                            CONFIDENCE
                        </div>

                        <div class="featured-metric-value green">
                            ${formatValue(finalConfidence)}%
                        </div>
                    </div>

                    <div class="featured-metric">
                        <div class="featured-metric-title">
                            RISK
                        </div>

                        <div class="featured-metric-value">
                            ${formatValue(featured["Risk Level"])}
                        </div>
                    </div>

                    <div class="featured-metric">
                        <div class="featured-metric-title">
                            MARKET
                        </div>

                        <div class="featured-metric-value">
                            ${formatValue(featured["recommended market"])}
                        </div>
                    </div>

                    <div class="featured-metric">
                        <div class="featured-metric-title">
                            LEAGUE
                        </div>

                        <div class="featured-metric-value">
                            ${formatValue(featured["League"])}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    const analysis =
        document.getElementById(
            "analysisSummary"
        );

    if (analysis) {
        analysis.innerHTML = `
            <div class="summary-grid">
                <div class="summary-box">
                    <span>Selected matches</span>
                    <strong>${limited.length}</strong>
                </div>

                <div class="summary-box">
                    <span>Average confidence</span>
                    <strong>
                        ${
                            scores.length
                                ? Math.round(
                                    scores.reduce(
                                        (a, b) => a + b,
                                        0
                                    ) / scores.length
                                ) + "%"
                                : "—"
                        }
                    </strong>
                </div>

                <div class="summary-box">
                    <span>Most common market</span>
                    <strong>
                        ${
                            limited[0]
                                ? formatValue(
                                    limited[0]["recommended market"]
                                )
                                : "—"
                        }
                    </strong>
                </div>

                <div class="summary-box">
                    <span>Data status</span>
                    <strong>Connected</strong>
                </div>
            </div>
        `;
    }

    const confidence =
        document.getElementById(
            "confidenceSummary"
        );

    const factors =
        document.getElementById(
            "factorSummary"
        );

    if (confidence && featured) {
        const score =
            Number(
                featured["Final confidence"] ??
                featured["Final Confidence"] ??
                featured["Confidence %"] ??
                0
            );

        confidence.innerHTML = `
            <div class="confidence-center">
                <div class="confidence-number">
                    ${formatValue(score)}%
                </div>

                <div class="confidence-label">
                    Final Confidence
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:${Math.max(0, Math.min(100, score))}%"
                    ></div>
                </div>
            </div>
        `;
    }

    if (factors && featured) {
        factors.innerHTML = `
            <div class="factor-row">
                <span class="factor-name">
                    Prediction
                </span>

                <span class="factor-value">
                    ${formatValue(featured["Prediction"])}
                </span>
            </div>

            <div class="factor-row">
                <span class="factor-name">
                    Market
                </span>

                <span class="factor-value">
                    ${formatValue(featured["recommended market"])}
                </span>
            </div>

            <div class="factor-row">
                <span class="factor-name">
                    Risk
                </span>

                <span class="factor-value">
                    ${formatValue(featured["Risk Level"])}
                </span>
            </div>
        `;
    }

    const list =
        document.getElementById(
            "matchList"
        );

    if (list) {
        if (!limited.length) {
            list.innerHTML =
                '<div class="state">No matches available.</div>';
        } else {
            list.innerHTML =
                limited
                    .map(
                        (match, index) => {
                            const confidence =
                                match["Final confidence"] ??
                                match["Final Confidence"] ??
                                match["Confidence %"] ??
                                "—";

                            return `
                                <div class="match-row">
                                    <div class="match-number">
                                        ${index + 1}
                                    </div>

                                    <div>
                                        <div class="match-teams-small">
                                            ${formatValue(match["Home Team"])}
                                            <span>VS</span>
                                            ${formatValue(match["Away Team"])}
                                        </div>

                                        <div class="match-league">
                                            ${formatValue(match["League"])}
                                        </div>
                                    </div>

                                    <div class="match-prediction">
                                        ${formatValue(match["Prediction"])}

                                        <span class="market-small">
                                            ${formatValue(match["recommended market"])}
                                        </span>
                                    </div>

                                    <div class="match-confidence">
                                        ${formatValue(confidence)}%
                                    </div>

                                    <div class="match-info">
                                        ${formatValue(match["recommended market"])}
                                    </div>

                                    <div>
                                        <span class="decision ${
                                            String(match["Risk Level"] || "")
                                                .toLowerCase()
                                        }">
                                            ${formatValue(match["Risk Level"])}
                                        </span>
                                    </div>
                                </div>
                            `;
                        }
                    )
                    .join("");
        }
    }
}

async function initializeAPEXDashboard() {
    try {
        setConnectionStatus(
            "🔄 Connecting to APEX AI...",
            "loading"
        );

        const data =
            await fetchAPEXData();

        renderDashboard(data);

        setConnectionStatus(
            "✅ APEX AI Connected",
            "success"
        );

    } catch (error) {
        console.error(error);

        setConnectionStatus(
            "❌ APEX connection failed",
            "error"
        );

        [
            "featuredMatch",
            "analysisSummary",
            "confidenceSummary",
            "matchList"
        ].forEach(id => {
            const element =
                document.getElementById(id);

            if (element) {
                element.innerHTML =
                    '<div class="state error">APEX dashboard data could not be loaded.</div>';
            }
        });
    }
}

window.login = function () {
    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");

    if (
        !username ||
        !password ||
        (
            username.value.trim() &&
            password.value.trim()
        )
    ) {
        window.location.href =
            "./dashboard.html";
    } else {
        alert(
            "Please enter your username and password."
        );
    }
};

window.logout = function () {
    if (confirm("Logout from APEX Predict AI?")) {
        window.location.href = "./index.html";
    }
};

window.openDashboard = () =>
    window.location.href = "./dashboard.html";

window.openPredictions = () =>
    window.location.href = "./predictions.html";

window.openAnalysis = () =>
    window.location.href = "./analysis.html";

window.openStatistics = () =>
    window.location.href = "./statistics.html";

window.openLiveScores = () =>
    window.location.href = "./livescores.html";

window.openLeagues = () =>
    window.location.href = "./leagues.html";

window.openHeadToHead = () =>
    window.location.href = "./head2head.html";

window.openSettings = () =>
    window.location.href = "./settings.html";

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeAPEXDashboard
    );
} else {
    initializeAPEXDashboard();
}
</script>
