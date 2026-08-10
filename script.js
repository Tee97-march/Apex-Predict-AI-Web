Google Sheets Connected";

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
