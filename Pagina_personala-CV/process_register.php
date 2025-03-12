<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_user = isset($_POST['new_user']) ? trim($_POST['new_user']) : '';
    $new_password = isset($_POST['new_password']) ? password_hash(trim($_POST['new_password']), PASSWORD_DEFAULT) : '';

    if (!empty($new_user) && !empty($new_password)) {
        $sql = "INSERT INTO users (user, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $new_user, $new_password);

        if ($stmt->execute()) {
            echo "Înregistrare reușită!";
        } else {
            echo "Acest utilizator există deja!";
        }
    } else {
        echo "Completează toate câmpurile!";
    }
}
?>
