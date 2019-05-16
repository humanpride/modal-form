<?php

$config = parse_ini_file("config.ini");

$mysql = new mysqli($config['dbHost'], $config['dbUser'], $config['dbPass']);
$mysql->set_charset($config['charset']);

if ($mysql->connect_errno) {
    printf('Не удалось подключиться: %s', $mysql->connect_error);
    exit();
}

$mysql->query('CREATE DATABASE IF NOT EXISTS feedback_form CHARACTER SET '.$config['charset']);
$mysql->select_db('feedback_form');
$mysql->query('CREATE TABLE IF NOT EXISTS requests (
    id INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    text TEXT NOT NULL
)');

$name = filter_var(trim($_POST['name'], FILTER_SANITIZE_STRING));
$phone = filter_var(trim($_POST['phone'], FILTER_SANITIZE_STRING));
$text = filter_var(trim($_POST['text'], FILTER_SANITIZE_STRING));

if ($mysql->query("INSERT INTO requests (name, phone, text) VALUES ('$name', '$phone', '$text')")) {
	echo "Мы уже получили вашу заявку. В скором времени с вами свяжется наш специалист.";
} else {
	printf('При сохранении записи в БД возникла ошибка: %s', $mysql->error);
}