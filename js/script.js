document.addEventListener('DOMContentLoaded', function () {
  loadCategories();
});

function loadCategories() {
  fetch('process.php?action=get_categories')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          const categoriesList = document.getElementById('categories-list');
          categoriesList.innerHTML = ''; // مسح القائمة السابقة

          // استخدم Object.values لاستخراج القيم من الكائن
          const categories = Object.values(data.categories);

          categories.forEach(category => {
              const categoryDiv = document.createElement('div');
              categoryDiv.classList.add('category');
              categoryDiv.textContent = category;
              categoryDiv.onclick = function () {
                  showQuestions(category);
              };
              categoriesList.appendChild(categoryDiv);
          });
      })
      .catch(error => {
          console.error('Error fetching categories:', error);
          alert('حدث خطأ أثناء جلب الفئات.');
      });
}

function showQuestions(category) {
  fetch(`process.php?action=get_questions&category_name=${encodeURIComponent(category)}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(questions => {
          const list = document.getElementById('questions-list');
          list.innerHTML = ''; // مسح القائمة السابقة

          questions.forEach(function (q) {
              const listItem = document.createElement('li');
              listItem.textContent = q.question;
              listItem.classList.add('question-item');
              listItem.onclick = function () {
                  handleQuestionClick(q.question); // استدعاء دالة لإرسال السؤال
              };
              list.appendChild(listItem);
          });

          document.getElementById('questions-container').style.display = 'block';
      })
      .catch(error => {
          console.error('Error fetching questions:', error);
          alert('حدث خطأ أثناء جلب الأسئلة.');
      });
}

function handleQuestionClick(question) {
  const input = document.getElementById('question-input');
  input.value = question; // وضع السؤال في حقل الإدخال
  handleSubmit(); // إرسال السؤال إلى الخادم
}

// function handleSubmit() {
//   const input = document.getElementById('question-input');
//   const messageContainer = document.getElementById('messages');

//   // إضافة رسالة المستخدم إلى واجهة الدردشة
//   const userMessage = document.createElement('div');
//   userMessage.className = 'message user-message';
//   userMessage.innerHTML = `<strong>أنت:</strong> ${input.value}`;
//   messageContainer.appendChild(userMessage);

//   // إرسال السؤال إلى الخادم
//   fetch('process.php', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({ question: input.value })
//   })
//   .then(response => response.json())
//   .then(data => {
//       if (data.messages) {
//           // تحديث الرسائل في واجهة المستخدم
//           data.messages.forEach(function (msg) {
//               const message = document.createElement('div');
//               message.className = 'message ' + (msg.is_user ? 'user-message' : 'bot-message');
//               message.innerHTML = `<strong>${msg.is_user ? 'أنت:' : 'البوت:'}</strong> ${msg.text}`;
//               messageContainer.appendChild(message);
//           });
//       }
//   })
//   .catch(error => {
//       console.error('Error sending question:', error);
//       alert('حدث خطأ أثناء إرسال السؤال.');
//   });

//   return false; // منع الإرسال الافتراضي للنموذج
// }
function handleSubmit() {
    const input = document.getElementById('question-input');
    const messageContainer = document.getElementById('messages');
  
    // إضافة رسالة المستخدم إلى واجهة الدردشة
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<strong>أنت:</strong> ${input.value}`;
    messageContainer.appendChild(userMessage);
  
    // إرسال السؤال إلى الخادم
    fetch('process.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ question: input.value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.messages) {
            // تحديث الرسائل في واجهة المستخدم
            data.messages.forEach(function (msg) {
                const message = document.createElement('div');
                message.className = 'message ' + (msg.is_user ? 'user-message' : 'bot-message');
                message.innerHTML = `<strong>${msg.is_user ? 'أنت:' : 'البوت:'}</strong> ${msg.text}`;
                messageContainer.appendChild(message);
            });
  
            // تأخير التمرير إلى أسفل الحاوية
            setTimeout(() => {
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }, 500); // تأخير لمدة 300 مللي ثانية
        }
    })
    .catch(error => {
        console.error('Error sending question:', error);
        alert('حدث خطأ أثناء إرسال السؤال.');
    });
  
    return false; // منع الإرسال الافتراضي للنموذج
  }