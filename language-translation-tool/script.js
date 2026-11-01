
// Get HTML elements
const translateBtn = document.getElementById("translateBtn");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");

const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");


// TRANSLATION FUNCTION
translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    // Check empty input
    if (text === "") {
        alert("Please enter some text first!");
        return;
    }

    // Check same languages
    if (sourceLang.value === targetLang.value) {
        alert("Please select two different languages!");
        return;
    }

    // Show loading message
    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";
    outputText.value = "";

    try {

        // Prepare API request
        const params = new URLSearchParams({
            q: text,
            langpair: sourceLang.value + "|" + targetLang.value
        });

        const url =
            "https://api.mymemory.translated.net/get?" +
            params.toString();

        // Send request
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network request failed.");
        }

        // Get API response
        const data = await response.json();

        if (Number(data.responseStatus) !== 200) {
            throw new Error(
                data.responseDetails || "Translation failed."
            );
        }

        // Display translated text
        outputText.value = data.responseData.translatedText;

    } catch (error) {

        outputText.value =
            "Sorry, translation failed. Please try again.";

        console.error("Translation error:", error);

    } finally {

        // Restore button
        translateBtn.disabled = false;
        translateBtn.textContent = "Translate";

    }

});


// SWAP LANGUAGES FUNCTION
swapBtn.addEventListener("click", function () {

    // Swap selected languages
    const temp = sourceLang.value;

    sourceLang.value = targetLang.value;
    targetLang.value = temp;

    // Swap text areas
    const originalText = inputText.value;

    inputText.value = outputText.value;
    outputText.value = originalText;

});


// COPY TRANSLATION FUNCTION
copyBtn.addEventListener("click", async function () {

    const translatedText = outputText.value;

    // Check empty output
    if (translatedText.trim() === "") {
        alert("No translated text to copy!");
        return;
    }

    try {

        // Copy translated text
        await navigator.clipboard.writeText(translatedText);

        alert("Translation copied successfully!");

    } catch (error) {

        alert("Unable to copy. Please try again.");

        console.error("Copy error:", error);

    }

});

// CHARACTER COUNTER
const charCount = document.getElementById("charCount");
const maxCharacters = 500;

inputText.addEventListener("input", function () {
    const count = inputText.value.length;

    charCount.textContent = count + " / " + maxCharacters;
});
// CLEAR BUTTON FUNCTION
clearBtn.addEventListener("click", function () {
    inputText.value = "";
    outputText.value = "";

    charCount.textContent = "0 / 500";
});