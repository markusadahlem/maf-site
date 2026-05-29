// roboto.js — register Roboto-Regular with jsPDF for Unicode rendering.
//
// jsPDF's built-in Helvetica is a 14-glyph WinAnsi font with patchy
// non-ASCII support. Roboto gives us full Latin Extended coverage for
// German, French, Spanish, Italian, etc.
//
// The font is fetched once per page session and cached. Callers must
// await registerRoboto(pdf) before calling pdf.setFont("Roboto", ...).

let cachedBase64 = null;

async function fetchFontBase64() {
    if (cachedBase64) return cachedBase64;
    const response = await fetch("/fonts/Roboto-Regular.ttf");
    if (!response.ok) {
        throw new Error(
            `registerRoboto: failed to fetch /fonts/Roboto-Regular.ttf (${response.status})`,
        );
    }
    const buf = await response.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    cachedBase64 = btoa(binary);
    return cachedBase64;
}

export async function registerRoboto(pdf) {
    if (pdf.getFontList().Roboto) return;
    const base64 = await fetchFontBase64();
    pdf.addFileToVFS("Roboto-Regular.ttf", base64);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
}
