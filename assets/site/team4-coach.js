document.addEventListener("DOMContentLoaded", function () {
  const coachState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    categoryScores: {},
    resultTitle: "",
    resultDescription: "",
    strengths: [],
    developmentAreas: [],
    contact: {
      name: "",
      phone: "",
      email: ""
    }
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
      categoryName: "შედეგების მართვა",
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
      categoryName: "კლიენტის დაინტერესება",
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
      question:
        "რამდენად ხშირად უსვამ კლიენტს კითხვებს მისი რეალური საჭიროების გასაგებად?",
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
        {
          text: "ხშირად ვიბნევი ან ფასდაკლებას ვთავაზობ",
          score: 0
        },
        {
          text: "ზოგჯერ გამომდის პასუხის გაცემა",
          score: 1
        },
        {
          text: "უმეტესად ღირებულებით ვამუშავებ",
          score: 2
        },
        {
          text: "სისტემურად ვმართავ და იშვიათად ვკარგავ კლიენტს",
          score: 3
        }
      ]
    },
    {
      category: "followup",
      categoryName: "Follow-up",
      question:
        "რამდენჯერ აკეთებ Follow-up-ს კლიენტთან, თუ პირველივე საუბარში არ ყიდულობს?",
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
        {
          text: "არა, შემთხვევით ლიდებზე ვარ დამოკიდებული",
          score: 0
        },
        { text: "ზოგჯერ ვეძებ ახალ ლიდებს", score: 1 },
        { text: "რამდენიმე წყარო მაქვს", score: 2 },
        {
          text: "მაქვს სტაბილური და გაზომვადი სისტემა",
          score: 3
        }
      ]
    },
    {
      category: "crm",
      categoryName: "CRM და კლიენტების მართვა",
      question: "როგორ მართავ კლიენტებისა და გარიგებების ინფორმაციას?",
      answers: [
        { text: "არ ვიწერ", score: 0 },
        { text: "ჩანაწერებში ან ტელეფონში", score: 1 },
        { text: "ცხრილში ან მარტივ სისტემაში", score: 2 },
        {
          text: "CRM-ში და ყველა ეტაპს ვაკონტროლებ",
          score: 3
        }
      ]
    },
    {
      category: "analysis",
      categoryName: "გაყიდვების ანალიზი",
      question: "რამდენად ხშირად აანალიზებ საკუთარ გაყიდვების შედეგებს?",
      answers: [
        { text: "არასდროს", score: 0 },
        { text: "იშვიათად", score: 1 },
        { text: "ყოველთვიურად", score: 2 },
        {
          text: "ყოველკვირეულად და გადაწყვეტილებებსაც ვცვლი",
          score: 3
        }
      ]
    }
  ];

  const improvementRecommendations = {
    communication: {
      title: "კლიენტის დაინტერესება",
      text:
        "დაიწყე საუბარი არა პროდუქტის აღწერით, არამედ კლიენტის პრობლემით. გამოიყენე მოკლე გახსნა, ძლიერი კითხვა და კლიენტისთვის მნიშვნელოვანი შედეგი. მიზანი პირველ ეტაპზე გაყიდვა კი არა, საუბრის გაგრძელებაა."
    },
    discovery: {
      title: "საჭიროების გამოვლენა",
      text:
        "გამოიყენე ღია კითხვები: რა სურს კლიენტს, რატომ არის ეს მნიშვნელოვანი, რა უშლის ხელს და რა შედეგს ელოდება. სანამ შეთავაზებას გააკეთებ, ჯერ კლიენტის რეალური მოტივი და გადაწყვეტილების კრიტერიუმები დაადგინე."
    },
    objections: {
      title: "წინააღმდეგობების დამუშავება",
      text:
        "არ იჩქარო პასუხის გაცემა და ფასდაკლების შეთავაზება. ჯერ დააზუსტე წინააღმდეგობის მიზეზი, დაადასტურე კლიენტის პოზიცია და შემდეგ დაუკავშირე პროდუქტის ღირებულება მის რეალურ საჭიროებას."
    },
    closing: {
      title: "გარიგების დახურვა",
      text:
        "საუბრის ბოლოს გამოიყენე კონკრეტული შემდეგი ნაბიჯი. მაგალითად: „რომელი ვარიანტით დავიწყოთ?“ ან „შეგვიძლია დღესვე გავაფორმოთ?“ დახურვა ზეწოლა არ არის — ეს კლიენტისთვის გადაწყვეტილების მიღებაში დახმარებაა."
    },
    leads: {
      title: "ლიდების გენერაცია",
      text:
        "შექმენი მინიმუმ სამი სტაბილური ლიდის წყარო: სოციალური ქსელები, რეკომენდაციები და პირდაპირი კომუნიკაცია. ყოველ კვირას გაზომე რამდენი ახალი ლიდი მიიღე თითოეული წყაროდან და რომელი მათგანი გადაიქცა რეალურ გაყიდვად."
    },
    followup: {
      title: "Follow-up",
      text:
        "ერთი უპასუხო შეტყობინება უარს არ ნიშნავს. წინასწარ დაგეგმე მინიმუმ 3–5 განსხვავებული Follow-up: დამატებითი ინფორმაცია, ახალი ღირებულება, შეკითხვა, შეხსენება და კონკრეტული შეთავაზება."
    },
    crm: {
      title: "CRM და კლიენტების მართვა",
      text:
        "ყველა კლიენტს დაუფიქსირე სტატუსი, ბოლო კომუნიკაცია და შემდეგი ნაბიჯის თარიღი. თუნდაც მარტივი CRM ან ცხრილი გამოიყენო, არცერთი პერსპექტიული კლიენტი არ უნდა დაიკარგოს მხოლოდ იმიტომ, რომ დროულად არ დაუკავშირდი."
    },
    analysis: {
      title: "გაყიდვების ანალიზი",
      text:
        "ყოველკვირეულად გაზომე ახალი ლიდები, შეხვედრები, შეთავაზებები, დახურული გარიგებები და კონვერსია. შედეგი მხოლოდ საბოლოო გაყიდვა არ არის — უნდა იცოდე, გაყიდვების რომელ ეტაპზე კარგავ ყველაზე მეტ კლიენტს."
    },
    strategy: {
      title: "გაყიდვების სტრატეგია",
      text:
        "განსაზღვრე ზუსტად ვის ყიდი, რა პრობლემას უგვარებ და რატომ უნდა აირჩიოს კლიენტმა შენი შეთავაზება. შემდეგ გაყიდვების ყველა ეტაპი — ლიდიდან დახურვამდე — ერთ სისტემაში მოაქციე და თითოეული ეტაპისთვის კონკრეტული მაჩვენებელი შექმენი."
    },
    all: {
      title: "გაყიდვების სრული სისტემის განვითარება",
      text:
        "დაიწყე სრული გაყიდვების პროცესის რუკით: ლიდის მოძიება, პირველი კონტაქტი, საჭიროების გამოვლენა, შეთავაზება, წინააღმდეგობები, დახურვა და Follow-up. შემდეგ ყოველ კვირას მხოლოდ ერთ ეტაპზე იმუშავე და მიღებული შედეგი გაზომე."
    }
  };

  const button = document.getElementById("team4CoachButton");
  const windowBox = document.getElementById("team4CoachWindow");
  const closeButton = document.getElementById("team4CoachClose");
  const content = document.getElementById("team4CoachContent");

  if (!button || !windowBox || !closeButton || !content) {
    console.error("Team4 Coach-ის ელემენტები ვერ მოიძებნა");
    return;
  }

  windowBox.style.display = "none";

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function resetCoach() {
    coachState.currentQuestion = 0;
    coachState.score = 0;
    coachState.answers = [];
    coachState.categoryScores = {};
    coachState.resultTitle = "";
    coachState.resultDescription = "";
    coachState.strengths = [];
    coachState.developmentAreas = [];
    coachState.contact = {
      name: "",
      phone: "",
      email: ""
    };
  }

  function showStartScreen() {
    content.innerHTML = `
      <p style="margin: 0 0 12px; font-size: 19px; font-weight: 800;">
        გამარჯობა 👋 მე ვარ Team4 Coach
      </p>

      <p style="margin: 0 0 16px; line-height: 1.55; color: #444444;">
        უპასუხე 10 კითხვას და მიიღე შენი გაყიდვების პროფილის პერსონალური შეფასება.
      </p>

      <button
        id="startCoachTest"
        type="button"
        style="
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #ef1b13;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        "
      >
        შეფასების დაწყება
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
              padding: 13px;
              margin-bottom: 9px;
              border: 1px solid #e1e1e1;
              border-radius: 11px;
              background: #ffffff;
              color: #161616;
              font-size: 14px;
              font-weight: 600;
              line-height: 1.4;
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
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: #777777;
        "
      >
        <span>კითხვა ${coachState.currentQuestion + 1} / ${questions.length}</span>
        <span>${progress}%</span>
      </div>

      <div
        style="
          width: 100%;
          height: 6px;
          margin-bottom: 18px;
          border-radius: 10px;
          background: #eeeeee;
          overflow: hidden;
        "
      >
        <div
          style="
            width: ${progress}%;
            height: 100%;
            border-radius: 10px;
            background: #ef1b13;
            transition: width 0.3s ease;
          "
        ></div>
      </div>

      <p
        style="
          margin: 0 0 16px;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.45;
        "
      >
        ${currentQuestion.question}
      </p>

      ${answerButtons}
    `;
  }

  function prepareResult() {
    const maximumScore = questions.length * 3;
    const percentage = Math.round(
      (coachState.score / maximumScore) * 100
    );

    if (percentage <= 30) {
      coachState.resultTitle = "საწყისი გაყიდვების პროფილი";
      coachState.resultDescription =
        "შენი პასუხების მიხედვით, ახლა გაყიდვების ძირითადი უნარების ჩამოყალიბების ეტაპზე ხარ. სწორი სისტემით და პრაქტიკით შედეგის სწრაფად გაუმჯობესება შესაძლებელია.";
    } else if (percentage <= 55) {
      coachState.resultTitle = "განვითარებადი გაყიდვების პროფილი";
      coachState.resultDescription =
        "შენ უკვე გაქვს პრაქტიკული გამოცდილება, თუმცა შედეგები ყველა მიმართულებით ჯერ სტაბილური არ არის. პროგრესისთვის საჭიროა სუსტი ეტაპების გამყარება და პროცესის სისტემატიზაცია.";
    } else if (percentage <= 80) {
      coachState.resultTitle = "ძლიერი გაყიდვების პროფილი";
      coachState.resultDescription =
        "შენი პასუხები აჩვენებს, რომ გაყიდვების ძირითად ეტაპებს კარგად მართავ. შემდეგი ნაბიჯია სტაბილური სისტემის შექმნა, კონვერსიის ზრდა და შედეგების უფრო ზუსტი მართვა.";
    } else {
      coachState.resultTitle = "სისტემური პროფესიონალის პროფილი";
      coachState.resultDescription =
        "შენი პასუხების მიხედვით, გაყიდვების პროცესს მაღალი მზაობით მართავ. განვითარებისთვის ყურადღება უნდა გადაიტანო პროცესების მასშტაბირებაზე, სიზუსტესა და სტაბილურ შედეგებზე.";
    }

    const sortedCategories = Object.entries(
      coachState.categoryScores
    ).sort(function (firstCategory, secondCategory) {
      return secondCategory[1].score - firstCategory[1].score;
    });

    coachState.strengths = sortedCategories
      .filter(function (category) {
        return category[1].score >= 2;
      })
      .slice(0, 3)
      .map(function (category) {
        return category[1].name;
      });

    coachState.developmentAreas = [...sortedCategories]
      .reverse()
      .filter(function (category) {
        return category[1].score <= 2;
      })
      .slice(0, 2)
      .map(function (category) {
        return category[1].name;
      });

    if (coachState.strengths.length === 0) {
      coachState.strengths = [
        "განვითარების სურვილი",
        "საკუთარი უნარების შეფასებისთვის მზაობა"
      ];
    }

    if (coachState.developmentAreas.length === 0) {
      coachState.developmentAreas = [
        "პროცესების მასშტაბირება",
        "შედეგების სტაბილურობის გაზრდა"
      ];
    }
  }

  function showContactForm() {
    content.innerHTML = `
      <p
        style="
          margin: 0 0 7px;
          font-size: 12px;
          font-weight: 700;
          color: #777777;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        "
      >
        შეფასება დასრულებულია
      </p>

      <p
        style="
          margin: 0 0 10px;
          font-size: 21px;
          font-weight: 800;
        "
      >
        შენი ანალიზი მზად არის
      </p>

      <p style="margin: 0 0 16px; line-height: 1.5; color: #444444;">
        შეავსე ინფორმაცია და ნახე შენი გაყიდვების პროფილი, ძლიერი მხარეები და განვითარების მიმართულებები.
      </p>

      <input
        id="coachName"
        type="text"
        placeholder="სახელი და გვარი"
        autocomplete="name"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <input
        id="coachPhone"
        type="tel"
        placeholder="ტელეფონის ნომერი"
        autocomplete="tel"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 10px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <input
        id="coachEmail"
        type="email"
        placeholder="ელფოსტა"
        autocomplete="email"
        style="
          width: 100%;
          padding: 13px;
          margin-bottom: 12px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 14px;
        "
      >

      <button
        id="showCoachResult"
        type="button"
        style="
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 11px;
          background: #ef1b13;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        "
      >
        ჩემი ანალიზის ნახვა
      </button>

      <p
        id="coachFormError"
        style="
          display: none;
          margin: 10px 0 0;
          color: #ef1b13;
          font-size: 13px;
          font-weight: 600;
        "
      >
        შეავსე ყველა ველი სწორად
      </p>
    `;
  }

  function showFinalResult(name) {
    const maximumScore = questions.length * 3;
    const percentage = Math.round(
      (coachState.score / maximumScore) * 100
    );

    const strengthsHTML = coachState.strengths
      .map(function (strength) {
        return `
          <li style="margin-bottom: 6px;">
            ${strength}
          </li>
        `;
      })
      .join("");

    const developmentHTML = coachState.developmentAreas
      .map(function (area) {
        return `
          <li style="margin-bottom: 6px;">
            ${area}
          </li>
        `;
      })
      .join("");

    content.innerHTML = `
      <p
        style="
          margin: 0 0 7px;
          font-size: 12px;
          font-weight: 700;
          color: #777777;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        "
      >
        Team4 Coach-ის შეფასება
      </p>

      <p style="margin: 0 0 5px; font-size: 15px; font-weight: 700;">
        ${escapeHTML(name)}, შენი გაყიდვების პროფილია:
      </p>

      <p
        style="
          margin: 0 0 12px;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.3;
        "
      >
        ${coachState.resultTitle}
      </p>

      <p
        style="
          margin: 0 0 16px;
          line-height: 1.55;
          color: #3f3f3f;
        "
      >
        ${coachState.resultDescription}
      </p>

      <div
        style="
          padding: 14px;
          margin-bottom: 11px;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          background: #fafafa;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 9px;
          "
        >
          <span style="font-weight: 800;">პროფესიული მზაობა</span>
          <span style="font-weight: 900;">${percentage}%</span>
        </div>

        <div
          style="
            width: 100%;
            height: 8px;
            border-radius: 10px;
            background: #e8e8e8;
            overflow: hidden;
          "
        >
          <div
            style="
              width: ${percentage}%;
              height: 100%;
              border-radius: 10px;
              background: #ef1b13;
            "
          ></div>
        </div>
      </div>

      <div
        style="
          padding: 14px;
          margin-bottom: 11px;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          background: #ffffff;
        "
      >
        <p style="margin: 0 0 9px; font-weight: 900;">
          შენი ძლიერი მხარეები
        </p>

        <ul
          style="
            margin: 0;
            padding-left: 20px;
            line-height: 1.45;
          "
        >
          ${strengthsHTML}
        </ul>
      </div>

      <div
        style="
          padding: 14px;
          margin-bottom: 14px;
          border: 1px solid #ffd7d4;
          border-radius: 12px;
          background: #fff7f6;
        "
      >
        <p style="margin: 0 0 9px; font-weight: 900;">
          განვითარების პრიორიტეტები
        </p>

        <ul
          style="
            margin: 0;
            padding-left: 20px;
            line-height: 1.45;
          "
        >
          ${developmentHTML}
        </ul>
      </div>

      <div
        style="
          padding: 15px;
          margin-bottom: 14px;
          border-radius: 12px;
          background: #f3f3f3;
        "
      >
        <p
          style="
            margin: 0 0 6px;
            font-size: 17px;
            font-weight: 900;
          "
        >
          რისი გაუმჯობესება გინდა?
        </p>

        <p
          style="
            margin: 0 0 12px;
            font-size: 13px;
            line-height: 1.45;
            color: #555555;
          "
        >
          აირჩიე შენთვის ყველაზე მნიშვნელოვანი მიმართულება და მიიღე კონკრეტული რეკომენდაცია.
        </p>

        <select
          id="coachImprovementChoice"
          style="
            width: 100%;
            padding: 12px;
            border: 1px solid #d6d6d6;
            border-radius: 10px;
            background: white;
            box-sizing: border-box;
            font-size: 14px;
          "
        >
          <option value="">აირჩიე მიმართულება</option>
          <option value="communication">კლიენტის დაინტერესება</option>
          <option value="discovery">საჭიროების სწორად გამოვლენა</option>
          <option value="objections">წინააღმდეგობების დამუშავება</option>
          <option value="closing">გარიგების დახურვა</option>
          <option value="leads">ლიდების გენერაცია</option>
          <option value="followup">Follow-up</option>
          <option value="crm">CRM და კლიენტების მართვა</option>
          <option value="analysis">გაყიდვების ანალიზი</option>
          <option value="strategy">გაყიდვების სტრატეგია</option>
          <option value="all">მთელი პროცესის სისტემურად გაუმჯობესება</option>
        </select>

        <button
          id="showImprovementRecommendation"
          type="button"
          style="
            width: 100%;
            padding: 13px;
            margin-top: 10px;
            border: none;
            border-radius: 10px;
            background: #171717;
            color: white;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
          "
        >
          რეკომენდაციის მიღება
        </button>

        <p
          id="coachImprovementError"
          style="
            display: none;
            margin: 9px 0 0;
            color: #ef1b13;
            font-size: 13px;
            font-weight: 600;
          "
        >
          ჯერ აირჩიე მიმართულება
        </p>

        <div
          id="coachImprovementResult"
          style="
            display: none;
            margin-top: 12px;
            padding: 13px;
            border-radius: 10px;
            background: white;
            line-height: 1.55;
          "
        ></div>
      </div>

      <button
        id="restartCoachTest"
        type="button"
        style="
          width: 100%;
          padding: 13px;
          border: 1px solid #d8d8d8;
          border-radius: 10px;
          background: white;
          color: #222222;
          font-weight: 700;
          cursor: pointer;
        "
      >
        შეფასების თავიდან გავლა
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
      const answerIndex = Number(
        event.target.dataset.answerIndex
      );

      const currentQuestion =
        questions[coachState.currentQuestion];

      const selectedAnswer =
        currentQuestion.answers[answerIndex];

      if (!selectedAnswer) {
        return;
      }

      coachState.score += selectedAnswer.score;

      coachState.categoryScores[currentQuestion.category] = {
        name: currentQuestion.categoryName,
        score: selectedAnswer.score
      };

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
      const nameInput =
        document.getElementById("coachName");

      const phoneInput =
        document.getElementById("coachPhone");

      const emailInput =
        document.getElementById("coachEmail");

      const errorMessage =
        document.getElementById("coachFormError");

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();

      const emailIsValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      const phoneIsValid =
        phone.replace(/\D/g, "").length >= 8;

      if (
        !name ||
        !phone ||
        !email ||
        !emailIsValid ||
        !phoneIsValid
      ) {
        errorMessage.style.display = "block";
        return;
      }

      errorMessage.style.display = "none";

      coachState.contact = {
        name: name,
        phone: phone,
        email: email
      };

      console.log("Team4 Coach ლიდი:", {
        name: name,
        phone: phone,
        email: email,
        score: coachState.score,
        result: coachState.resultTitle,
        strengths: coachState.strengths,
        developmentAreas: coachState.developmentAreas,
        answers: coachState.answers
      });

      showFinalResult(name);
      return;
    }

    if (
      event.target.id ===
      "showImprovementRecommendation"
    ) {
      const select =
        document.getElementById(
          "coachImprovementChoice"
        );

      const resultBox =
        document.getElementById(
          "coachImprovementResult"
        );

      const errorMessage =
        document.getElementById(
          "coachImprovementError"
        );

      const selectedValue = select.value;
      const recommendation =
        improvementRecommendations[selectedValue];

      if (!recommendation) {
        errorMessage.style.display = "block";
        resultBox.style.display = "none";
        return;
      }

      errorMessage.style.display = "none";
      resultBox.style.display = "block";

      resultBox.innerHTML = `
        <p
          style="
            margin: 0 0 7px;
            font-weight: 900;
          "
        >
          Team4 Coach-ის რეკომენდაცია:
          ${recommendation.title}
        </p>

        <p
          style="
            margin: 0;
            color: #3f3f3f;
          "
        >
          ${recommendation.text}
        </p>
      `;

      console.log("არჩეული განვითარების მიმართულება:", {
        name: coachState.contact.name,
        phone: coachState.contact.phone,
        email: coachState.contact.email,
        improvementChoice: recommendation.title
      });

      return;
    }

    if (event.target.id === "restartCoachTest") {
      resetCoach();
      showQuestion();
    }
  });
});
