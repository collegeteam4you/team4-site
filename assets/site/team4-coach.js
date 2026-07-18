console.log("Team4 Coach ჩაიტვირთა");

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("team4CoachButton");
    const windowBox = document.getElementById("team4CoachWindow");
    const close = document.getElementById("team4CoachClose");

    if (!button || !windowBox || !close) {
        console.error("Team4 Coach ელემენტები ვერ მოიძებნა");
        return;
    }

    button.onclick = () => {
        windowBox.style.display = "block";
    };

    close.onclick = () => {
        windowBox.style.display = "none";
    };

    windowBox.style.display = "none";
});
