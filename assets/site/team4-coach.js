document.addEventListener("DOMContentLoaded", function () {
  const coachState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    categoryScores: {},
    resultTitle: "",
    resultDescription: "",
    strongestCategory: "",
    weakestCategory: ""
  };

  const questions = [
    {
      category: "experience",
      categoryName: "გამოცდილება",
      question: "რამდენი ხანია გაყიდვებში მუშაობ?",
      answers: [
        { text: "ჯერ არ მიმუშავია", score: 0 },
        { text: "1 წლამდე", score: 1 },
        { text: "1–3 წელი", score: 2 },
        { text: "3 წელზე მეტი", score: 3 }
      ]
    },
    {
      category: "results",
      categoryName: "შედეგები",
      question: "რამდენად ხშირად ასრულებ გაყიდვების გეგმას?",
      answers: [
        { text: "თითქმის არასდროს", score: 0 },
        { text: "ზოგჯერ", score: 1 },
        { text: "უმეტეს შემთხვევაში", score: 2 },
        { text: "თითქმის ყოველთვის", score: 3 }
      ]
    },
    {
      category: "communication",
      categoryName: "კომუნიკაცია",
      question: "რამდენად მარტივად ახერხებ კლიენტის დაინტერესებას?",
      answers: [
        { text: "ძალიან მიჭირს", score: 0 },
        { text: "ხშირად მიჭირს", score: 1 },
        { text: "უმეტესად გამომდის", score: 2 },
        { text: "ძალიან კარგად გამომდის", score: 3 }
      ]
    },
    {
      category: "discovery",
      categoryName: "საჭიროების გამოვლენა",
      question: "რამდენად ხშირად უსვამ კლიენტს კითხვებს მისი რეალური საჭიროების გასაგებად?",
      answers: [
        { text: "თითქმის არასდროს", score: 0 },
        { text: "ზოგჯერ", score: 1 },
        { text: "ხშირად", score: 2 },
        { text: "ყოველთვის სისტემურად", score: 3 }
      ]
    },
    {
      category: "objections",
      categoryName: "წინააღმდეგობების დამუშავება",
      question: "როგორ უმკლავდები ფასზე წინააღმდეგობას?",
      answers: [
        { text: "ხშირად ვიბნევი ან ფასდაკლებას ვთავაზობ", score: 0 },
        { text: "ზოგჯერ გამომდის პასუხის გაცემა", score: 1 },
        { text: "უმეტესად ღირებულებით ვამუშავებ", score: 2 },
        { text: "სისტემურად ვმართავ და იშვიათად ვკარგავ კლიენტს", score: 3 }
      ]
    },
    {
      category: "followup",
      categoryName: "Follow-up",
      question: "რამდენჯერ აკეთებ Follow-up-ს კლიენტთან, თუ პირველივე საუბარში არ ყიდულობს?",
      answers: [
        { text: "აღარ ვუკავშირდები", score: 0 },
        { text: "ერთხელ", score: 1 },
        { text: "2–3-ჯერ", score: 2 },
        { text: "სისტემურად, შედეგამდე", score: 3 }
      ]
    },
    {
      category: "closing",
      categoryName: "გარიგების დახურვა",
      question: "რამდენად თავდაჯერებულად ითხოვ გარიგების დახურვას?",
      answers: [
        { text: "იშვიათად ვთხოვ პირდაპირ", score: 0 },
        { text: "ზოგჯერ ვცდილობ", score: 1 },
        { text: "უმეტეს შემთხვევაში ვთხოვ", score: 2 },
        { text: "ყოველთვის სწორი მომენტის შერჩევით", score: 3 }
      ]
    },
    {
      category: "leads",
      categoryName: "ლიდების გენერაცია",
      question: "გაქვს თუ არა ლიდების მოძიების სტაბილური სისტემა?",
      answers: [
        { text: "არა, შემთხვევით ლიდებზე ვარ დამოკიდებული", score: 0 },
        { text: "ზოგჯერ ვეძებ ახალ ლიდებს", score: 1 },
        { text: "რამდენიმე წყარო მაქვს", score: 2 },
        { text: "მაქვს სტაბილური და გაზომვადი სისტემა", score: 3 }
      ]
    },
    {
      category: "crm",
      categoryName: "კლიენტების მართვა",
      question: "როგორ მართავ კლიენტებისა და გარიგებების ინფორმაციას?",
      answers: [
        { text: "არ ვიწერ", score: 0 },
        { text: "ჩანაწერებში ან ტელეფონში", score: 1 },
        { text: "ცხრილში ან მარტივ სისტემაში", score: 2 },
        { text: "CRM-ში და ყველა ეტაპს ვაკონტროლებ", score: 3 }
      ]
    },
    {
      category: "analysis",
      categoryName: "ანალიზი",
      question: "რამდენად ხშირად აანალიზებ საკუთარ გაყიდვების შედეგებს?",
      answers: [
        { text: "არასდროს", score: 0 },
        { text: "იშვიათად", score: 1 },
        { text: "ყოველთვიურად", score: 2 },
        { text: "ყოველკვირეულად და გადაწყვეტილებებსაც ვცვლი", score: 3 }
      ]
    }
  ];

  const button = document.getElementById("team4CoachButton");
  const windowBox = document.getElementById("team4CoachWindow");
  const closeButton = document.getElementById("team4CoachClose");
  const content = document.getElementById("team4CoachContent");

  if (!button || !windowBox || !closeButton || !content) {
    console.error("Team4 Coach-ის ელემენტები ვერ მოიძებნა");
    return;
  }

  windowBox.style.display = "none";

  function resetCoach() {
    coachState.currentQuestion = 0;
    coachState.score = 0;
    coachState.answers = [];
    coachState.categoryScores = {};
    coachState.resultTitle = "";
    coachState.resultDescription = "";
    coachState.strongestCategory = "";
    coachState.weakestCategory = "";
  }

  function showStartScreen() {
    content.innerHTML = `
      <p style="margin-bottom: 12px; font-weight: 700;">
        გამარჯობა 👋 მე ვარ Team4 Coach.
      </p>

      <p style="margin-bottom: 15px; line-height: 1.5;">
        უპასუხე 10 კითხვას და მიიღე შენი გაყიდვების უნარების პერსონალური შეფასება.
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
  }

  function showQuestion() {
    const currentQuestion = questions[coachState.currentQuestion];

    if (!currentQuestion) {
      prepareResult();
      showContactForm();
      return;
    }

    const progress = Math.round(
      ((coachState.currentQuestion + 1) / questions.length) * 100
    );

    const answerButtons = currentQuestion.answers
      .map(function (answer, index) {
        return `
          <button
            type="button"
            class="coach-answer"
            data-answer-index="${index}"
            style="
              width: 100%;
              padding: 12px;
              margin-bottom: 8px;
              border: 1px solid #dddddd;
              border-radius: 10px;
              background: white;
              color: #111111;
              font-weight: 600;
              cursor: pointer;
              text-align: left;
            "
          >
            ${answer.text}
          </button>
        `;
      })
      .join("");

    content.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 13px; color: #777777;">
        კითხვა ${coachState.currentQuestion + 1} / ${questions.length}
      </p>

      <div
        style="
          width: 100%;
          height: 6px;
          margin-bottom: 16px;
          border-radius: 10px;
          background: #eeeeee;
          overflow: hidden;
        "
      >
        <div
          style="
            width: ${progress}%;
            height: 100%;
            background: #ef1b13;
            transition: width 0.3s ease;
          "
        ></div>
      </div>

      <p style="margin-bottom: 15px; font-weight: 700; line-height: 1.45;">
        ${currentQuestion.question}
      </p>

      ${answerButtons}
    `;
  }

  function prepareResult() {
    const maximumScore = questions.length * 3;
    const percentage = Math.round((coachState.score / maximumScore) * 100);

    if (percentage <= 30) {
      coachState.resultTitle = "საწყისი დონე";
      coachState.resultDescription =
        "შენ ახლა გაყიდვების საფუძვლების ჩამოყალიბების ეტაპზე ხარ. შედეგის გასაზრდელად საჭიროა კომუნიკაციის, საჭიროების გამოვლენის, Follow-up-ისა და გარიგების დახურვის სისტემური განვითარება.";
    } else if (percentage <= 55) {
      coachState.resultTitle = "განვითარებადი დონე";
      coachState.resultDescription =
        "შენ უკვე გაქვს გარკვეული პრაქტიკული უნარები, თუმცა შედეგები ჯერ არ არის სტაბილური. მთავარი ამოცანაა სუსტი მიმართულებების გაძლიერება და გაყიდვების პროცესის სისტემაში მოქცევა.";
    } else if (percentage <= 80) {
      coachState.resultTitle = "ძლიერი დონე";
      coachState.resultDescription =
        "შენ გაქვს გაყიდვების კარგი საფუძველი და ბევრ მიმართულებაში ეფექტურად მუშაობ. შემდეგი ეტაპია შედეგების გაზომვა, სტაბილური ლიდების სისტემა და კონვერსიის ზრდა.";
    } else {
      coachState.resultTitle = "პროფესიონალური დონე";
      coachState.resultDescription =
        "შენ გაყიდვების პროცესს თავდაჯერებულად და სისტემურად მართავ. განვითარების შემდეგი ეტაპია პროცესების მასშტაბირება, მაღალი ღირებულების გარიგებები და გუნდის შედეგების მართვა.";
    }

    const sortedCategories = Object.entries(coachState.categoryScores).sort(
      function (firstCategory, secondCategory) {
        return secondCategory[1].score - firstCategory[1].score;
      }
    );

    if (sortedCategories.length > 0) {
      coachState.strongestCategory = sortedCategories[0][1].name;
      coachState.weakestCategory =
        sortedCategories[sortedCategories.length - 1][1].name;
    }
  }

  function showContactForm() {
    content.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 13px; color: #777777;">
        შენი შედეგი მზად არის
      </p>

      <p style="margin-bottom: 10px; font-size: 20px; font-weight: 800;">
        მიიღე სრული ანალიზი
      </p>

      <p style="margin-bottom: 15px; line-height: 1.5;">
        შეავსე ინფორმაცია და ნახე შენი დონე, ძლიერი მიმართულება და მთავარი გასაუმჯობესებელი უნარი.
      </p>

      <input
        id="coachName"
        type="text"
        placeholder="სახელი"
        autocomplete="name"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
        "
      >

      <input
        id="coachPhone"
        type="tel"
        placeholder="ტელეფონის ნომერი"
        autocomplete="tel"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
        "
      >

      <input
        id="coachEmail"
        type="email"
        placeholder="ელფოსტა"
        autocomplete="email"
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
        "
      >

      <button
        id="showCoachResult"
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
        შედეგის მიღება
      </button>

      <p
        id="coachFormError"
        style="
          display: none;
          margin-top: 10px;
          color: #ef1b13;
          font-size: 13px;
        "
      >
        შეავსე ყველა ველი სწორად
      </p>
    `;
  }

  function showFinalResult(name) {
    const maximumScore = questions.length * 3;
    const percentage = Math.round((coachState.score / maximumScore) * 100);

    content.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 13px; color: #777777;">
        შეფასება დასრულებულია
      </p>

      <p style="margin-bottom: 6px; font-weight: 700;">
        ${name}, შენი შედეგია:
      </p>

      <p style="margin-bottom: 10px; font-size: 21px; font-weight: 800;">
        ${coachState.resultTitle}
      </p>

      <p style="margin-bottom: 14px; line-height: 1.5;">
        ${coachState.resultDescription}
      </p>

      <div
        style="
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 10px;
          background: #f5f5f5;
        "
      >
        <p style="margin: 0 0 6px; font-weight: 700;">
          შენი შედეგი: ${coachState.score} / ${maximumScore}
        </p>

        <p style="margin: 0;">
          შეფასება: ${percentage}%
        </p>
      </div>

      <div
        style="
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 10px;
          background: #f5f5f5;
        "
      >
        <p style="margin: 0 0 5px; font-weight: 700;">
          ძლიერი მიმართულება
        </p>

        <p style="margin: 0;">
          ${coachState.strongestCategory}
        </p>
      </div>

      <div
        style="
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 10px;
          background: #fff0ef;
        "
      >
        <p style="margin: 0 0 5px; font-weight: 700;">
          მთავარი გასაუმჯობესებელი მიმართულება
        </p>

        <p style="margin: 0;">
          ${coachState.weakestCategory}
        </p>
      </div>

      <button
        id="restartCoachTest"
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
        თავიდან დაწყება
      </button>
    `;
  }

  showStartScreen();

  button.addEventListener("click", function () {
    windowBox.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    windowBox.style.display = "none";
  });

  content.addEventListener("click", function (event) {
    if (event.target.id === "startCoachTest") {
      resetCoach();
      showQuestion();
      return;
    }

    if (event.target.classList.contains("coach-answer")) {
      const answerIndex = Number(event.target.dataset.answerIndex);
      const currentQuestion = questions[coachState.currentQuestion];
      const selectedAnswer = currentQuestion.answers[answerIndex];

      if (!selectedAnswer) {
        return;
      }

      coachState.score += selectedAnswer.score;

      if (!coachState.categoryScores[currentQuestion.category]) {
        coachState.categoryScores[currentQuestion.category] = {
          name: currentQuestion.categoryName,
          score: 0
        };
      }

      coachState.categoryScores[currentQuestion.category].score +=
        selectedAnswer.score;

      coachState.answers.push({
        category: currentQuestion.categoryName,
        question: currentQuestion.question,
        answer: selectedAnswer.text,
        score: selectedAnswer.score
      });

      coachState.currentQuestion += 1;
      showQuestion();
      return;
    }

    if (event.target.id === "showCoachResult") {
      const nameInput = document.getElementById("coachName");
      const phoneInput = document.getElementById("coachPhone");
      const emailInput = document.getElementById("coachEmail");
      const errorMessage = document.getElementById("coachFormError");

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();

      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !phone || !email || !emailIsValid) {
        errorMessage.style.display = "block";
        return;
      }

      errorMessage.style.display = "none";

      console.log("Team4 Coach ლიდი:", {
        name: name,
        phone: phone,
        email: email,
        score: coachState.score,
        result: coachState.resultTitle,
        strongestCategory: coachState.strongestCategory,
        weakestCategory: coachState.weakestCategory,
        answers: coachState.answers
      });

      showFinalResult(name);
      return;
    }

    if (event.target.id === "restartCoachTest") {
      resetCoach();
      showQuestion();
    }
  });
});
