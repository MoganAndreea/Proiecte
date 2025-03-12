<?php
// Pornirea sesiunii
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

// Conectare la baza de date
$conn = new mysqli("localhost", "root", "", "pai");
if ($conn->connect_error) {
    die("Conexiunea la baza de date a eșuat: " . $conn->connect_error);
}

// Preluare date din tabela `points`
$sql = "SELECT lat, `long`, description FROM points";
$result = $conn->query($sql);

$points = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $points[] = $row; // Stocăm datele în array-ul $points
    }
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harta</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_cLgGtD_1gTtc-T_Z6_yYEaBWOkQDi6E"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        #map {
            height: 500px;
            width: 100%;
        }
        header {
            background-color: #dd4591;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        header nav a {
            color: #fff;
            text-decoration: none;
            margin: 0 10px;
            font-weight: bold;
        }
        header nav a:hover {
            color: #f5b1de;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="about.php">Despre Mine</a>
            <a href="education.php">Educație</a>
            <a href="experience.php">Experiență</a>
            <a href="cv.php">Descarcă CV</a>
            <a href="logout.php">Logout</a>
        </nav>
    </header>

    <section>
        <h2>Bine ai venit, <?php echo htmlspecialchars($_SESSION['user']); ?>!</h2>
        <div id="map"></div>
    </section>

    <script>
        // Datele preluate din PHP
        var points = <?php echo json_encode($points); ?>;

        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: {lat: 45.9432, lng: 24.9668} // Centrul pe România
            });

            // Adăugare marker-e pe hartă
            points.forEach(function(point) {
                new google.maps.Marker({
                    position: {lat: parseFloat(point.lat), lng: parseFloat(point.long)},
                    map: map,
                    title: point.description
                });
            });
        }

        // Eveniment pentru inițializarea hărții folosind metoda standard
        window.addEventListener('load', initMap);

        // Debugging: verificăm datele din consola browserului
        console.log(points);
    </script>
</body>
</html>
