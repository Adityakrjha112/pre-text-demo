import { prepareWithSegments, layoutWithLines } from "./pretext.js";

const TEXT =
  "AT BATCH, WE BRIDGE THE GAP BETWEEN THE PHYSICAL AND DIGITAL WORLDS, TRANSFORMING EVERYDAY PRODUCTS INTO IMMERSIVE, INTERACTIVE EXPERIENCES. OUR INNOVATIVE PLATFORM ENABLES BRANDS TO CONNECT WITH THEIR CUSTOMERS IN REAL TIME—SEAMLESSLY, SECURELY, AND IMPACTFULLY. WE ARE A TEAM OF ENGINEERS, DESIGNERS, AND CREATIVES WITH A REPUTATION FOR TACTICAL BRILLIANCE AND TRANSFORMATIVE TOOLS. WITH EXPERIENCE SPANNING INDUSTRIES, WE'VE HELPED OVER A HUNDRED BRANDS TURN HYPE INTO LASTING SUCCESS—DRIVING PROFIT, LONGEVITY, AND DEEPER CUSTOMER INSIGHTS. WE UNDERSTAND THE EVOLVING LANDSCAPE OF TRENDS, COMMERCE, AND TECHNOLOGY, EMPOWERING BRANDS TO NOT JUST SELL PRODUCTS BUT BUILD COMMUNITIES. BRAND FIRST TECHNOLOGY PLATFORM WE TRANSFORM EVERYDAY PRODUCTS INTO IMMERSIVE DIGITAL EXPERIENCES, SEAMLESSLY CONNECTING BRANDS WITH THEIR CUSTOMERS. WITH CUTTING-EDGE TECHNOLOGY, EFFORTLESS INTERACTIONS, AND BUILT-IN AUTHENTICITY VERIFICATION, BATCH HELPS BRANDS BUILD TRUST, DRIVE ENGAGEMENT, AND CREATE LASTING CONNECTIONS. INCREASE IN PRODUCT COUNTERFEITING GLOBAL COUNTERFEIT MARKET CONTINUES TO THRIVE INCREASING CONSUMER RISK WITH NO TRUE SAFEGUARDS TO SUPPORT TRUE PRODUCT AUTHENTICITY. INCREASE IN PRODUCT COUNTERFEITING GLOBAL COUNTERFEIT MARKET CONTINUES TO THRIVE INCREASING CONSUMER RISK WITH NO TRUE SAFEGUARDS TO SUPPORT TRUE PRODUCT AUTHENTICITY.";

const container = document.getElementById("container");
const canvas = document.getElementById("hiddenCanvas");
const ctx = canvas.getContext("2d");

let letters = [];
let elements = [];
let points = [];

let progress = 0;

function getScale() {
  const BASE_WIDTH = 1440;
  return Math.min(window.innerWidth / BASE_WIDTH, 1);
}

function initLetters() {
  container.innerHTML = "";
  letters = [];
  elements = [];

  const scale = getScale();

  const fontSize = 14 * scale;
  const lineHeight = 20 * scale;

  const maxWidth = Math.min(window.innerWidth - 40, 900);

  const prepared = prepareWithSegments(TEXT, `${fontSize}px monospace`);
  const layout = layoutWithLines(prepared, maxWidth, lineHeight);


  layout.lines.forEach((line, li) => {
    const startX = (window.innerWidth - line.width) / 2;

    let x = startX;

    [...line.text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.innerText = char;
      span.style.fontSize = fontSize + "px";

      container.appendChild(span);

      const obj = {
        x,
        y: li * lineHeight + 100,
        baseX: x,
        baseY: li * lineHeight + 100,
        targetX: x,
        targetY: li * lineHeight + 100,
        vx: 0,
        vy: 0,
      };

      letters.push(obj);
      elements.push(span);

      x += fontSize * 0.6;
    });
  });
}

function generatePoints() {
  const img = new Image();
  img.src = "barLogo.png";

  img.onload = () => {
    const canvasSize = Math.min(window.innerWidth * 0.6, 300);
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.drawImage(img, 0, 0, canvasSize, canvasSize);

    const data = ctx.getImageData(0, 0, canvasSize, canvasSize).data;

    points = [];

    for (let y = 0; y < canvasSize; y += 3) {
      for (let x = 0; x < canvasSize; x += 3) {
        const i = (y * canvasSize + x) * 4;

        if (data[i] > 200) {
          points.push({ x, y });
        }
      }
    }

    assignTargets(canvasSize);
  };
}

function assignTargets(canvasSize) {
  const offsetX = window.innerWidth / 2 - canvasSize / 2;
  const offsetY = window.innerHeight / 2 - canvasSize / 2;

  points.sort(() => Math.random() - 0.5);

  letters.forEach((l, i) => {
    const p = points[i % points.length];

    l.targetX = p.x + offsetX;
    l.targetY = p.y + offsetY;
  });
}

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    initLetters();
    generatePoints();
  }, 200);
});

const scrollHint = document.getElementById("scrollHint");

window.addEventListener("scroll", () => {
  const max = document.body.scrollHeight - window.innerHeight;
  progress = window.scrollY / max;
  if (progress === 1) {
    scrollHint.style.opacity = 0;
  } else {
    scrollHint.style.opacity = 1;
  }
  
});

function animate() {
  const eased = progress * progress * (3 - 2 * progress);

  letters.forEach((l, i) => {
    const tx = l.baseX + (l.targetX - l.baseX) * eased;
    const ty = l.baseY + (l.targetY - l.baseY) * eased;

    l.vx += (tx - l.x) * 0.05;
    l.vy += (ty - l.y) * 0.05;

    l.vx *= 0.85;
    l.vy *= 0.85;

    l.x += l.vx;
    l.y += l.vy;

    elements[i].style.transform = `translate(${l.x}px, ${l.y}px)`;
  });

  requestAnimationFrame(animate);
}

initLetters();
generatePoints();
animate();
