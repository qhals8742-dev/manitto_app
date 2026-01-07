const inputsDiv = document.getElementById("inputs");
const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const linksUl = document.getElementById("links");

let people = [];
let manittoMap = {};

// 기본 5명 입력칸
for (let i = 0; i < 5; i++) addInput();

addBtn.onclick = addInput;

function addInput() {
  const input = document.createElement("input");
  input.placeholder = "이름 입력";
  inputsDiv.appendChild(input);
}

generateBtn.onclick = () => {
  people = [...inputsDiv.querySelectorAll("input")]
    .map(i => i.value.trim())
    .filter(v => v);

  if (people.length < 3) {
    alert("최소 3명 이상 입력해주세요!");
    return;
  }

  generateManitto();
  createLinks();
};

function generateManitto() {
  let shuffled;
  do {
    shuffled = [...people].sort(() => Math.random() - 0.5);
  } while (!isValid(people, shuffled));

  people.forEach((p, i) => {
    manittoMap[p] = shuffled[i];
  });
}

function isValid(a, b) {
  return a.every((v, i) => v !== b[i]);
}

function createLinks() {
  linksUl.innerHTML = "";

people.forEach(p => {
  const payload = { 
    me: p, 
    target: manittoMap[p], 
    participants: people // 전체 참가자 배열도 포함
    };
    const token = btoa(encodeURIComponent(JSON.stringify(payload)));
    const basePath = location.pathname.replace("index.html", "");
    const url = `${location.origin}${basePath}result.html?t=${token}`;


    const li = document.createElement("li");

    // 이름
    const nameEl = document.createElement("strong");
    nameEl.textContent = p;

    // QR 코드 박스
    const qrBox = document.createElement("div");
    qrBox.className = "qr-box";

    // 링크 복사 버튼
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "링크 복사";
    copyBtn.style.marginTop = "10px";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(url)
        .then(() => alert(`${p} 링크가 복사되었습니다!`))
        .catch(() => alert("복사 실패"));
    };

    li.appendChild(nameEl);
    li.appendChild(qrBox);
    li.appendChild(copyBtn);
    linksUl.appendChild(li);

    // QR 코드 생성
    new QRCode(qrBox, {
      text: url,
      width: 160,
      height: 160,
      correctLevel: QRCode.CorrectLevel.H
    });
  });
}
