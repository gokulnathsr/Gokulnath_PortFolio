document.addEventListener("DOMContentLoaded", () => {
  const names = document.getElementById("clientName");
  const email = document.getElementById("clientEmail");
  const text = document.getElementById("clientText");
  const form = document.getElementById("submitForm");
  const subject = document.getElementById("subject");
  const para = document.getElementById("successParagraph");

  const data = {
    clientName: "",
    clientEmail: "",
    clientSubject: "",
    clientText: "",
  };

  names.addEventListener("input", (event) => {
    data.clientName = event.target.value;
    console.log("Name:", data.clientName);
  });

  email.addEventListener("input", (event) => {
    data.clientEmail = event.target.value;
    console.log("Email:", data.clientEmail);
  });
  subject.addEventListener("input", (event) => {
    data.clientSubject = event.target.value;
  });
  text.addEventListener("input", (event) => {
    data.clientText = event.target.value;
    console.log("Message:", data.clientText);
  });
  const forFetchFunction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        para.innerText = "Sended Successfully";
        para.style.color = "green";
        form.reset();

        (data.clientName = ""),
          (data.clientEmail = ""),
          (data.clientSubject = ""),
          (data.clientText = "");
      } else {
        para.innerText = "An error occurred!";
        para.style.color = "red";
      }
    } catch (e) {
      console.error("Error sending data:", e);
      para.innerText = "An error occurred!";
      para.style.color = "red";
    }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    forFetchFunction(data);
  });
});
