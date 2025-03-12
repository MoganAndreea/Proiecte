<?php
$host = "localhost";
$db_user = "root"; // Utilizatorul bazei de date
$db_pass = ""; // Parola bazei de date
$db_name = "pai"; // Numele bazei de date

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

// Verificăm conexiunea
if ($conn->connect_error) {
    die("Conexiune eșuată: " . $conn->connect_error);
}
?>