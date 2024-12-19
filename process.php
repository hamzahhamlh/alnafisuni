<?php
session_start();
$data = [];

try {
    $file_id = '11hvgWWQsdKTBlrSoT4DEPw9mPPAPKHlP8CjSDwEdJus';
    $file_id = '1mUg2zB9RgUjfJGwv0iI-NWtfc0aD0gNACoj2ki0Uc7k';
    $csv_url = "https://docs.google.com/spreadsheets/d/$file_id/export?format=csv";
    
    if (($handle = fopen('data/faq_view.csv', 'r')) !== FALSE) {
    // if (($handle = fopen($csv_url, 'r')) !== FALSE) {
        $headers = fgetcsv($handle, 1000, ','); // قراءة الصف الأول كعناوين
        while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {
            $row = array_map(function ($value) {
                return iconv('windows-1256', 'UTF-8', $value);
            }, $row);
            $data[] = array_combine($headers, $row);
        }
        fclose($handle);
    }

    // معالجة طلب GET لجلب الفئات
    if (isset($_GET['action']) && $_GET['action'] === 'get_categories') {
        $categories = array_unique(array_column($data, 'category_name'));
        echo json_encode(['categories' => $categories]);
        exit;
    }

    // معالجة طلب GET لجلب الأسئلة حسب الفئة
    if (isset($_GET['action']) && $_GET['action'] === 'get_questions' && isset($_GET['category_name'])) {
        $category_name = $_GET['category_name'];
        $questions = array_filter($data, function ($row) use ($category_name) {
            return $row['category_name'] === $category_name;
        });
        echo json_encode(array_values(array_map(function ($row) {
            return ['question' => $row['question']];
        }, $questions)));
        exit;
    }

    // معالجة طلب POST للإجابة على الأسئلة
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $question = $_POST['question'];
        $_SESSION['messages'][] = ['is_user' => true, 'text' => $question];

        // البحث عن الإجابة من البيانات
        foreach ($data as $row) {
            if ($row['question'] === $question) {
                $answer = $row['answer'];
                $_SESSION['messages'][] = ['is_user' => false, 'text' => $answer];
                // break;
            }
        }
        echo json_encode(['messages' => $_SESSION['messages']]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['error' => "Error reading the CSV file: " . $e->getMessage()]);
    exit;
}