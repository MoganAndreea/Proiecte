<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        <!-- Formular pentru login -->
        <form action="process_login.php" method="POST">
            <label for="user">User:</label>
            <input type="text" id="user" name="user" placeholder="Enter your username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
            <button type="submit">Login</button>
        </form>

        <hr>

        <h3>Register</h3>
        <!-- Formular pentru înregistrare -->
        <form action="process_register.php" method="POST">
            <label for="new_user">User:</label>
            <input type="text" id="new_user" name="new_user" placeholder="Choose a username" required>
            <label for="new_password">Password:</label>
            <input type="password" id="new_password" name="new_password" placeholder="Choose a password" required>
            <button type="submit">Register</button>
        </form>
    </div>
</body>
</html>

