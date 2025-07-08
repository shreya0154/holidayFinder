
const optionsList = document.getElementById("options-list");
const selectedFlag = document.getElementById("selected-flag");
const selectedCode = document.getElementById("selected-code");
const selectedDiv = document.querySelector(".selected");
const holidayList = document.querySelector(".holidayList");
const msg = document.querySelector(".message");

let currentCountry = "US";

// Populate options
for (let code in countryList) {
  const option = document.createElement("div");
  option.classList.add("option");
  option.innerHTML = `<img src="https://flagsapi.com/${code}/flat/64.png" alt="${code}"> <span>${code}</span>`;
  option.addEventListener("click", () => {
    selectedFlag.src = `https://flagsapi.com/${code}/flat/64.png`;
    selectedCode.textContent = code;
    currentCountry = code;
    optionsList.style.display = "none";
    msg.textContent = `Ready to fetch holidays for ${code}`;
    holidayList.innerHTML = "";
  });
  optionsList.appendChild(option);
}

// Toggle dropdown
selectedDiv.addEventListener("click", () => {
  optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
});

// Fetch next long weekend
document.getElementById("nextBtn").addEventListener("click", async () => {
  msg.innerText = "Fetching next long weekend...";
  try {
    const res = await fetch(`https://holidayfinderservice.onrender.com/api/long-weekends/next?country=${currentCountry}`);
    const data = await res.json();
    if (data && data.next) {
      msg.innerText = `🎉 Next: ${data.next.start} → ${data.next.end} (${data.next.days} days)`;
    } else {
      msg.innerText = "No upcoming long weekends found.";
    }
    holidayList.innerHTML = "";
  } catch {
    msg.innerText = "Failed to fetch data.";
  }
});

// Fetch all long weekends
document.getElementById("allBtn").addEventListener("click", async () => {
  msg.innerText = "Fetching all long weekends...";
  try {
    const res = await fetch(`https://holidayfinderservice.onrender.com/api/long-weekends?country=${currentCountry}`);
    const data = await res.json();
    if (data && data.longWeekends?.length > 0) {
      msg.innerText = `📅 Found ${data.longWeekends.length} long weekends:`;
      holidayList.innerHTML = "";
      data.longWeekends.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.start} → ${item.end} (${item.days} days)`;
        holidayList.appendChild(li);
      });
    } else {
      msg.innerText = "No long weekends found.";
      holidayList.innerHTML = "";
    }
  } catch {
    msg.innerText = "Failed to fetch data.";
  }
});
