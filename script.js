let notes = JSON.parse(localStorage.getItem("notes")) || [];

const colors = [
  "#fef3c7","#dbeafe","#fce7f3","#dcfce7","#ede9fe","#ffe4e6"
];

function getTextColor(bgColor) {
  const color = bgColor.substring(1);
  const r = parseInt(color.substring(0,2),16);
  const g = parseInt(color.substring(2,4),16);
  const b = parseInt(color.substring(4,6),16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#000" : "#fff";
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote() {
  const title = document.getElementById("title");
  const content = document.getElementById("content");

  if (!title.value || !content.value) return alert("Isi dulu!");

  notes.push({
    id: Date.now(),
    title: title.value,
    content: content.value,
    color: colors[Math.floor(Math.random() * colors.length)],
    date: new Date().toLocaleString(),
    pinned: false
  });

  saveNotes();
  displayNotes();

  title.value = "";
  content.value = "";
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  displayNotes();
}

function editNote(id) {
  const note = notes.find(n => n.id === id);

  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content;

  deleteNote(id);
}

function pinNote(id) {
  notes = notes.map(n => {
    if (n.id === id) n.pinned = !n.pinned;
    return n;
  });
  saveNotes();
  displayNotes();
}

function displayNotes(data = notes) {
  const container = document.getElementById("notes");
  const empty = document.getElementById("empty");

  container.innerHTML = "";

  data.sort((a,b)=>b.pinned-a.pinned);

  if (data.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }

  data.forEach(note => {
    container.innerHTML += `
      <div class="note" style="background:${note.color}; color:${getTextColor(note.color)}">
        
        <div class="pin" onclick="pinNote(${note.id})">
          ${note.pinned ? "📌" : "📍"}
        </div>

        <h3>${note.title}</h3>
        <small>${note.date}</small>
        <p>${note.content}</p>

        <div class="actions">
          <button class="edit" onclick="editNote(${note.id})">Edit</button>
          <button class="delete" onclick="deleteNote(${note.id})">Hapus</button>
        </div>

      </div>
    `;
  });

  updateStats();
}

document.getElementById("search").addEventListener("input", function() {
  const keyword = this.value.toLowerCase();
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(keyword) ||
    n.content.toLowerCase().includes(keyword)
  );
  displayNotes(filtered);
});

function updateStats() {
  const stats = document.getElementById("stats");
  const today = new Date().toDateString();

  const todayCount = notes.filter(n =>
    new Date(n.id).toDateString() === today
  ).length;

  stats.innerText = `📄 ${notes.length} Catatan | 🆕 ${todayCount} Hari ini`;
}

function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}

function loadDark() {
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

loadDark();
displayNotes();