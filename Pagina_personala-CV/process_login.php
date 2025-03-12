<?php
session_start();
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = isset($_POST['user']) ? trim($_POST['user']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (!empty($user) && !empty($password)) {
        $sql = "SELECT * FROM users WHERE user = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                $_SESSION['user'] = $user;
                header("Location: about.php");
                exit;
            } else {
                echo "Parola este incorectă!";
            }
        } else {
            echo "Utilizatorul nu există!";
        }
    } else {
        echo "Completează toate câmpurile!";
    }
}
?>
