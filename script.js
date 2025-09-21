// Pages
const pageLogo = document.getElementById('page-logo');
const pageUserType = document.getElementById('page-user-type');
const pageQuestionnaire = document.getElementById('page-questionnaire');
const pageResults = document.getElementById('page-results');
const pageAIChat = document.getElementById('page-ai-chat');
const pageSchedule = document.getElementById('page-schedule');

const startBtn = document.getElementById('start-btn');
const userCards = document.querySelectorAll('.user-card');
const questionnaireContent = document.getElementById('questionnaire-content');
const submitAnswersBtn = document.getElementById('submit-answers');
const resultsCards = document.getElementById('results-cards');

const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat');
const backFromChatBtn = document.getElementById('back-from-chat');

const scheduleList = document.getElementById('schedule-list');
const eventInput = document.getElementById('event-input');
const addEventBtn = document.getElementById('add-event');
const backFromScheduleBtn = document.getElementById('back-from-schedule');

// State
let currentUserType = null;
let userAnswers = {};
let scheduleEvents = [];

// Questionnaire data
const questionnaires = {
  student: {
    title: 'Questions for Students',
    questions: [
      { 
        id: 'levelOfStudy', label: 'Current level of study?', type: 'options', 
        options: ['High School', 'Higher Studies', 'Postgraduate'] 
      },
      { 
        id: 'subjects', label: 'Subjects you study?', type: 'multiselect', 
        options: ['Math', 'Science', 'Computer Science'] 
      },
      { 
        id: 'favorites', label: 'Subjects you enjoy most?', type: 'multiselect', 
        options: ['Arts', 'Finance', 'Other'] 
      },
      { 
        id: 'scholarships', label: 'Do you want scholarships or internships?', type: 'options',
        options: ['Yes', 'No']
      },
      { id: 'careerInterests', label: 'Career interests (optional)', type: 'text' }
    ]
  },
  graduate: {
    title: 'Questions for Graduates',
    questions: [
      { id: 'specialization', label: 'Specialization?', type: 'text' },
      { 
        id: 'immediateGoal', label: 'Immediate goal?', type: 'options', 
        options: ['Job', 'Higher Studies', 'Entrepreneurship'] 
      },
      { 
        id: 'industries', label: 'Industries of interest?', type: 'multiselect', 
        options: ['IT', 'Marketing', 'Finance', 'Design'] 
      },
      { id: 'preferredLocation', label: 'Preferred location?', type: 'text' }
    ]
  },
  jobseeker: {
    title: 'Questions for Job Seekers',
    questions: [
      { id: 'preferredRole', label: 'Preferred job role?', type: 'text' },
      { 
        id: 'locationPreference', label: 'Job location preferences?', type: 'multiselect', 
        options: ['Job', 'Higher Studies', 'Entrepreneurship'] 
      },
      { 
        id: 'jobType', label: 'Preferred job type?', type: 'multiselect', 
        options: ['IT', 'Part-Time', 'Finance', 'Remote', 'Other'] 
      },
      { id: 'preferredLocation', label: 'Preferred location?', type: 'text' }
    ]
  },
  professional: {
    title: 'Questions for Professionals',
    questions: [
      { id: 'currentRole', label: 'Current role?', type: 'text' },
      { 
        id: 'yearsExperience', label: 'Years of experience?', type: 'options', 
        options: ['0-2', '3-5', '6+'] 
      },
      { 
        id: 'goal', label: 'Goal?', type: 'multiselect',
        options: ['Upskill', 'Switch Career', 'Grow in Current Role', 'Other'] 
      },
      { 
        id: 'skillsImprove', label: 'Skills or areas to improve?', type: 'multiselect',
        options: ['Leadership', 'Technical', 'Communication', 'Other'] 
      }
    ]
  },
  other: {
    title: 'Tell us about yourself',
    questions: [
      { 
        id: 'otherType', label: 'Describe yourself?', type: 'options', 
        options: ['Student', 'Graduate', 'Job Seeker', 'Professional', 'Other'] 
      }
    ]
  }
};

// Helper to display a page and hide others
function showPage(page) {
  [pageLogo, pageUserType, pageQuestionnaire, pageResults, pageAIChat, pageSchedule].forEach(p => {
    p.classList.remove('active');
  });
  page.classList.add('active');
}

// Load questionnaire questions for selected user type
function loadQuestionnaire(type) {
  currentUserType = type;
  userAnswers = {};
  const data = questionnaires[type];
  if (!data) return;

  questionnaireContent.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.textContent = data.title;
  questionnaireContent.appendChild(h2);

  data.questions.forEach(q => {
    const qCard = document.createElement('div');
    qCard.className = 'q-card';

    const label = document.createElement('div');
    label.className = 'q-label';
    label.textContent = q.label;
    qCard.appendChild(label);

    if (q.type === 'options' || q.type === 'multiselect') {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';

      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          if (q.type === 'options') {
            Array.from(optionsDiv.children).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            userAnswers[q.id] = opt;
          } else {
            btn.classList.toggle('selected');
            const selected = Array.from(optionsDiv.children)
              .filter(b => b.classList.contains('selected'))
              .map(b => b.textContent);
            userAnswers[q.id] = selected;
          }
        });
        optionsDiv.appendChild(btn);
      });

      if(q.options.some(opt => opt.toLowerCase().includes('other'))) {
        const otherInput = document.createElement('input');
        otherInput.type = 'text';
        otherInput.className = 'other-input';
        otherInput.placeholder = "Other (optional)";
        otherInput.addEventListener('input', e => {
          userAnswers[q.id + '_other'] = e.target.value;
        });
        qCard.appendChild(optionsDiv);
        qCard.appendChild(otherInput);
      } else {
        qCard.appendChild(optionsDiv);
      }
    } else if (q.type === 'text') {
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'other-input';
      textInput.placeholder = 'Your answer';
      textInput.addEventListener('input', e => {
        userAnswers[q.id] = e.target.value;
      });
      qCard.appendChild(textInput);
    }
    questionnaireContent.appendChild(qCard);
  });

  // Thoughts / notes input
  const notesCard = document.createElement('div');
  notesCard.className = 'q-card';
  const notesLabel = document.createElement('div');
  notesLabel.className = 'q-label';
  notesLabel.textContent = 'Your thoughts / notes';
  const notesTextarea = document.createElement('textarea');
  notesTextarea.className = 'notes-input';
  notesTextarea.placeholder = 'Optional notes...';
  notesTextarea.addEventListener('input', e => {
    userAnswers['notes'] = e.target.value;
  });
  notesCard.appendChild(notesLabel);
  notesCard.appendChild(notesTextarea);
  questionnaireContent.appendChild(notesCard);

  showPage(pageQuestionnaire);
}

// Creates sample results cards (can enhance with AI later)
function generateResults() {
  resultsCards.innerHTML = '';

  const resultsData = [
    {
      priority: 'high',
      text: "Focus on key skills and certifications to boost your career.",
      supportTypes: ['book', 'lightbulb', 'certificate']
    },
    {
      priority: 'medium',
      text: "Explore community mentorship and networking opportunities.",
      supportTypes: ['people']
    },
    {
      priority: 'low',
      text: "Consider other optional courses and hobbies that align with your interests.",
      supportTypes: ['lightbulb', 'book']
    }
  ];

  resultsData.forEach(res => {
    const card = document.createElement('div');
    card.className = 'card-priority ' + (res.priority === 'high' ? 'priority-high' : res.priority === 'medium' ? 'priority-medium' : 'priority-low');

    const text = document.createElement('p');
    text.textContent = res.text;
    card.appendChild(text);

    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'support-icons';

    const iconsMap = {
      book: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
      lightbulb: "https://cdn-icons-png.flaticon.com/512/1487/1487953.png",
      people: "https://cdn-icons-png.flaticon.com/512/64/64572.png",
      certificate: "https://cdn-icons-png.flaticon.com/512/1239/1239388.png"
    };

    res.supportTypes.forEach(type => {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'support-icon';

      const img = document.createElement('img');
      img.src = iconsMap[type];
      img.alt = type;
      iconDiv.appendChild(img);

      const span = document.createElement('span');
      span.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      iconDiv.appendChild(span);

      iconsDiv.appendChild(iconDiv);
    });

    card.appendChild(iconsDiv);
    resultsCards.appendChild(card);
  });
}

// Navigation Handlers
startBtn.addEventListener('click', () => {
  showPage(pageUserType);
});
userCards.forEach(card => {
  card.addEventListener('click', () => {
    const type = card.getAttribute('data-type');
    loadQuestionnaire(type);
  });
});
submitAnswersBtn.addEventListener('click', () => {
  generateResults();
  showPage(pageResults);
});

document.getElementById('save-plan-btn').addEventListener('click', () => {
  alert('Plan saved! (Prototype feature)');
});

// AI Chat handlers
document.getElementById('open-ai-chat').addEventListener('click', () => {
  showPage(pageAIChat);
  chatWindow.textContent = "AI Mentor: Hello! Ask me any career question.";
  chatInput.value = '';
  chatInput.focus();
});
backFromChatBtn.addEventListener('click', () => {
  showPage(pageResults);
});
sendChatBtn.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (text === '') return;
  appendChatMessage('You: ' + text);
  chatInput.value = '';
  scrollChatToBottom();

  setTimeout(() => {
    const aiResponse = generateAIResponse(text);
    appendChatMessage('AI Mentor: ' + aiResponse);
    scrollChatToBottom();
  }, 800);
});

function appendChatMessage(msg) {
  chatWindow.textContent += '\n' + msg;
}
function scrollChatToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
function generateAIResponse(input) {
  input = input.toLowerCase();
  if (input.includes('resume')) {
    return 'Make sure your resume highlights your skills and experiences clearly.';
  } else if (input.includes('job') || input.includes('career')) {
    return 'Consider upskilling in trending technologies relevant to your field.';
  } else if (input.includes('interview')) {
    return 'Practice common interview questions and prepare examples of your work.';
  }
  return 'That is interesting! Can you please elaborate?';
}

// Schedule handlers
document.getElementById('open-schedule').addEventListener('click', () => {
  showPage(pageSchedule);
  refreshScheduleList();
  eventInput.value = '';
  eventInput.focus();
});
backFromScheduleBtn.addEventListener('click', () => {
  showPage(pageResults);
});
addEventBtn.addEventListener('click', () => {
  const eventText = eventInput.value.trim();
  if (eventText === '') return;
  scheduleEvents.push(eventText);
  eventInput.value = '';
  refreshScheduleList();
  eventInput.focus();
});
function refreshScheduleList() {
  scheduleList.innerHTML = '';
  if (scheduleEvents.length === 0) {
    scheduleList.innerHTML = '<p>(No scheduled events yet)</p>';
    return;
  }
  scheduleEvents.forEach((event, i) => {
    const div = document.createElement('div');
    div.textContent = event;
    scheduleList.appendChild(div);
  });
}