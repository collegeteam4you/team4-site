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
  const startButton = document.getElementById("startCoachTest");

if (startButton) {
  startButton.addEventListener("click", function () {
    content.innerHTML = `
      <p style="margin-bottom: 15px; font-weight: 700;">
        პირველი კითხვა:
      </p>

      <p style="margin-bottom: 15px;">
        რამდენი ხანია გაყიდვებში მუშაობ?
      </p>

      <button
        type="button"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
        "
      >
        ჯერ არ მიმუშავია
      </button>

      <button
        type="button"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
        "
      >
        1 წლამდე
      </button>

      <button
        type="button"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
        "
      >
        1–3 წელი
      </button>

      <button
        type="button"
        style="
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
        "
      >
        3 წელზე მეტი
      </button>
    `;
  });
}
});
