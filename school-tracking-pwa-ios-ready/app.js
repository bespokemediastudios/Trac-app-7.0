
document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD7eQXLpBUVmP_QwCbaAMA7f9cIF7eP7HM",
    authDomain: "school-tracking-80ba4.firebaseapp.com",
    projectId: "school-tracking-80ba4",
    storageBucket: "school-tracking-80ba4.appspot.com",
    messagingSenderId: "387546143258",
    appId: "1:387546143258:web:2b247c0822e64bcc9d4fa3"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const map = L.map("map").setView([20.59, 78.96], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("studentId");
    location.reload();
  });

  const chime = document.getElementById("chime");
  let studentMarker = null;
  let busMarker = null;

  window.login = function () {
    const studentId = document.getElementById("studentIdInput").value.trim();
    if (!studentId) return alert("Enter a student ID");

    localStorage.setItem("studentId", studentId);
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("app").style.display = "block";

    track(studentId);
  }

  function track(studentId) {
    db.collection("students").doc(studentId).onSnapshot(doc => {
      const data = doc.data();
      if (!data) return;

      const latlng = [data.latitude, data.longitude];
      if (!studentMarker) {
        studentMarker = L.marker(latlng).addTo(map).bindPopup("Student Location");
      } else {
        studentMarker.setLatLng(latlng);
      }
      map.setView(latlng, 15);
    });

    db.collection("bus").doc("location").onSnapshot(doc => {
      const data = doc.data();
      if (!data) return;

      const latlng = [data.latitude, data.longitude];
      if (!busMarker) {
        busMarker = L.marker(latlng).addTo(map).bindPopup("Bus Location");
      } else {
        busMarker.setLatLng(latlng);
      }

      const studentLatLng = studentMarker?.getLatLng();
      if (studentLatLng) {
        const distance = map.distance(latlng, [studentLatLng.lat, studentLatLng.lng]);
        if (distance < 150) {
          chime.play().catch(() => {});
        }
      }
    });
  }

  const storedId = localStorage.getItem("studentId");
  if (storedId) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("app").style.display = "block";
    track(storedId);
  }
});
