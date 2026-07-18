document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("team4CoachButton");
  const windowBox = document.getElementById("team4CoachWindow");
  const closeButton = document.getElementById("team4CoachClose");
  const content = document.getElementById("team4CoachContent");

  if (!button || !windowBox || !closeButton || !content) {
    console.error("Team4 Coach-ის ელემენტები ვერ მოიძებნა");
    return;
  }

  content.innerHTML = `
    <p style="margin-bottom: 15px;">
      გამარჯობა 👋 მე ვარ Team4 Coach.
    </p>

    <p style="margin-bottom: 15px;">
      დაგეხმარები შეაფასო შენი გაყიდვების დონე და იპოვო განვითარების მიმართულება.
    </p>

    <button
      id="startCoachTest"
      type="button"
      style="
        width: 100%;
        padding: 13px;
        border: none;
        border-radius: 10px;
        background: #ef1b13;
        color: white;
        font-weight: 700;
        cursor: pointer;
      "
    >
      დაიწყე შეფასება
    </button>
  `;

  windowBox.style.display = "none";

  button.addEventListener("click", function () {
    windowBox.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    windowBox.style.display = "none";
  });
});
