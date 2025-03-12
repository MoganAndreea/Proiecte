<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Despre Mine</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header>
	<h1>Bine ai venit, <?php echo htmlspecialchars($_SESSION['user']); ?>!</h1>
        <h1>Andreea-Monica Mogan</h1>
        <nav>
            <a href="about.php">Despre Mine</a>
            <a href="education.php">Educație</a>
            <a href="experience.php">Experiență</a>
            <a href="cv.php">Descarcă CV</a>
            <a href="map.php">Harta</a>
			<a href="logout.php">Logout</a>
        </nav>
    </header>

    <section class="about-section">
        <div class="content">
            <div class="image-container">
                <img src="poza.jpg" alt="Poza profil" class="profil_img"/>
            </div>
            <div class="text-container">
                <p class="intro-text">Bună, sunt Andreea, studentă la Facultatea de Inginerie Electrică și Știința Calculatoarelor.</p>
                <p class="intro-text">Sunt o persoană sociabilă, îmi place să călătoresc, să citesc și să descopăr lucruri noi!</p>
            </div>
        </div>
    </section>

    <footer>
        <h3>Contact</h3>
        <p>Telefon: 0774438817</p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/andreea-monica-mogan-955362260/">Profil LinkedIn</a></p>
        <p>Email: <a href="mailto:andreea.monica@example.com">moganandreea01@gmail.com</a></p>
    </footer>

</body>
</html>

